import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import NavigationPath from "../../../Wolfie2D/Pathfinding/NavigationPath";
import EnemyAI, { EnemyStates, MonsterTypes } from "../EnemyAI";
import EnemyState from "./EnemyState";
import Stack from "../../../Wolfie2D/DataTypes/Stack";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

export default class ChaseAndAttack extends EnemyState {

    // The route this AI takes when patrolling
    protected route: Array<Vec2>;

    // The current patrolRoute index
    protected routeIndex: number;

    // The current path
    protected currentPath: NavigationPath;

    // A return object for exiting this state
    protected retObj: Record<string, any>;

    // A reference to the player object
    protected player: GameNode;

    // A reference to the current monster
    protected owner: AnimatedSprite;

    protected attackInterval: number;

    protected attackQueued: boolean;

    protected spriteFlipped: boolean;

    protected flippable: boolean;

    protected firstAttack: boolean;

    constructor(parent: EnemyAI, owner: AnimatedSprite, player: GameNode, monsterType: MonsterTypes, attackInterval: number, flippable: boolean){
        super(parent, owner);
        this.routeIndex = 0;
        this.player = player;
        this.owner = owner;
        this.attackInterval = attackInterval;

        /* Set Navigation Path to follow player */
        let navStack = new Stack<Vec2>();
        navStack.push(player.position);
        this.currentPath = new NavigationPath(navStack);
        this.flippable = flippable;
        this.firstAttack = true;
    }

    onEnter(options: Record<string, any>): void {}

    handleInput(event: GameEvent): void {}

    update(deltaT: number): void {
        
        /* Attack at the end of the timer */
        if(!this.attackQueued){
            this.attackQueued = true;
            let state = this;

            /* Random interval for the first attack */
            if(this.firstAttack){
                this.firstAttack = false;
                let randomNum = (Math.random()*2000)+1000;
                setTimeout(() => {
                    state.finished(EnemyStates.MONSTERATTACK);
                    this.attackQueued = false;
                }, randomNum)
            }

            else{
                setTimeout(() => {
                    state.finished(EnemyStates.MONSTERATTACK);
                    this.attackQueued = false;
                }, this.attackInterval);
            }
        }

        /* Chase Player */
        /* Reset navigation path if completed */
        if(this.currentPath.isDone()){
            let navStack = new Stack<Vec2>();
            navStack.push(this.player.position);
            this.currentPath = new NavigationPath(navStack);
        }

        /* Follow Player */
        else{
            
            /* Flip sprite when moving left or right (If enemy is flippable) */  
            if(this.flippable){
                if(this.owner._velocity.x !== 0)
                    (this.owner._velocity.x >= 0.01) ? (this.spriteFlipped = false):(this.spriteFlipped = true);

                (this.spriteFlipped) ? ((<AnimatedSprite>this.owner).invertX = false):((<AnimatedSprite>this.owner).invertX = true);
            }
            
            /* Follow Player */
            this.owner.moveOnPath(this.parent.speed * deltaT, this.currentPath);
            if(!this.owner.animation.isPlaying("TAKEDAMAGE"))
                this.owner.animation.playIfNotAlready("WALK", true);
        }
        
    }

    onExit(): Record<string, any> {
        return this.retObj;
    }

}