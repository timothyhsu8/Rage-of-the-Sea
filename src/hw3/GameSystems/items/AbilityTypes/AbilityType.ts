import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import Scene from "../../../../Wolfie2D/Scene/Scene";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

export default abstract class AbilityType {
    /** The key for this sprite image */
    spriteKey: string;

    /** How much damage this weapon does */
    damage: number;

    /** Display name */
    displayName: string;

    /** The use cooldown of the weapon */
    cooldown: number;

    /** The amount of time this ability takes to charge before dealing damage */
    chargeTime: number;

    /** How loud it is to use this weapon */
    useVolume: number;

    hasTileAnimations: boolean;

    /**
     * Initializes this weapon type with data
     */
    abstract initialize(options: Record<string, any>): void;

    abstract findHitArea(ownerPositionRowCol: Vec2, direction: Vec2, playerPos: Vec2) : Array<Vec2>

    /**
     * The animation to do when this weapon is used
     */
    abstract doAnimation(...args: any): void;

    abstract doIndicatorAnimations(position: Vec2, sprite: AnimatedSprite): void;

    abstract createRequiredAssets(scene: Scene): Array<any>;

    abstract hitsSprite(targetRowCol: Vec2, damageTiles: Array<Vec2>): boolean;
    abstract hits(node: GameNode, ...args: any): boolean;
    
    setDamage(damage: number){
        this.damage = damage;
    }
}