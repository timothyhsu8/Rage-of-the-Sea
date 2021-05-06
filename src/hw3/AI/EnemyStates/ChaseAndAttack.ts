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

    constructor(parent: EnemyAI, owner: AnimatedSprite, player: GameNode, monsterType: MonsterTypes, attackInterval: number){
        super(parent, owner);
        this.routeIndex = 0;
        this.player = player;
        this.owner = owner;
        this.attackInterval = attackInterval;

        /* Set Navigation Path to follow player */
        let navStack = new Stack<Vec2>();
        navStack.push(player.position);
        this.currentPath = new NavigationPath(navStack);
    }

    onEnter(options: Record<string, any>): void {}

    handleInput(event: GameEvent): void {}

    update(deltaT: number): void {
        
        /* Attack at the end of the timer */
        if(!this.attackQueued){
            this.attackQueued = true;
            let state = this;
            setTimeout(() => {
                state.finished(EnemyStates.MONSTERATTACK);
                this.attackQueued = false;
            }, this.attackInterval);
        }

        /* Chase Player */
        /* Reset navigation path if completed */
        if(this.currentPath.isDone()){
            let navStack = new Stack<Vec2>(this.route.length);
            navStack.push(this.route[0]);
            this.currentPath = new NavigationPath(navStack);
        }

        /* Follow Player */
        else{   
            this.owner.moveOnPath(this.parent.speed * deltaT, this.currentPath);
            
            if(!this.owner.animation.isPlaying("TAKEDAMAGE"))
                this.owner.animation.playIfNotAlready("WALK", true);
        }
        
    }

    onExit(): Record<string, any> {
        return this.retObj;
    }

}