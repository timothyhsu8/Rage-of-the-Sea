import PlayerController from "../AI/PlayerController";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import EnemyAI from "../AI/EnemyAI";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import BattleManager from "../GameSystems/BattleManager";
import BattlerAI from "../AI/BattlerAI";
import GameOver from "./GameOver";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import Ability, {AbilityTypes} from "../GameSystems/items/Ability";
import Inventory from "../GameSystems/Inventory";
import { GameEvents } from "../Game_Enums";
import CharacterState from "../CharacterState";
import ItemSelectScene from "./ItemSelectScene";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import MapScene from "./MapScene";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import HelpScreen from "./MenuScenes/HelpScreen";

export default class BattleRoom extends Scene {
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

    private characterState: CharacterState;

    initScene(init: Record<string, any>): void {
        this.characterState = init.characterState;
    }

    loadScene(){
        /* FINAL PROJECT TODO - Maybe add conditionals here and use this scene to load every room for every floor */

        // Load Enemy Spritesheets
        this.load.spritesheet("kraken", "hw3_assets/spritesheets/enemies/kraken.json");
        this.load.spritesheet("lizard", "hw3_assets/spritesheets/enemies/lizard.json");
        this.load.spritesheet("sollasina", "hw3_assets/spritesheets/enemies/kraken.json");

        // Load the tilemaps
        this.load.tilemap("level", "hw3_assets/tilemaps/Floor" + this.characterState.mapState.currentFloor + ".json");
        // Load in the enemy info
        //this.load.object("floor1enemies", "hw3_assets/data/floor1enemies.json" ); 
        this.load.object("krakenData", "hw3_assets/data/EnemyData/krakenData.json");
        this.load.object("lizardData", "hw3_assets/data/EnemyData/lizardData.json");
        this.load.object("sollasinaData", "hw3_assets/data/EnemyData/sollasinaData.json");

        /* Load abilities - FINAL PROJECT TODO - Do this in loading screen or load from json */
        this.load.spritesheet("anchorswing", "hw3_assets/spritesheets/abilities/anchorswing.json");
        this.load.spritesheet("groundslam", "hw3_assets/spritesheets/abilities/groundslam.json");
        this.load.spritesheet("snipe", "hw3_assets/spritesheets/abilities/snipe.json");
    }

    unloadScene(){
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level" + this.characterState.mapState.currentFloor + "music"});
    }

    startScene(){
        /* Play Level Music */
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level" + this.characterState.mapState.currentFloor + "music", loop:"true", holdReference: true});

        // Add in the tilemap
        let tilemapLayers = this.add.tilemap("level");
        // let tilemapLayers = this.add.tilemap("level2");

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
        this.subscribeToEvents();
        this.initializePlayer();
        this.initializeEnemies();

        // Send the player and enemies to the battle manager
        this.battleManager.setPlayer(<BattlerAI>this.player._ai, this.characterState);
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
                        let owner = event.data.get("node");
                        owner.destroy();
                        this.numMonstersLeft--;
                        break;
                    }
                    case GameEvents.PLAYER_DIED:
                    {
                        this.viewport.setOffset(new Vec2(0, 0));
                        this.viewport.setZoomLevel(1);
                        this.characterState.stats.health = ((<BattlerAI>this.player._ai).health);
                        this.sceneManager.changeToScene(GameOver);
                        break;
                    }
                    case GameEvents.ROOM_CLEARED:
                    {
                        this.viewport.setOffset(new Vec2(0, 0));
                        this.viewport.setZoomLevel(1);
                        this.characterState.stats.health = ((<BattlerAI>this.player._ai).health);
                        this.characterState.itemRotation++;
                        
                        /* Item Select Screen */
                        if(this.characterState.itemRotation === 2){
                            this.characterState.itemRotation = 0;
                            this.sceneManager.changeToScene(ItemSelectScene, {characterState: this.characterState});
                        }

                        /* Map Screen */
                        else this.sceneManager.changeToScene(MapScene, {characterState: this.characterState});
                        break;
                    }
                    case GameEvents.SKIP_TO_ROOM:
                    {
                        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level" + this.characterState.mapState.currentFloor + "music"});
                        let floorNum = event.data.get("floor");
                        this.viewport.setOffset(new Vec2(0, 0));
                        this.viewport.setZoomLevel(1);
                        this.characterState.stats.health = ((<BattlerAI>this.player._ai).health);

                        /* Sets Floor */
                        if(this.characterState.mapState.currentFloor !== floorNum){
                            this.characterState.mapState.currentFloor = floorNum;
                            this.characterState.mapState.resetMap();
                        }
                        this.sceneManager.changeToScene(MapScene, {characterState: this.characterState});
                        break;
                    }
                    default:
                        break;
                }
        }

        // Update Healthbar GUI
        let health = (<BattlerAI>this.player._ai).health;
        let multiplier = this.characterState.stats.maxHealth/100;
        this.healthbar.size = new Vec2((health*2)/multiplier, 10);
        this.healthbar.position = new Vec2((health+(42*multiplier))/multiplier, 22);

        /* If all monsters are killed, advance */
        if(this.numMonstersLeft <= 0)
            this.emitter.fireEvent(GameEvents.ROOM_CLEARED, {});

        /* Game Over screen on player death */
        if(health <= 0)
            this.emitter.fireEvent(GameEvents.PLAYER_DIED, {});

        /* Skip Floor buttons pressed */
        if(HelpScreen.roomSkipping){
            const NUM_FLOORS = 6;
            for(let i=1 ; i <= NUM_FLOORS ; i++)
                if(Input.isJustPressed("floor"+i))
                    this.emitter.fireEvent(GameEvents.SKIP_TO_ROOM, {floor:i});
        }
    }

    /**
     * Handles all subscriptions to events
     */
    protected subscribeToEvents(){
        this.receiver.subscribe([
            GameEvents.ENEMY_DIED,
            GameEvents.PLAYER_DIED,
            GameEvents.ROOM_CLEARED,
            GameEvents.SKIP_TO_ROOM
        ]);
    }

    initializePlayer(): void {
        // Create the inventory
        let inventory = new Inventory(this);
        let basicAttack = Ability.createAbility(AbilityTypes.PLAYER_ANCHORSWING, this.battleManager, this);
        inventory.setBasicAttack(basicAttack);
        this.characterState.getInventory().setBasicAttack(basicAttack); // FINAL PROJECT TODO - Ideally this should be able to be done from character select

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
        this.player.position.set(5*16, 8*16);
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(5, 5)));

        this.player.addAI(PlayerController,
            {
                health: this.characterState.stats.health,
                speed: this.characterState.stats.speed,
                inventory: this.characterState.getInventory(),
                tilemap: "Floor"
            });
        this.player.setImageOffset(new Vec2(0, 17));
        this.tilemap = this.getTilemap("Floor") as OrthogonalTilemap;   // Sets tilemap in scene class

        /* Add Tweens */
        this.player.tweens.add("takedamage", {startDelay: 0, duration: 500,
            effects: [{
                    property: TweenableProperties.alpha,
                    start: 1.0,
                    end: 0.3,
                    ease: EaseFunctionType.OUT_SINE
                }
            ]
        });
    }
    
    initializeEnemies(){
        const monsterData = this.load.getObject("floorEnemies").enemies[this.characterState.mapState.currentFloor-1];// FINAL PROJECT TODO - Probably add enemy movement speed into the individual json files (and damage maybe?)
        
        let numEnemies = monsterData.numEnemies[this.randomInt(monsterData.numEnemies.length)];
        let positions = [...monsterData.positions];

        // Create an enemies array
        this.enemies = new Array(numEnemies);
        this.numMonstersLeft = numEnemies;

        // Initialize the enemies
        for(let i = 0; i < numEnemies; i++){
            /* Gets random monster data */
            let monsterInfo = this.load.getObject(monsterData.monsterTypes[this.randomInt(monsterData.monsterTypes.length)] + "Data");

            /* Create an enemy */
            this.enemies[i] = this.add.animatedSprite(monsterInfo.monsterType, "primary");

            /* Assigns random position to this enemy */
            let randomPos = positions.splice(this.randomInt(positions.length), 1)[0]
            this.enemies[i].position.set(randomPos[0], randomPos[1]);

            // Activate physics
            this.enemies[i].addPhysics(new AABB(Vec2.ZERO, new Vec2(5, 5)));

            let enemyOptions = {
                monsterType: monsterInfo.monsterType,
                defaultMode: monsterInfo.mode,
                health: monsterInfo.health,
                ability: Ability.createAbility(monsterInfo.ability, this.battleManager, this),
                player: this.player
            }

            /* Add Tweens */
            this.enemies[i].tweens.add("death", {startDelay: 0, duration: 500, onEnd: GameEvents.ENEMY_DIED,
                effects: [{property: TweenableProperties.alpha, start: 1.0, end: 0, ease: EaseFunctionType.OUT_SINE}]
            });

            this.enemies[i].addAI(EnemyAI, enemyOptions);
            this.battleManager.enemySprites = this.enemies;
        }
    }

    /* Generates a random integer in the range [0,max) FINAL PROJECT TODO - Move this somewhere else ideally */
    randomInt(max: number): number{
        return Math.floor(Math.random() * max);
    }
}