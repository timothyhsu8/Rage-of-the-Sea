import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import NavigationPath from "../../../Wolfie2D/Pathfinding/NavigationPath";
import EnemyAI, { EnemyStates, MonsterTypes } from "../EnemyAI";
import EnemyState from "./EnemyState";
import Stack from "../../../Wolfie2D/DataTypes/Stack";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

export default class StillProjectiles extends EnemyState {

    // A return object for exiting this state
    protected retObj: Record<string, any>;

    protected player: GameNode;

    protected owner: AnimatedSprite;

    constructor(parent: EnemyAI, owner: AnimatedSprite, player: GameNode, monsterType: MonsterTypes){
        super(parent, owner);
        this.player = player;
        this.owner = owner;
    }

    onEnter(options: Record<string, any>): void {}

    handleInput(event: GameEvent): void {}

    update(deltaT: number): void {
        /* Stand still and shoot projectiles */
        if(this.player.position !== null)
            this.finished(EnemyStates.MONSTERATTACK);
    }

    onExit(): Record<string, any> {
        return this.retObj;
    }

}