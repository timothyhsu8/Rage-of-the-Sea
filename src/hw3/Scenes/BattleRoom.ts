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
import MainMenu from "./MenuScenes/MainMenu";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../Wolfie2D/Utils/Color";
import PancakeColor from "../../Wolfie2D/Utils/PancakeColor";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import GameWon from "./GameWon";

export default class BattleRoom extends Scene {
    // The Game Loop boolean
    private gameLoop: boolean;

    private quitConfirmation: Array<Label>

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

    private dashCD: Sprite;

    private tilemap: OrthogonalTilemap;

    private characterState: CharacterState;

    private backgroundColor: Array<Color>;

    initScene(init: Record<string, any>): void {
        this.characterState = init.characterState;
        this.gameLoop = true
    }

    loadScene(){
        /* FINAL PROJECT TODO - Maybe add conditionals here and use this scene to load every room for every floor */

        // Load Enemy Spritesheets
        this.load.spritesheet("kraken", "hw3_assets/spritesheets/enemies/kraken.json");
        this.load.spritesheet("lizard", "hw3_assets/spritesheets/enemies/lizard.json");
        this.load.spritesheet("sollasina", "hw3_assets/spritesheets/enemies/sollasina.json");
        this.load.spritesheet("sollasina_yellow", "hw3_assets/spritesheets/enemies/sollasina_yellow.json");
        this.load.spritesheet("sollasina_green", "hw3_assets/spritesheets/enemies/sollasina_green.json");
        this.load.spritesheet("carrier", "hw3_assets/spritesheets/enemies/carrier.json");
        this.load.spritesheet("dagon", "hw3_assets/spritesheets/enemies/dagon.json");
        this.load.spritesheet("umibozu", "hw3_assets/spritesheets/enemies/umibozu.json");
        this.load.spritesheet("cthulu", "hw3_assets/spritesheets/enemies/cthulu.json");
        this.load.spritesheet("leviathan", "hw3_assets/spritesheets/enemies/leviathan.json");

        // Load Enemy Audio
        this.load.audio("krakenDamage", "hw3_assets/sounds/enemysounds/krakendamage.mp3");
        this.load.audio("lizardDamage", "hw3_assets/sounds/enemysounds/lizarddamage.mp3");
        this.load.audio("sollasinaDamage", "hw3_assets/sounds/enemysounds/sollasinadamage.mp3");
        this.load.audio("sollasina_yellowDamage", "hw3_assets/sounds/enemysounds/sollasinadamage.mp3");
        this.load.audio("sollasina_greenDamage", "hw3_assets/sounds/enemysounds/sollasinadamage.mp3");
        this.load.audio("carrierDamage", "hw3_assets/sounds/enemysounds/krakendamage.mp3");
        this.load.audio("dagonDamage", "hw3_assets/sounds/enemysounds/dagondamage.mp3");
        this.load.audio("umibozuDamage", "hw3_assets/sounds/enemysounds/umibozudamage.mp3");
        this.load.audio("cthuluDamage", "hw3_assets/sounds/enemysounds/cthuludamage.mp3");
        this.load.audio("leviathanDamage", "hw3_assets/sounds/enemysounds/lizarddamage.mp3");

        // Load the tilemaps
        this.load.tilemap("level", "hw3_assets/tilemaps/Floor" + this.characterState.mapState.currentFloor + ".json");
        
        // Load in the enemy info
        this.load.object("krakenData", "hw3_assets/data/EnemyData/krakenData.json");
        this.load.object("lizardData", "hw3_assets/data/EnemyData/lizardData.json");
        this.load.object("sollasinaData", "hw3_assets/data/EnemyData/sollasinaData.json");
        this.load.object("sollasina_yellowData", "hw3_assets/data/EnemyData/sollasina_yellowData.json");
        this.load.object("sollasina_greenData", "hw3_assets/data/EnemyData/sollasina_greenData.json");
        this.load.object("carrierData", "hw3_assets/data/EnemyData/carrierData.json");
        this.load.object("dagonData", "hw3_assets/data/EnemyData/dagonData.json");
        this.load.object("umibozuData", "hw3_assets/data/EnemyData/umibozuData.json");
        this.load.object("cthuluData", "hw3_assets/data/EnemyData/cthuluData.json");
        this.load.object("leviathanData", "hw3_assets/data/EnemyData/leviathanData.json");

        /* Load abilities - FINAL PROJECT TODO - Do this in loading screen or load from json */
        this.load.spritesheet("anchorswing", "hw3_assets/spritesheets/abilities/anchorswing.json");
        this.load.spritesheet("groundslam", "hw3_assets/spritesheets/abilities/groundslam.json");
        this.load.spritesheet("snipe", "hw3_assets/spritesheets/abilities/snipe.json");
        this.load.spritesheet("double_snipe", "hw3_assets/spritesheets/abilities/double_snipe.json");
        this.load.spritesheet("triple_snipe", "hw3_assets/spritesheets/abilities/triple_snipe.json");
        this.load.spritesheet("spike_line", "hw3_assets/spritesheets/abilities/spike_line.json");
        this.load.spritesheet("cross", "hw3_assets/spritesheets/abilities/cross.json");
        this.load.spritesheet("tentacle_sprout", "hw3_assets/spritesheets/abilities/tentacle_sprout.json");
        this.load.spritesheet("leviathan_spikes", "hw3_assets/spritesheets/abilities/leviathan_spikes.json");
        this.load.spritesheet("leviathan_whirlpool", "hw3_assets/spritesheets/abilities/leviathan_whirlpool.json");
        this.load.spritesheet("leviathan_rain", "hw3_assets/spritesheets/abilities/leviathan_rain.json");
    }
    unloadScene(){}

    startScene(){
        // Add in the tilemap
        let tilemapLayers = this.add.tilemap("level");
        this.walls = <OrthogonalTilemap>tilemapLayers[1].getItems()[0]; // Get wall layer

        // Set the viewport bounds to the tilemap
        let tilemapSize: Vec2 = this.walls.size; 
        this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);
        this.viewport.setOffset(new Vec2(11, 3));
        this.viewport.setZoomLevel(3);
        
        // Set background color
        const center = this.viewport.getCenter();
        this.addLayer("background", -1);
        this.backgroundColor = [new Color(20, 20, 20), new Color(8, 22, 8), new Color(35, 20, 20), new Color(35, 20, 20), 
            new Color(30, 30, 40), new Color(30, 30, 40), new Color(30, 30, 40)];
        const bgColor = <Label>this.add.uiElement(UIElementType.LABEL, "background", {position: center, text: ""});
        bgColor.size.set(2000, 2000);
        bgColor.backgroundColor = this.backgroundColor[this.characterState.mapState.currentFloor-1];

        this.addLayer("primary", 10);

        // Create the battle manager
        this.battleManager = new BattleManager();

        // UI for dash cooldown and border
        this.addLayer("dashCD", 11);
        let dashBorder =  this.add.sprite("dashborder", "dashCD");
        dashBorder.position.set(260, 275);

        this.dashCD = this.add.sprite("dashcd", "dashCD");
        this.dashCD.scale.set(1.0, 1.0);
        this.dashCD.position.set(260, 275);

        let dashbg = this.add.sprite("dashbg", "primary");
        dashbg.scale.set(1.0, 1.0);
        dashbg.position.set(260, 275);

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
        this.addUILayer("quitConfirmation");
    }

    updateScene(deltaT: number): void {
        if (Input.isJustPressed("escape")){
            // this.gameLoop = !this.gameLoop
            // if (this.gameLoop){ // unpause game
            //     for (var enemy of this.enemies){
            //         enemy.enablePhysics()
            //         enemy.setAIActive(true, {})
            //         enemy.animation.resume();
            //     }
            //     this.player.unfreeze()
            //     this.player.enablePhysics()
            //     this.player.animation.resume();
            //     this.unpauseScreen()
            // }
            // else{
            //     for (var enemy of this.enemies){ // pause game
            //         enemy.disablePhysics()
            //         enemy.setAIActive(false, {})  // stop the attacking
            //         enemy.animation.pause();
            //     }
            //     this.player.freeze()
            //     this.player.disablePhysics()
            //     this.player.animation.pause();
            //     this.pauseScreen()
            // }
        }

        if (this.gameLoop){
            /* Handles all game events */
            while(this.receiver.hasNextEvent()){
                let event = this.receiver.getNextEvent();
                    switch(event.type){
                        case GameEvents.ENEMY_DIED:
                        {
                            let owner = event.data.get("node");
                            owner.destroy();
                            this.numMonstersLeft--;

                            /* If enemy is Carrier, spawn an enemy after death */
                            if (owner.imageId == "Carrier"){
                                    // carrier respawns sollasina after death 
                                    let enemyToRespawn = "sollasina";
                                    if(this.characterState.mapState.currentFloor >= 2)
                                        enemyToRespawn = "sollasina_yellow";
                                    if(this.characterState.mapState.currentFloor >= 4)
                                        enemyToRespawn = "sollasina_green"

                                    this.respawnZombie(owner, enemyToRespawn, "stillprojectiles")
                                    
                                    // update count
                                    this.numMonstersLeft++;
                                }
                            break;
                        }
                        case GameEvents.PLAYER_DIED:
                        {
                            this.viewport.setOffset(new Vec2(0, 0));
                            this.viewport.setZoomLevel(1);
                            this.characterState.stats.health = ((<BattlerAI>this.player._ai).health);
                            this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level" + this.characterState.mapState.currentFloor + "music"});
                            this.sceneManager.changeToScene(GameOver);
                            break;
                        }
                        case GameEvents.WON_GAME:
                        {
                            this.viewport.setOffset(new Vec2(0, 0));
                            this.viewport.setZoomLevel(1);
                            this.characterState.stats.health = ((<BattlerAI>this.player._ai).health);
                            this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level" + this.characterState.mapState.currentFloor + "music"});
                            this.sceneManager.changeToScene(GameWon, {});
                            break; 
                        }
                        case GameEvents.ROOM_CLEARED:
                        {
                            this.viewport.setOffset(new Vec2(0, 0));
                            this.viewport.setZoomLevel(1);
                            this.characterState.stats.health = ((<BattlerAI>this.player._ai).health);
                            this.characterState.itemRotation++;
                            
                            /* Item Select Screen */
                            if(HelpScreen.itemEveryRoom || this.characterState.itemRotation === 2){
                                this.characterState.itemRotation = 0;
                                this.sceneManager.changeToScene(ItemSelectScene, {characterState: this.characterState});
                            }

                            /* Map Screen */
                            else this.sceneManager.changeToScene(MapScene, {characterState: this.characterState});
                            break;
                        }
                        case GameEvents.SKIP_TO_ROOM:
                        {
                            let floorNum = event.data.get("floor");
                            this.viewport.setOffset(new Vec2(0, 0));
                            this.viewport.setZoomLevel(1);
                            this.characterState.stats.health = ((<BattlerAI>this.player._ai).health);

                            /* Sets Floor */
                            if(this.characterState.mapState.currentFloor !== floorNum){
                                this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level" + this.characterState.mapState.currentFloor + "music"});
                                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level" + floorNum +"music", loop:"true", holdReference: true});
                                this.characterState.mapState.currentFloor = floorNum;
                                this.characterState.mapState.resetMap();
                            }

                            /* If next room is boss room load it, otherwise load next floor as normal */
                            (this.characterState.mapState.currentFloor === 7)?(this.sceneManager.changeToScene(BattleRoom, {characterState: this.characterState})):
                                (this.sceneManager.changeToScene(MapScene, {characterState: this.characterState}));
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
            if(this.numMonstersLeft <= 0){
                if (this.characterState.mapState.currentFloor == 7){
                    this.emitter.fireEvent(GameEvents.WON_GAME, {});

                }
                else{
                    this.emitter.fireEvent(GameEvents.ROOM_CLEARED, {});
                }
            }

            /* Game Over screen on player death */
            if(health <= 0)
                this.emitter.fireEvent(GameEvents.PLAYER_DIED, {});

            /* Skip Floor buttons pressed */
            if(HelpScreen.roomSkipping){
                const NUM_FLOORS = 7;   // FINAL PROJECT TODO - Include the boss room
                for(let i=1 ; i <= NUM_FLOORS ; i++)
                    if(Input.isJustPressed("floor"+i))
                        this.emitter.fireEvent(GameEvents.SKIP_TO_ROOM, {floor:i});
            }
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
            GameEvents.SKIP_TO_ROOM,
            GameEvents.WON_GAME,
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
        this.player.position.set(5*16, 9*16);
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(5, 5)));

        this.player.addAI(PlayerController,
            {
                health: this.characterState.stats.health,
                speed: this.characterState.stats.speed,
                inventory: this.characterState.getInventory(),
                tilemap: "Floor",
                walls: "Wall",
                dashCD: this.dashCD
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

        /* Make sure required enemies are included */
        let requiredEnemies = [...monsterData.requiredEnemies];

        // Initialize the enemies
        for(let i = 0; i < numEnemies; i++){
            /* Gets random monster data */
            let monsterInfo = null;
            
            /* Create Required Enemy */
            if(requiredEnemies.length !== 0)
                monsterInfo = this.load.getObject(requiredEnemies.pop() + "Data");

            /* Create Random Enemy */
            else monsterInfo = this.load.getObject(monsterData.monsterTypes[this.randomInt(monsterData.monsterTypes.length)] + "Data");

            /* Create an enemy */
            this.enemies[i] = this.add.animatedSprite(monsterInfo.monsterType, "primary");

            /* Assigns random position to this enemy */
            let randomPos = positions.splice(this.randomInt(positions.length), 1)[0]
            this.enemies[i].position.set(randomPos[0], randomPos[1]);


            // Activate physics
            this.enemies[i].addPhysics(new AABB(Vec2.ZERO, new Vec2(monsterInfo.hitbox[0], monsterInfo.hitbox[1])));    // Create enemy physics/hitboxes
            
            /* Make stand-still enemies non-collidable */
            if(monsterInfo.mode === "stillprojectiles")
                this.enemies[i].isCollidable = false;


            /* Ability List (If applicable) */
            let abilityList = this.setAbilityList(monsterInfo.monsterType);

            let enemyOptions = {
                monsterType: monsterInfo.monsterType,
                defaultMode: monsterInfo.mode,
                health: monsterInfo.health + (this.characterState.mapState.currentFloor*1.5),
                ability: Ability.createAbility(monsterInfo.ability, this.battleManager, this),
                speed: monsterInfo.speed,
                damage: monsterInfo.damage,
                attackInterval: monsterInfo.attackInterval, // Only needed if enemy's state is ChaseAndAttack
                range: monsterInfo.range,   // Only need if enemy's state is Chase
                flippable: monsterInfo.flippable,
                abilityList: abilityList,
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

    /* Generates a random integer in the range [0,max) */
    randomInt(max: number): number{
        return Math.floor(Math.random() * max);
    }

    /* Spawn an enemytype monsterType with mode defaultMode at position of AnimatedSprite owner */
    respawnZombie(owner: AnimatedSprite, monsterType: string, defaultMode: string){
        console.log("respawn zombie");
        let zombie = this.add.animatedSprite(monsterType, "primary")
        zombie.active = true
        // append zombie to list
        this.enemies.push(zombie)

        // use the same position as enemy that died
        zombie.position.set(owner.position.x, owner.position.y);

        let monsterInfo = this.load.getObject(monsterType + "Data");
        // Activate physics
        zombie.addPhysics(new AABB(Vec2.ZERO, new Vec2(monsterInfo.hitbox[0], monsterInfo.hitbox[1])));  ;

        /* Make stand-still enemies non-collidable */
        if(monsterInfo.mode === "stillprojectiles")
            zombie.isCollidable = false;

        /* Ability List (If applicable) */
        let abilityList = this.setAbilityList(monsterInfo.monsterType);

        let enemyOptions = {
            monsterType: monsterInfo.monsterType,
            defaultMode: monsterInfo.mode,
            health: (monsterInfo.health + (this.characterState.mapState.currentFloor*1.5))/2,
            ability: Ability.createAbility(monsterInfo.ability, this.battleManager, this),
            speed: monsterInfo.speed,
            damage: monsterInfo.damage,
            attackInterval: monsterInfo.attackInterval, // Only needed if enemy's state is ChaseAndAttack
            range: monsterInfo.range,   // Only need if enemy's state is Chase
            flippable: monsterInfo.flippable,
            abilityList: abilityList,
            player: this.player
        }

        /* Add Tweens */
        zombie.tweens.add("death", {startDelay: 0, duration: 500, onEnd: GameEvents.ENEMY_DIED,
            effects: [{property: TweenableProperties.alpha, start: 1.0, end: 0, ease: EaseFunctionType.OUT_SINE}]
        });

        zombie.addAI(EnemyAI, enemyOptions);
        
        // remove destroyed enemies from enemies list
        let enemy_list = this.enemies.map(enemy => <BattlerAI>enemy._ai)
        // https://www.techiedelight.com/remove-all-falsy-values-from-an-array-in-javascript/ referenced this site for filtering out undefined values 
        let filtered = enemy_list.filter(function(x){
            return x !== undefined;
        });

        this.enemies = this.enemies.filter(function(x){
            return x.active != false;
        });

        this.battleManager.enemySprites = this.enemies;
        this.battleManager.enemies = filtered
    }

    pauseScreen(){
        this.quitConfirmation = new Array<Label>();
        const center = this.viewport.getCenter();
        const quitConfirmation = <Label>this.add.uiElement(UIElementType.LABEL, "quitConfirmation", {position: new Vec2(center.x, center.y), text:""});
        quitConfirmation.size.set(500, 325);
        quitConfirmation.borderColor = PancakeColor.PINK;
        quitConfirmation.backgroundColor = PancakeColor.MAGENTA;
        quitConfirmation.visible = false;

        const areYouSure = <Label>this.add.uiElement(UIElementType.LABEL, "quitConfirmation", {position: new Vec2(center.x, center.y-25), text:"Game Paused, Esc to Resume"});
        areYouSure.fontSize = 30;
        areYouSure.textColor = PancakeColor.BEIGE;
        areYouSure.font = "Merriweather";
        areYouSure.visible = false;

        const resume = <Button>this.add.uiElement(UIElementType.BUTTON, "quitConfirmation", {position: new Vec2(center.x-60, center.y+25), text: "Resume"});
        resume.size.set(110, 50);
        resume.borderWidth = 2;
        resume.borderColor = Color.WHITE;
        resume.backgroundColor = new Color(50, 50, 70, 1);
        resume.onClickEventId = "resume";
        resume.font = "Merriweather";
        resume.fontSize = 25;
        resume.visible = false;

        const quit = <Button>this.add.uiElement(UIElementType.BUTTON, "quitConfirmation", {position: new Vec2(center.x+60, center.y+25), text: "Quit"});
        quit.size.set(110, 50);
        quit.borderWidth = 2;
        quit.borderColor = Color.WHITE;
        quit.backgroundColor = new Color(50, 50, 70, 1);
        quit.onClickEventId = "quit";
        quit.font = "Merriweather";
        quit.fontSize = 25;
        quit.visible = false;

        this.quitConfirmation.push(quitConfirmation);
        this.quitConfirmation.push(areYouSure);
        // this.quitConfirmation.push(progress);
        this.quitConfirmation.push(resume);
        this.quitConfirmation.push(quit);
        for(let i=0 ; i < this.quitConfirmation.length ; i++)
        this.quitConfirmation[i].visible = true;
    }

    unpauseScreen(){
        for(let i=0 ; i < this.quitConfirmation.length ; i++)
        this.quitConfirmation[i].visible = false;
    }

    setAbilityList(monsterType: string){
        let abilityList = new Array<Ability>();
        if(monsterType === "leviathan"){
            abilityList.push(Ability.createAbility(AbilityTypes.LEVIATHAN_SPIKES, this.battleManager, this));
            abilityList.push(Ability.createAbility(AbilityTypes.LEVIATHAN_WHIRLPOOL, this.battleManager, this));
            abilityList.push(Ability.createAbility(AbilityTypes.LEVIATHAN_RAIN, this.battleManager, this));
        }

        else abilityList = null;

        return abilityList;
    }
}