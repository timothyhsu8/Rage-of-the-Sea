import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import NavigationPath from "../../../Wolfie2D/Pathfinding/NavigationPath";
import { hw3_Events, hw3_Names } from "../../hw3_constants";
import EnemyAI, { EnemyStates, MonsterTypes } from "../EnemyAI";
import EnemyState from "./EnemyState";
import Stack from "../../../Wolfie2D/DataTypes/Stack";

export default class Chase extends EnemyState {

    // The route this AI takes when patrolling
    protected patrolRoute: Array<Vec2>;

    // The current patrolRoute index
    protected routeIndex: number;

    // The current path
    protected currentPath: NavigationPath;

    // A return object for exiting this state
    protected retObj: Record<string, any>;

    // A reference to the player object
    protected player: GameNode;

    // A reference to the current monster
    protected owner: GameNode;

    constructor(parent: EnemyAI, owner: GameNode, player: GameNode, monsterType: MonsterTypes){
        super(parent, owner);
        this.routeIndex = 0;
        this.player = player;
        this.owner = owner;

        /* Set Navigation Path to follow player */
        let navStack = new Stack<Vec2>();
        navStack.push(player.position);
        this.currentPath = new NavigationPath(navStack);
    }

    onEnter(options: Record<string, any>): void {}

    handleInput(event: GameEvent): void {}

    update(deltaT: number): void {

        /* If player is close enough, stop and attack */
        if(Math.abs(this.player.position.x - this.owner.position.x) <= 20 && Math.abs(this.player.position.y - this.owner.position.y) <= 20 )
            this.finished(EnemyStates.MONSTERATTACK);

        /* Chase Player */
        else {
            /* Reset navigation path if completed */
            if(this.currentPath.isDone()){
                let navStack = new Stack<Vec2>(this.patrolRoute.length);
                navStack.push(this.patrolRoute[0]);
                this.currentPath = new NavigationPath(navStack);
            }

            /* Follow Player */
            else{
                this.owner.moveOnPath(this.parent.speed * deltaT, this.currentPath);
                this.owner.rotation = Vec2.UP.angleToCCW(this.currentPath.getMoveDirection(this.owner));
            }
        }
    }

    onExit(): Record<string, any> {
        return this.retObj;
    }

    getNextPath(): NavigationPath {
        let path = this.owner.getScene().getNavigationManager().getPath(hw3_Names.NAVMESH, this.owner.position, this.patrolRoute[this.routeIndex]);
        this.routeIndex = (this.routeIndex + 1)%this.patrolRoute.length;
        return path;
    }

}