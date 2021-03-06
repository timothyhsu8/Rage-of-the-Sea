import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../../../Wolfie2D/Events/GameEventType";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../../../Wolfie2D/Scene/Scene";
import AbilityType from "./AbilityType";

export default class Cross extends AbilityType {

    initialize(options: Record<string, any>): void {
        this.damage = options.damage;
        this.cooldown = options.cooldown;
        this.chargeTime = options.chargeTime;
        this.displayName = options.displayName;
        this.spriteKey = options.spriteKey;
        this.hasTileAnimations = false;
    }

    /* Calculates the squares to damage and returns them as an array */
    findHitArea(ownerPositionRowCol: Vec2, direction: Vec2, playerPos: Vec2) : Array<Vec2>{
        let damageTiles = new Array<Vec2>();

        let furthestRightTile = 14, furthestLeftTile = 0;
        let furthestUpTile = 0, furthestDownTile = 7;

        /* Right Tiles */
        for(let i=0 ; i <= furthestRightTile-ownerPositionRowCol.x ; i++){
            let rightTile = ownerPositionRowCol.clone();
            rightTile.x += i;
            damageTiles.push(rightTile);
        }

        /* Left Tiles */
        for(let i=0 ; i < ownerPositionRowCol.x-furthestLeftTile ; i++){
            let leftTile = ownerPositionRowCol.clone();
            leftTile.x -= i;
            damageTiles.push(leftTile);
        }

        /* Up Tiles */
        for(let i=0 ; i < ownerPositionRowCol.y-furthestUpTile ; i++){
            let upTile = ownerPositionRowCol.clone();
            upTile.y -= i;
            damageTiles.push(upTile);
        }

        /* Down Tiles */
        for(let i=0 ; i <= furthestDownTile-ownerPositionRowCol.y ; i++){
            let downTile = ownerPositionRowCol.clone();
            downTile.y += i;
            damageTiles.push(downTile);
        }


        let topRight = ownerPositionRowCol.clone();
        topRight.x += 1;
        topRight.y -= 1;

        let bottomRight = ownerPositionRowCol.clone();
        bottomRight.x += 1;
        bottomRight.y += 1;

        let topLeft = ownerPositionRowCol.clone();
        topLeft.x -= 1;
        topLeft.y -= 1;

        let bottomLeft = ownerPositionRowCol.clone();
        bottomLeft.x -= 1;
        bottomLeft.y += 1;

        damageTiles.push(topRight);
        damageTiles.push(bottomRight);
        damageTiles.push(topLeft);
        damageTiles.push(bottomLeft);


        return damageTiles;
    }

    doAnimation(attacker: GameNode, direction: Vec2, abilitySprite: AnimatedSprite): void {
        //attacker.getEmitter().fireEvent(GameEventType.PLAY_SOUND, {key: "cross_sound"});
    }

    doIndicatorAnimations(position: Vec2, sprite: AnimatedSprite): void{
        sprite.position = position;
        sprite.position.y += 10;
        sprite.animation.play("SWIRL");
        sprite.animation.queue("NORMAL", true);
    }

    createRequiredAssets(scene: Scene): [AnimatedSprite] {
        let snipe = scene.add.animatedSprite("cross", "primary");
        snipe.animation.play("NORMAL");
        return [snipe];
    }

    /* Determines if an entity is on a damage tile */
    hitsSprite(targetRowCol: Vec2, damageTiles: Array<Vec2>): boolean{
        for(let i = 0 ; i < damageTiles.length ; i++)
            if(targetRowCol.x === damageTiles[i].x && targetRowCol.y === damageTiles[i].y)
                return true;
        return false;
    }

    hits(node: GameNode, abilitySprite: AnimatedSprite): boolean {
        return abilitySprite.boundary.overlaps(node.collisionShape);
    }
}