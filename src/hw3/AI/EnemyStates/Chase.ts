import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import NavigationPath from "../../../Wolfie2D/Pathfinding/NavigationPath";
import EnemyAI, { EnemyStates, MonsterTypes } from "../EnemyAI";
import EnemyState from "./EnemyState";
import Stack from "../../../Wolfie2D/DataTypes/Stack";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

export default class Chase extends EnemyState {

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

    protected range: number;

    protected flippable: boolean;

    protected spriteFlipped: boolean;

    constructor(parent: EnemyAI, owner: AnimatedSprite, player: GameNode, monsterType: MonsterTypes, range: number, flippable: boolean){
        super(parent, owner);
        this.routeIndex = 0;
        this.player = player;
        this.owner = owner;
        this.range = range;

        /* Set Navigation Path to follow player */
        let navStack = new Stack<Vec2>();
        navStack.push(player.position);
        this.currentPath = new NavigationPath(navStack);
        this.spriteFlipped = false;
        this.flippable = flippable;
    }

    onEnter(options: Record<string, any>): void {}

    handleInput(event: GameEvent): void {}

    update(deltaT: number): void {
        /* If player is close enough, stop and attack */
        
        if(Math.abs(this.player.position.x - this.owner.position.x) <= this.range && Math.abs(this.player.position.y - this.owner.position.y) <= this.range )
            this.finished(EnemyStates.MONSTERATTACK);

        /* Chase Player */
        else {
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
    }

    onExit(): Record<string, any> {
        return this.retObj;
    }

}