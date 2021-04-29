import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../../../Wolfie2D/Scene/Scene";
import AbilityType from "./AbilityType";

export default class GroundSlam extends AbilityType {

    initialize(options: Record<string, any>): void {
        this.damage = options.damage;
        this.cooldown = options.cooldown;
        this.chargeTime = options.chargeTime;
        this.displayName = options.displayName;
        this.spriteKey = options.spriteKey;
        this.useVolume = options.useVolume;
    }

    /* Calculates the squares to damage and returns them as an array */
    findHitArea(ownerPositionRowCol: Vec2, direction:Vec2, playerPos: Vec2) : Array<Vec2>{
        let damageTiles: Array<Vec2> = [];
        let xPos = ownerPositionRowCol.x;
        let yPos = ownerPositionRowCol.y;
        for(let i = -1 ; i <= 1 ; i++){
            damageTiles.push(new Vec2(xPos+i, yPos-1));
            damageTiles.push(new Vec2(xPos+i, yPos));
            damageTiles.push(new Vec2(xPos+i, yPos+1));
        }
        return damageTiles;
    }

    doAnimation(attacker: GameNode, direction: Vec2, abilitySprite: AnimatedSprite): void {
        abilitySprite.position = attacker.position.clone();   // Move the slice out from the player

        /* Play the slice animation w/o loop, but queue the normal animation */
        abilitySprite.animation.play("GROUNDSLAM");
        // abilitySprite.animation.queue("NORMAL", true);
    }

    doIndicatorAnimations(position: Vec2, sprite: AnimatedSprite): void{
        // sprite.position = position;
        // sprite.animation.play("GROUNDSLAM");
    }

    /* Determines if an entity is on a damage tile */
    hitsSprite(targetRowCol: Vec2, damageTiles: Array<Vec2>): boolean{
        for(let i = 0 ; i < damageTiles.length ; i++)
            if(targetRowCol.x === damageTiles[i].x && targetRowCol.y === damageTiles[i].y)
                return true;
        return false;
    }

    /* Determines if sprites overlap (Player attacking enemy) */
    hits(node: GameNode, sliceSprite: AnimatedSprite): boolean {
        return sliceSprite.boundary.overlaps(node.collisionShape);
    }

    createRequiredAssets(scene: Scene): [AnimatedSprite] {
        let ability = scene.add.animatedSprite("groundslam", "primary");
        ability.animation.play("NORMAL");
        return [ability];
    }
}