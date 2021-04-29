import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../../../Wolfie2D/Scene/Scene";
import AbilityType from "./AbilityType";

export default class Snipe extends AbilityType {

    initialize(options: Record<string, any>): void {
        this.damage = options.damage;
        this.cooldown = options.cooldown;
        this.chargeTime = options.chargeTime;
        this.displayName = options.displayName;
        this.spriteKey = options.spriteKey;
        this.useVolume = options.useVolume;
    }

    /* Calculates the squares to damage and returns them as an array */
    findHitArea(ownerPositionRowCol: Vec2, direction: Vec2, playerPos: Vec2) : Array<Vec2>{
        /* FINAL PROJECT TODO - Make sure abilties don't try to calculate something that's out of bounds */
        let damageTiles: Array<Vec2> = [playerPos];
        
        return damageTiles;
    }

    doAnimation(attacker: GameNode, direction: Vec2, sliceSprite: AnimatedSprite): void {
        // Rotate this with the game node
        sliceSprite.rotation = attacker.rotation;

        // Move the slice out from the player
        sliceSprite.position = attacker.position.clone().add(direction.scaled(0));

        // Play the slice animation w/o loop, but queue the normal animation
        sliceSprite.animation.play("SLICE");
        sliceSprite.animation.queue("NORMAL", true);
    }

    doIndicatorAnimations(position: Vec2, sprite: AnimatedSprite): void{
        sprite.position = position;
        sprite.animation.play("SLICE");
        sprite.animation.queue("NORMAL", true);
    }

    createRequiredAssets(scene: Scene): [AnimatedSprite] {
        let slice = scene.add.animatedSprite("snipe", "primary");
        slice.animation.play("NORMAL");
        return [slice];
    }

    /* Determines if an entity is on a damage tile */
    hitsSprite(targetRowCol: Vec2, damageTiles: Array<Vec2>): boolean{
        for(let i = 0 ; i < damageTiles.length ; i++)
            if(targetRowCol.x === damageTiles[i].x && targetRowCol.y === damageTiles[i].y)
                return true;
        return false;
    }

    hits(node: GameNode, sliceSprite: AnimatedSprite): boolean {
        return sliceSprite.boundary.overlaps(node.collisionShape);
    }
}