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

    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        
        /* Stand still and shoot projectiles */
        if(options.defaultMode === "stillprojectiles")
            this.addState(EnemyStates.DEFAULT, new StillProjectiles(this, owner, options.player, options.monsterType));

        /* Follow player but attack randomly */
        else if(options.defaultMode === "chaseandattack")
            this.addState(EnemyStates.DEFAULT, new ChaseAndAttack(this, owner, options.player, options.monsterType, options.attackInterval, options.flippable));

        /* Follow player and attack only when in range */
        else 
            this.addState(EnemyStates.DEFAULT, new Chase(this, owner, options.player, options.monsterType, options.range, options.flippable));

        this.addState(EnemyStates.MONSTERATTACK, new MonsterAttack(this, owner, options.player, options.monsterType));

        this.health = options.health;
        this.player = options.player;
        this.ability = options.ability;
        this.speed = options.speed;
        this.ability.type.setDamage(options.damage);

        // Initialize to the default state
        this.initialize(EnemyStates.DEFAULT);

        this.getPlayerPosition();
    }

    activate(options: Record<string, any>): void {}

    damage(damage: number): void {
        this.health -= damage;
        this.playKnockbackTween();      /* FINAL PROJECT TODO - Add property to enemies to make them knockbackable */

        let enemyName = this.owner.imageId.toLowerCase();
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: enemyName + "Damage"});

        /* Enemy Dies */
        if(HelpScreen.instakill || this.health <= 0){
            this.owner.disablePhysics();
            this.owner.tweens.play("death");
        }
    }

    playKnockbackTween() {
        let endPosX = this.owner.position.x;
        (this.player.position.x >= this.owner.position.x)?(endPosX-=4):(endPosX+=4);
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
    CHASEANDATTACK = "chaseandattack"
}

export enum MonsterTypes {
    KRAKEN = "kraken",
    LIZARD = "lizard",
    SOLLASINA = "sollasina",
    SOLLASINA_YELLOW = "sollasina_yellow",
    CARRIER = "carrier",
    DAGON = "dagon"
}