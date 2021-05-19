import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../../../Wolfie2D/Events/GameEventType";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../../../Wolfie2D/Scene/Scene";
import AbilityType from "./AbilityType";

export default class AnchorPush extends AbilityType {

    knockback: number;

    initialize(options: Record<string, any>): void {
        this.damage = options.damage;
        this.cooldown = options.cooldown;
        this.chargeTime = options.chargeTime;
        this.displayName = options.displayName;
        this.spriteKey = options.spriteKey;
        this.hasTileAnimations = false;
        this.knockback = options.knockback;
    }

    /* Calculates the squares to damage and returns them as an array */
    findHitArea(ownerPositionRowCol: Vec2, direction: Vec2) : Array<Vec2>{
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

    doAnimation(attacker: GameNode, direction: Vec2, sliceSprite: AnimatedSprite): void {
        // Play Sound
        attacker.getEmitter().fireEvent(GameEventType.PLAY_SOUND, {key: "anchorswing_sound"});

        // Rotate this with the game node
        sliceSprite.rotation = attacker.rotation;
        sliceSprite.scale.set(1.3, 1.3);

        // Move the slice out from the player
        sliceSprite.position = attacker.position.clone().add(direction.scaled(25));

        // Play the slice animation w/o loop, but queue the normal animation
        sliceSprite.animation.play("SWING");
        sliceSprite.animation.queue("NORMAL", true);
    }

    doIndicatorAnimations(position: Vec2, sprite: AnimatedSprite): void{}

    createRequiredAssets(scene: Scene): [AnimatedSprite] {
        let swing = scene.add.animatedSprite("anchorpush", "primary");
        swing.animation.play("NORMAL", true);
        return [swing];
    }

    /* Determines if an entity is on a damage tile */
    hitsSprite(targetRowCol: Vec2, damageTiles: Array<Vec2>): boolean{
        for(let i = 0 ; i <= damageTiles.length ; i++)
            if(targetRowCol.x === damageTiles[i].x && targetRowCol.y === damageTiles[i].y)
                return true;
        return false;
    }

    hits(node: GameNode, sliceSprite: AnimatedSprite): boolean {
        return sliceSprite.boundary.overlaps(node.collisionShape);
    }
}