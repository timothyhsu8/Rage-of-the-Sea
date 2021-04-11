import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Timer from "../../../Wolfie2D/Timing/Timer";
import Ability, {AbilityTypes} from "../../GameSystems/items/Ability";
import EnemyAI, { EnemyStates, MonsterTypes } from "../EnemyAI";
import EnemyState from "./EnemyState";

export default class MonsterAttack extends EnemyState {
    // Timers for managing this state
    pollTimer: Timer;
    exitTimer: Timer;

    // The current known position of the player
    playerPos: Vec2;

    // The last known position of the player
    lastPlayerPos: Vec2;

    // The return object for this state
    retObj: Record<string, any>;

    player: GameNode;

    monsterType: MonsterTypes;

    /* Abilities are stored in a Map */
    abilityMap: Map<AbilityTypes, Ability>;

    constructor(parent: EnemyAI, owner: GameNode, player: GameNode, monsterType: MonsterTypes){
        super(parent, owner);

        this.monsterType = monsterType;
        this.player = player;

        // Regularly update the player location
        this.pollTimer = new Timer(100);
        this.exitTimer = new Timer(1000);
    }

    onEnter(options: Record<string, any>): void {
        this.lastPlayerPos = this.parent.getPlayerPosition();

        // Reset the return object
        this.retObj = {};
    }

    handleInput(event: GameEvent): void {}

    update(deltaT: number): void {
        /* Find Monster Type and choose the appropriate attack state */
        switch(this.monsterType){
            case MonsterTypes.KRAKEN:
                if(Math.abs(this.player.position.x - this.owner.position.x) <= 20 && Math.abs(this.player.position.y - this.owner.position.y) <= 20 ){
                    //this.parent.ability = new Ability(new GroundSlam(10, 1000, "Ground Slam", "groundslam", ), );
                    let dir = this.player.position.clone().sub(this.owner.position).normalize();
                    if(this.parent.ability.cast(this.owner, "enemy", dir)){
                        // If we fired, face that direction
                        this.owner.rotation = Vec2.UP.angleToCCW(dir);
                    }
                }
                    //console.log("Kraken Attack");
                else this.finished(EnemyStates.DEFAULT);
                break;

            default:
                console.log("Enemy Attack");
                this.finished(EnemyStates.DEFAULT);
                break;
        }
        
        // if(this.pollTimer.isStopped()){
        //     // Restart the timer
        //     this.pollTimer.start();

        //     this.playerPos = this.parent.getPlayerPosition();

        //     if(this.playerPos !== null){
        //         // If we see a new player position, update the last position
        //         this.lastPlayerPos = this.playerPos;
        //     }
        // }

        // if(this.playerPos !== null){
        //     // Player is visible, restart the exitTimer
        //     this.exitTimer.start();

        //     // Fire at player
        //     let dir = this.playerPos.clone().sub(this.owner.position).normalize();
        //     dir.rotateCCW(Math.PI / 4 * Math.random() - Math.PI/8);
        //     if(this.parent.weapon.use(this.owner, "enemy", dir)){
        //         // If we fired, face that direction
        //         this.owner.rotation = Vec2.UP.angleToCCW(dir);
        //     }

        // }

        // if(this.exitTimer.isStopped()){
        //     // We haven't seen the player in a while, go check out where we last saw them, if possible
        //     if(this.lastPlayerPos !== null){
        //         this.retObj = {target: this.lastPlayerPos}
        //         this.finished(EnemyStates.ALERT);
        //     } else {
        //         this.finished(EnemyStates.DEFAULT);
        //     }
        // }
    }

    onExit(): Record<string, any> {
        return this.retObj;
    }

}