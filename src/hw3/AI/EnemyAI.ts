import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameNode, { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import BattlerAI from "./BattlerAI";
import MonsterAttack from "./EnemyStates/MonsterAttack";
import Chase from "./EnemyStates/Chase";
import Ability from "../GameSystems/items/Ability";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import StillProjectiles from "./EnemyStates/StillProjectiles";
import HelpScreen from "../Scenes/MenuScenes/HelpScreen";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import ChaseAndAttack from "./EnemyStates/ChaseAndAttack";
import Idle from "./EnemyStates/Idle";
import CharacterState from "../CharacterState";
import ItemSelectScene from "../Scenes/ItemSelectScene";

export default class EnemyAI extends StateMachineAI implements BattlerAI {
    /** The owner of this AI */
    owner: AnimatedSprite;

    /** The amount of health this entity has */
    health: number;

    /** The default movement speed of this AI */
    speed: number;

    /** A reference to the player object */
    player: GameNode;

    ability: Ability;

    knockbackable: boolean;

    abilityList: Array<Ability>;

    characterState: CharacterState

    tilemap: OrthogonalTilemap;

    walls: OrthogonalTilemap;

    inWall: boolean;

    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        
        /* Stand still and shoot projectiles */
        if(options.defaultMode === "stillprojectiles")
            this.addState(EnemyStates.DEFAULT, new StillProjectiles(this, owner, options.player, options.monsterType));

        /* Follow player but attack randomly */
        else if(options.defaultMode === "chaseandattack")
            this.addState(EnemyStates.DEFAULT, new ChaseAndAttack(this, owner, options.player, options.monsterType, options.attackInterval, options.flippable));

        else if(options.defaultMode === "idle")
            this.addState(EnemyStates.DEFAULT, new Idle(this, owner, options.player));

        /* Follow player and attack only when in range */
        else 
            this.addState(EnemyStates.DEFAULT, new Chase(this, owner, options.player, options.monsterType, options.range, options.flippable));

        this.addState(EnemyStates.MONSTERATTACK, new MonsterAttack(this, owner, options.player, options.monsterType));

        this.health = options.health;
        this.player = options.player;
        this.ability = options.ability;
        this.speed = options.speed;
        this.knockbackable = options.knockbackable;
        this.characterState = options.characterState;

        this.ability.type.setDamage(options.damage);
        this.abilityList = options.abilityList; // Only Leviathan has an ability list right now

        this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;
        this.walls = this.owner.getScene().getTilemap(options.walls) as OrthogonalTilemap;

        this.inWall = false;
        // Initialize to the default state
        this.initialize(EnemyStates.DEFAULT);

        this.getPlayerPosition();
    }

    activate(options: Record<string, any>): void {}

    damage(damage: number, knockback: number): boolean {
        if(this.owner.hasPhysics){
            this.health -= damage;
            
            /* Determine Knockback Distance */
            let knockbackDist = 0;
            (this.knockbackable)?(knockbackDist=knockback):(knockbackDist=knockback/2);
            if(this.owner.imageId === "Leviathan")
                knockbackDist = 0;

            let colrow = this.tilemap.getColRowAt(this.owner.position);
            if(!this.walls.isTileCollidable(colrow.x, colrow.y))
                this.playKnockbackTween(knockbackDist);

            let enemyName = this.owner.imageId.toLowerCase();
            // if(enemyName === "carrier") // Use same damage sound for carrier as kraken
            //     enemyName = "kraken";

            // this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: enemyName + "Damage"});


            /* Enemy Dies */
            if(HelpScreen.instakill || enemyName === "chest" || this.health <= 0){
                if(this.owner.imageId === "Chest")
                    this.chestDeath();

                this.owner.disablePhysics();
                this.owner.tweens.play("death");
                return true;
            }

            /* Turn Semitransparent on hit */
            else{
                let owner = this.owner;
                owner.changeColor = true;
                setTimeout(() => {
                    owner.changeColor = false;
                }, 400);
                return false;
            }
        }
        return false;
    }

    chestDeath(): void{
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "chestopen"});

        let scene = this.owner.getScene();
        const itemData = scene.load.getObject("itemData");
        let allItems = itemData.allitems;
        let randomNum = Math.floor(Math.random() * allItems.length);
        let chosenItem = allItems[randomNum];
        let itemConfirmed = false;


        if(allItems.length !== 0 && chosenItem !== null){
            
            while(!itemConfirmed){
                // Rarity test passed, give item to player
                if(chosenItem !== null && ItemSelectScene.passChestRarityTest(chosenItem.rarity)){
                    let itemicon = scene.add.sprite(chosenItem.key, "dashCD");
                    itemicon.position = this.owner.position;
                    itemicon.scale.set(1/6, 1/6);

                    let bordericon = scene.add.sprite(chosenItem.rarity + "Border", "dashCD");
                    bordericon.position = this.owner.position;
                    bordericon.scale.set(1/6, 1/6);

                    this.characterState.addToInventory(chosenItem);
                    itemConfirmed = true;
                }

                // Find a new random item if rarity test is failed
                else
                    chosenItem = allItems[Math.floor(Math.random() * allItems.length)];
            }
        }
    }

    setAbilityList(abilityList: Array<Ability>){
        this.abilityList = abilityList;
    }

    playKnockbackTween(knockbackDist: number) {
        let endPosX = this.owner.position.x;
        (this.player.position.x >= this.owner.position.x)?(endPosX-=knockbackDist):(endPosX+=knockbackDist);
        this.owner.tweens.add("knockback", {
                startDelay: 0,
                    duration: 500,
                    effects: [
                        {
                            property: TweenableProperties.posX,
                            start: this.owner.position.x,
                            end: endPosX,
                            ease: EaseFunctionType.OUT_SINE
                        }
                    ]
            });
        this.owner.tweens.play("knockback");
    }

    getPlayerPosition(): Vec2 {
        let pos = this.player.position;

        // Get the new player location
        let start = this.owner.position.clone();
        let delta = pos.clone().sub(start);

        // Iterate through the tilemap region until we find a collision
        let minX = Math.min(start.x, pos.x);
        let maxX = Math.max(start.x, pos.x);
        let minY = Math.min(start.y, pos.y);
        let maxY = Math.max(start.y, pos.y);

        // Get the wall tilemap
        let walls = <OrthogonalTilemap>this.owner.getScene().getLayer("Wall").getItems()[0];

        let minIndex = walls.getColRowAt(new Vec2(minX, minY));
        let maxIndex = walls.getColRowAt(new Vec2(maxX, maxY));

        let tileSize = walls.getTileSize();

        for(let col = minIndex.x; col <= maxIndex.x; col++){
            for(let row = minIndex.y; row <= maxIndex.y; row++){
                if(walls.isTileCollidable(col, row)){
                    // Get the position of this tile
                    let tilePos = new Vec2(col * tileSize.x + tileSize.x/2, row * tileSize.y + tileSize.y/2);

                    // Create a collider for this tile
                    let collider = new AABB(tilePos, tileSize.scaled(1/2));

                    let hit = collider.intersectSegment(start, delta, Vec2.ZERO);

                    if(hit !== null && start.distanceSqTo(hit.pos) < start.distanceSqTo(pos)){
                        // We hit a wall, we can't see the player
                        return null;
                    }
                }
            }
        }
        return pos;
    }

    // State machine defers updates and event handling to its children
    // Check super classes for details
}


export enum EnemyStates {
    DEFAULT = "default",
    MONSTERATTACK = "monsterattack",
    CHASE = "chase",
    CHASEANDATTACK = "chaseandattack",
    IDLE = "idle"
}

export enum MonsterTypes {
    KRAKEN = "kraken",
    LIZARD = "lizard",
    SOLLASINA = "sollasina",
    SOLLASINA_YELLOW = "sollasina_yellow",
    SOLLASINA_GREEN = "sollasina_green",
    CARRIER = "carrier",
    DAGON = "dagon",
    UMIBOZU = "umibozu",
    CTHULU = "cthulu",
    LEVIATHAN = "leviathan",
    HASTUR = "hastur",
    CHEST = "chest"
}