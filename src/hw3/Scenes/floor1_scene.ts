import PlayerController from "../AI/PlayerController";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import PositionGraph from "../../Wolfie2D/DataTypes/Graphs/PositionGraph";
import Navmesh from "../../Wolfie2D/Pathfinding/Navmesh";
import {hw3_Names} from "../hw3_constants";
import EnemyAI from "../AI/EnemyAI";
import WeaponType from "../GameSystems/items/WeaponTypes/WeaponType";
import RegistryManager from "../../Wolfie2D/Registry/RegistryManager";
import Weapon from "../GameSystems/items/Weapon";
import Healthpack from "../GameSystems/items/Healthpack";
import InventoryManager from "../GameSystems/InventoryManager";
import Item from "../GameSystems/items/Item";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import BattleManager from "../GameSystems/BattleManager";
import BattlerAI from "../AI/BattlerAI";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../Wolfie2D/Utils/Color";
import Input from "../../Wolfie2D/Input/Input";
import GameOver from "./GameOver";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import Ability, {AbilityTypes} from "../GameSystems/items/Ability";
import AbilityType from "../GameSystems/items/AbilityTypes/AbilityType"
import Registry from "../../Wolfie2D/Registry/Registries/Registry";
import Inventory from "../GameSystems/Inventory";
import { GameEvents } from "../Game_Enums";
import MainMenu from "./MainMenu";
import Map_Scene from "./Map_Scene";

export default class floor1_scene extends Scene {
    // The player
    private player: AnimatedSprite;

    // A list of enemies
    private enemies: Array<AnimatedSprite>;

    // The number of enemies left in the room
    private numMonstersLeft: number;

    // The wall layer of the tilemap to use for bullet visualization
    private walls: OrthogonalTilemap;

    // The position graph for the navmesh
    private graph: PositionGraph;

    // A list of items in the scene
    private items: Array<Item>;

    // The battle manager for the scene
    private battleManager: BattleManager;

    // Player health
    private healthDisplay: Label;

    private healthbar: Graphic;

    private tilemap: OrthogonalTilemap;

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
        this.load.image("portrait", "hw3_assets/sprites/playerportrait.png");
        this.load.image("portraitborder", "hw3_assets/sprites/portraitborder.png");
        this.load.image("healthbarborder", "hw3_assets/sprites/healthbarborder.png");
    }

    startScene(){
        // Add in the tilemap
        let tilemapLayers = this.add.tilemap("level");

        /*  Get the wall layer
            This line is just getting the wall layer of your tilemap to use for some calculations.
            Make sure it is still doing so.

            What the line is saying is to get the first level from the bottom (tilemapLayers[1]),
            which in my case was the Walls layer.   FINAL PROJECT TODO - REMOVE COMMENT
        */
        this.walls = <OrthogonalTilemap>tilemapLayers[1].getItems()[0];

        // Set the viewport bounds to the tilemap
        let tilemapSize: Vec2 = this.walls.size; 
        this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);
        this.viewport.setOffset(new Vec2(5, 3));
        this.viewport.setZoomLevel(6);
        
        this.addLayer("primary", 10);

        // Create the battle manager
        this.battleManager = new BattleManager();

        this.initializeWeapons();
        this.initializeAbilities();
        this.subscribeToEvents();

        // Initialize the items array - this represents items that are in the game world
        this.items = new Array();

        // Create the player
        this.initializePlayer();

        // Initialize all enemies
        this.initializeEnemies();

        // Send the player and enemies to the battle manager
        this.battleManager.setPlayerAI(<BattlerAI>this.player._ai);
        this.battleManager.setEnemies(this.enemies.map(enemy => <BattlerAI>enemy._ai));
        this.battleManager.setTileMap(this.player, this.tilemap);

        // UI for healthbar
        this.addUILayer("healthbar");
        this.healthbar = this.add.graphic(GraphicType.RECT, "healthbar", {position: new Vec2(80, 5), size: new Vec2((<BattlerAI>this.player._ai).health, 5)});
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
                default:
                    console.log("Default");
                    break;
            }
        }

        let health = (<BattlerAI>this.player._ai).health;

        /* If all monsters are killed, advance */
        if(this.numMonstersLeft <= 0){
            this.viewport.setZoomLevel(1/6);
            this.sceneManager.changeScene(MainMenu);
        }

        /* Game Over screen on player death */
        if(health <= 0)
            this.sceneManager.changeScene(GameOver);
        
        // Update Healthbar GUI
        this.healthbar.size = new Vec2(health, 5);
        this.healthbar.position = new Vec2(75 - .5*(100-health), 13);
    }

    /**
     * Handles all subscriptions to events
     */
     protected subscribeToEvents(){
        this.receiver.subscribe([
            GameEvents.ENEMY_DIED
        ]);
    }

    /**
     * Creates and returns a new weapon
     * @param type The weaponType of the weapon, as a string
     */
    createWeapon(type: string): Weapon {
        let weaponType = <WeaponType>RegistryManager.getRegistry("weaponTypes").get(type);

        /* FINAL PROJECT TODO - This is setting the weapon sprite outside the viewport, but ideally it shouldn't have a sprite to begin with */
        let sprite = this.add.sprite(weaponType.spriteKey, "primary");
        sprite.position = new Vec2(-100, -100);

        return new Weapon(sprite, weaponType, this.battleManager);
    }
    
    createAbility(type: AbilityTypes){
        let abilityType = <AbilityType>RegistryManager.getRegistry("abilityTypes").get(type);    // FINAL PROJECT TODO: Make sure this is getting what it needs

        return new Ability(abilityType, this.battleManager, this);
    }

    /** 
     * Loads in all weapons from file
     */
    initializeWeapons(): void{
        let weaponData = this.load.getObject("weaponData");

        for(let i = 0; i < weaponData.numWeapons; i++){
            let weapon = weaponData.weapons[i];

            // Get the constructor of the prototype
            let constr = RegistryManager.getRegistry("weaponTemplates").get(weapon.weaponType);

            // Create a weapon type
            let weaponType = new constr();

            // Initialize the weapon type
            weaponType.initialize(weapon);

            // Register the weapon type
            RegistryManager.getRegistry("weaponTypes").registerItem(weapon.name, weaponType)
        }
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
        portrait.position = new Vec2(6, 6);

        /* Sprite for portrait border */
        let portraitborder = this.add.sprite("portraitborder", "primary");
        portraitborder.position = new Vec2(6, 6);

        /* Sprite for healthbar border */
        let healthbarborder = this.add.sprite("healthbarborder", "primary");
        healthbarborder.position = new Vec2(70, 7);

        // Create the player
        this.player = this.add.animatedSprite("player", "primary");
        this.player.position.set(4*16, 4*16);
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(5, 5)));
        this.player.addAI(PlayerController,
            {
                speed: 100,
                inventory: inventory,
                items: this.items,
                tilemap: "Floor"
            });
        this.tilemap = this.getTilemap("Floor") as OrthogonalTilemap;   // Sets tilemap in scene class
        this.player.animation.play("IDLE");
    }

    // HOMEWORK 3 - TODO
    /**
     * This function creates all enemies from the enemy.json file.
     * 
     * Patrolling enemies are given patrol routes corresponding to the navmesh. The numbers in their route correspond
     * to indices in the navmesh.
     */
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
                weapon: this.createWeapon("weak_pistol"),
                ability: this.createAbility(AbilityTypes.GROUNDSLAM),
                monsterType: data.monsterType
            }

            this.enemies[i].addAI(EnemyAI, enemyOptions);
        }
    }
}