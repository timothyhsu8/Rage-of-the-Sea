import PlayerController from "../AI/PlayerController";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import EnemyAI from "../AI/EnemyAI";
import RegistryManager from "../../Wolfie2D/Registry/RegistryManager";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import BattleManager from "../GameSystems/BattleManager";
import BattlerAI from "../AI/BattlerAI";
import GameOver from "./GameOver";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import Ability, {AbilityTypes} from "../GameSystems/items/Ability";
import AbilityType from "../GameSystems/items/AbilityTypes/AbilityType"
import Inventory from "../GameSystems/Inventory";
import { GameEvents } from "../Game_Enums";
import Map_Scene_Testing from "./Map_Scene_Testing";
import CharacterState from "../CharacterState";

export default class floor1_scene extends Scene {
    // The player
    private player: AnimatedSprite;

    // A list of enemies
    private enemies: Array<AnimatedSprite>;

    // The number of enemies left in the room
    private numMonstersLeft: number;

    // The wall layer of the tilemap to use for bullet visualization
    private walls: OrthogonalTilemap;

    // The battle manager for the scene
    private battleManager: BattleManager;

    private healthbar: Graphic;

    private tilemap: OrthogonalTilemap;

    private options: Record<string, any>;

    private characterState: CharacterState;

    initScene(init: Record<string, any>): void {
        this.characterState = init.characterState;
        console.log(this.characterState.inventory);
    }

    loadScene(){
        // Load the player and enemy spritesheets
        this.load.spritesheet("player", "hw3_assets/spritesheets/player.json");
        this.load.spritesheet("enemy", "hw3_assets/spritesheets/enemy.json");

        // Load the tilemap
        this.load.tilemap("level", "hw3_assets/tilemaps/Floor1.json");

        // Load the scene info
        this.load.object("weaponData", "hw3_assets/data/weaponData.json");
        this.load.object("abilityData", "hw3_assets/data/abilityData.json");

        // Load in the enemy info
        this.load.object("enemyData", "hw3_assets/data/enemy.json");

        // Load in item info
        this.load.object("itemData", "hw3_assets/data/items.json");

        this.load.image("inventorySlot", "hw3_assets/sprites/inventory.png");
        this.load.image("portrait", "hw3_assets/sprites/" + this.characterState.portrait + ".png");
        this.load.image("portraitborder", "hw3_assets/sprites/portraitborder.png");
        this.load.image("healthbarborder", "hw3_assets/sprites/healthbarborder.png");
    }

    startScene(){
        // Add in the tilemap
        let tilemapLayers = this.add.tilemap("level");
        this.walls = <OrthogonalTilemap>tilemapLayers[1].getItems()[0]; // Get wall layer

        // Set the viewport bounds to the tilemap
        let tilemapSize: Vec2 = this.walls.size; 
        this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);
        this.viewport.setOffset(new Vec2(11, 3));
        this.viewport.setZoomLevel(3);
        
        this.addLayer("primary", 10);

        // Create the battle manager
        this.battleManager = new BattleManager();

        // Initializations
        this.initializeAbilities();
        this.subscribeToEvents();
        this.initializePlayer();
        this.initializeEnemies();

        // Send the player and enemies to the battle manager
        this.battleManager.setPlayerAI(<BattlerAI>this.player._ai);
        this.battleManager.setEnemies(this.enemies.map(enemy => <BattlerAI>enemy._ai));
        this.battleManager.setTileMap(this.player, this.tilemap);

        // UI for healthbar
        this.addUILayer("healthbar");
        this.healthbar = this.add.graphic(GraphicType.RECT, "healthbar", {position: new Vec2(80, 5), size: new Vec2((<BattlerAI>this.player._ai).health, 10)});
    }

    updateScene(deltaT: number): void {
        /* Handles all game events */
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            switch(event.type){
                case GameEvents.ENEMY_DIED:
                {
                    this.numMonstersLeft--;
                    break;
                }
                case GameEvents.PLAYER_DIED:
                {
                    this.viewport.setOffset(new Vec2(0, 0));
                    this.viewport.setZoomLevel(1/3);
                    this.characterState.health = ((<BattlerAI>this.player._ai).health);
                    this.sceneManager.changeScene(GameOver);
                    break;
                }
                case GameEvents.ROOM_CLEARED:
                {
                    // this.characterState.getInventory().addItem(null);    // FINAL PROJECT TODO - let player choose item and add it to their inventory
                    this.viewport.setOffset(new Vec2(0, 0));
                    this.viewport.setZoomLevel(1/3);
                    this.characterState.health = ((<BattlerAI>this.player._ai).health);
                    this.sceneManager.changeScene(Map_Scene_Testing, {characterState: this.characterState});
                    break;
                }
                default:
                    console.log("Default");
                    break;
            }
        }

        // Update Healthbar GUI
        let health = (<BattlerAI>this.player._ai).health;
        this.healthbar.size = new Vec2(health*2, 10);
        this.healthbar.position = new Vec2(93 - .5*(100-(health*2)), 22);

        /* If all monsters are killed, advance */
        if(this.numMonstersLeft <= 0)
            this.emitter.fireEvent(GameEvents.ROOM_CLEARED, {});

        /* Game Over screen on player death */
        if(health <= 0)
            this.emitter.fireEvent(GameEvents.PLAYER_DIED, {});
    }

    /**
     * Handles all subscriptions to events
     */
    protected subscribeToEvents(){
        this.receiver.subscribe([
            GameEvents.ENEMY_DIED,
            GameEvents.PLAYER_DIED,
            GameEvents.ROOM_CLEARED
        ]);
    }
    
    createAbility(type: AbilityTypes){
        let abilityType = <AbilityType>RegistryManager.getRegistry("abilityTypes").get(type);    // FINAL PROJECT TODO: Make sure this is getting what it needs

        return new Ability(abilityType, this.battleManager, this);
    }

    initializeAbilities(): void{
        let abilityData = this.load.getObject("abilityData");

        for(let i = 0 ; i < abilityData.numAbilities ; i++){
            let ability = abilityData.abilities[i];

            // Get the constructor of the prototype
            let constr = RegistryManager.getRegistry("abilityTemplates").get(ability.abilityType);

             // Create a weapon type
             let abilityType = new constr();

             // Initialize the weapon type
             abilityType.initialize(ability);
 
             // Register the weapon type
             RegistryManager.getRegistry("abilityTypes").registerItem(ability.name, abilityType)
        }
    }

    initializePlayer(): void {
        // Create the inventory
        let inventory = new Inventory(this, 10);
        let basicAttack = this.createAbility(AbilityTypes.PLAYER_ANCHORSWING);
        inventory.setBasicAttack(basicAttack);

        /* Sprite for character portrait */
        let portrait = this.add.sprite("portrait", "primary");
        portrait.scale.set(1/3, 1/3);
        portrait.position = new Vec2(10, 6);

        /* Sprite for portrait border */
        let portraitborder = this.add.sprite("portraitborder", "primary");
        portraitborder.scale.set(1/3, 1/3);
        portraitborder.position = new Vec2(10, 6);

        /* Sprite for healthbar border */
        let healthbarborder = this.add.sprite("healthbarborder", "primary");
        healthbarborder.scale.set(1/3, 1/3);
        healthbarborder.position = new Vec2(135, 7);

        // Create the player
        this.player = this.add.animatedSprite("player", "primary");
        this.player.position.set(4*16, 4*16);
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(5, 5)));

        this.characterState.inventory.setBasicAttack(this.createAbility(AbilityTypes.PLAYER_ANCHORSWING)); // FINAL PROJECT TODO - Ideally this should be able to be done from character select
        this.player.addAI(PlayerController,
            {
                health: this.characterState.health,
                speed: this.characterState.speed,
                inventory: this.characterState.inventory,
                tilemap: "Floor"
            });
        this.player.setImageOffset(new Vec2(0, 17));
        //this.player.imageOffset.set();
        this.tilemap = this.getTilemap("Floor") as OrthogonalTilemap;   // Sets tilemap in scene class
        this.player.animation.play("IDLE");
    }
    
    initializeEnemies(){
        //randomizedEnemyData = // FINAL PROJECT TODO - Randomize data for enemy creation here (it should also depend on what level and such we're on)

        // Get the enemy data
        const enemyData = this.load.getObject("enemyData");

        // Create an enemies array
        this.enemies = new Array(enemyData.numEnemies);
        this.numMonstersLeft = enemyData.numEnemies;

        // Initialize the enemies
        for(let i = 0; i < enemyData.numEnemies; i++){
            let data = enemyData.enemies[i];

            // Create an enemy
            this.enemies[i] = this.add.animatedSprite("enemy", "primary");
            this.enemies[i].position.set(data.position[0], data.position[1]);
            this.enemies[i].animation.play("IDLE");

            // Activate physics
            this.enemies[i].addPhysics(new AABB(Vec2.ZERO, new Vec2(5, 5)));

            let enemyOptions = {
                defaultMode: data.mode,
                patrolRoute: data.route,            // This only matters if they're a patroller
                guardPosition: data.guardPosition,  // This only matters if the're a guard
                health: data.health,
                player: this.player,
                ability: this.createAbility(AbilityTypes.GROUNDSLAM),
                monsterType: data.monsterType
            }

            this.enemies[i].addAI(EnemyAI, enemyOptions);
            this.battleManager.enemySprites = this.enemies;
        }
    }
}