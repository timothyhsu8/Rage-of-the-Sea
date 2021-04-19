import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import State from "../../Wolfie2D/DataTypes/State/State";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import { hw3_Events } from "../hw3_constants";
import BattlerAI from "./BattlerAI";
import MonsterAttack from "./EnemyStates/MonsterAttack";
import Chase from "./EnemyStates/Chase";
import Ability from "../GameSystems/items/Ability";
import {GameEvents} from "../Game_Enums"
import MainMenu from "../Scenes/MenuScenes/MainMenu";

export default class EnemyAI extends StateMachineAI implements BattlerAI {
    /** The owner of this AI */
    owner: AnimatedSprite;

    /** The amount of health this entity has */
    health: number;

    /** The default movement speed of this AI */
    speed: number = 40;

    /** A reference to the player object */
    player: GameNode;

    ability: Ability;

    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        
        /* FINAL PROJECT TODO - Add more enemy states here */
        if(options.defaultMode === "chase"){
            this.addState(EnemyStates.DEFAULT, new Chase(this, owner, options.player, options.monsterType));
        }
        else {
            // Default state is chase
            this.addState(EnemyStates.DEFAULT, new Chase(this, owner, options.player, options.monsterType));
        }

        this.addState(EnemyStates.MONSTERATTACK, new MonsterAttack(this, owner, options.player, options.monsterType));

        this.health = options.health;
        this.player = options.player;
        this.ability = options.ability;

        // Subscribe to events
        this.receiver.subscribe(hw3_Events.SHOT_FIRED);
        console.log("Subscribed to event");

        // Initialize to the default state
        this.initialize(EnemyStates.DEFAULT);

        this.getPlayerPosition();
    }

    activate(options: Record<string, any>): void {}

    damage(damage: number): void {
        this.health -= damage;

        /* Enemy Dies */
        if(this.health <= 0){
            this.owner.setAIActive(false, {});
            this.owner.isCollidable = false;
            this.owner.visible = false;
            this.owner.positionX = -1000;
            this.emitter.fireEvent(GameEvents.ENEMY_DIED, {});
        }
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
    ALERT = "alert",
    ATTACKING = "attacking",
    PREVIOUS = "previous",
    MONSTERATTACK = "monsterattack",
    CHASE = "chase"
}

export enum MonsterTypes {
    KRAKEN = "kraken",
    LIZARD = "lizard"
}