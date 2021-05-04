import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Timer from "../../../Wolfie2D/Timing/Timer";
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

    constructor(parent: EnemyAI, owner: AnimatedSprite, player: GameNode, monsterType: MonsterTypes){
        super(parent, owner);

        this.monsterType = monsterType;
        this.player = player;

        // Regularly update the player location
        this.pollTimer = new Timer(100);
        this.exitTimer = new Timer(1000);
    }

    onEnter(options: Record<string, any>): void {
        this.lastPlayerPos = this.playerPos;

        // Reset the return object
        this.retObj = {};
    }

    handleInput(event: GameEvent): void {}

    update(deltaT: number): void {
        /* Find Monster Type and choose the appropriate attack state */
        switch(this.monsterType){
            case MonsterTypes.KRAKEN:
                /* If within 20 pixels of the player, attack */
                if(Math.abs(this.player.position.x - this.owner.position.x) <= 20 && Math.abs(this.player.position.y - this.owner.position.y) <= 20 ){
                    let dir = this.player.position.clone().sub(this.owner.position).normalize();
                    if(this.parent.ability.cast(this.owner, "enemy", dir))
                        this.owner.animation.playUninterruptable("ATTACK");
                    // if(this.parent.ability.cast(this.owner, "enemy", dir))
                    //     this.owner.rotation = Vec2.UP.angleToCCW(dir);  // If we attacked, face that direction
                }
                else this.finished(EnemyStates.DEFAULT);
                break;

            /* FINAL PROJECT TODO - Give this enemy a unique ability */
            case MonsterTypes.LIZARD:  
                if(Math.abs(this.player.position.x - this.owner.position.x) <= 20 && Math.abs(this.player.position.y - this.owner.position.y) <= 20 ){
                    let dir = this.player.position.clone().sub(this.owner.position).normalize();
                    if(this.parent.ability.cast(this.owner, "enemy", dir))
                        this.owner.animation.playUninterruptable("ATTACK");
                }
                else this.finished(EnemyStates.DEFAULT);
                break;
            
            case MonsterTypes.SOLLASINA:
            case MonsterTypes.SOLLASINA_YELLOW:  
                let dir = this.player.position.clone().sub(this.owner.position).normalize();    // Get player position
                if(this.parent.ability.cast(this.owner, "enemy", dir))
                    this.owner.animation.playUninterruptable("ATTACK");
                break;

            default:
                this.finished(EnemyStates.DEFAULT);
                break;
        }
    }

    onExit(): Record<string, any> {
        return this.retObj;
    }

}