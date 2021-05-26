import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../../../Wolfie2D/Scene/Scene";
import AbilityType from "./AbilityType";

export default class TentacleSprout extends AbilityType {

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
        let damageTiles = [ownerPositionRowCol.clone()];

        let furthestRightTile = 14, furthestLeftTile = 0;
        let furthestUpTile = 0, furthestDownTile = 7;

        /* Up Tiles */
        if(ownerPositionRowCol.y-2 > furthestUpTile){
            for(let i=-2 ; i < 3 ; i++){
                let newTile = ownerPositionRowCol.clone();
                newTile.x += i;
                newTile.y -= 2;
                damageTiles.push(newTile);
            }
            let newTile = ownerPositionRowCol.clone();
            newTile.y -= 3;
            damageTiles.push(newTile);
        }

        /* Down Tiles */
        if(ownerPositionRowCol.y+2 <= furthestDownTile){
            for(let i=-2 ; i < 3 ; i++){
                let newTile = ownerPositionRowCol.clone();
                newTile.x += i;
                newTile.y += 2;
                damageTiles.push(newTile);
            }
            let newTile = ownerPositionRowCol.clone();
            newTile.y += 3;
            damageTiles.push(newTile);
        }

        /* Right Tiles */
        if(ownerPositionRowCol.x+2 <= furthestRightTile){
            for(let i=-1 ; i < 2 ; i++){
                let newTile = ownerPositionRowCol.clone();
                newTile.x += 2;
                newTile.y += i;
                damageTiles.push(newTile);
            }
            let newTile = ownerPositionRowCol.clone();
            newTile.x += 1;
            damageTiles.push(newTile);

            let newTile2 = ownerPositionRowCol.clone();
            newTile2.x += 3;
            damageTiles.push(newTile2);
        }

        /* Left Tiles */
        if(ownerPositionRowCol.x-2 >= furthestLeftTile){
            for(let i=-1 ; i < 2 ; i++){
                let newTile = ownerPositionRowCol.clone();
                newTile.x -= 2;
                newTile.y += i;
                damageTiles.push(newTile);
            }
            let newTile = ownerPositionRowCol.clone();
            newTile.x -= 1;
            damageTiles.push(newTile);
            
            let newTile2 = ownerPositionRowCol.clone();
            newTile2.x -= 3;
            damageTiles.push(newTile2);
        }


        return damageTiles;
    }

    doAnimation(attacker: GameNode, direction: Vec2, abilitySprite: AnimatedSprite): void {
        //attacker.getEmitter().fireEvent(GameEventType.PLAY_SOUND, {key: "snipe_sound"});
    }

    doIndicatorAnimations(position: Vec2, sprite: AnimatedSprite): void{
        sprite.position = position;
        sprite.position.y += 10;
        sprite.animation.play("SPROUT");
        sprite.animation.queue("NORMAL", true);
    }

    createRequiredAssets(scene: Scene): [AnimatedSprite] {
        let snipe = scene.add.animatedSprite("tentacle_sprout", "primary");
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