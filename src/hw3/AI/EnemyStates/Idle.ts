import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import EnemyAI, { EnemyStates, MonsterTypes } from "../EnemyAI";
import EnemyState from "./EnemyState";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

export default class Idle extends EnemyState {

    // A return object for exiting this state
    protected retObj: Record<string, any>;

    // A reference to the player object
    protected player: GameNode;

    // A reference to the current monster
    protected owner: AnimatedSprite;

    constructor(parent: EnemyAI, owner: AnimatedSprite, player: GameNode){
        super(parent, owner);
        this.player = player;
        this.owner = owner;
    }

    onEnter(options: Record<string, any>): void {}

    handleInput(event: GameEvent): void {}

    update(deltaT: number): void {        
    }

    onExit(): Record<string, any> {
        return this.retObj;
    }

}