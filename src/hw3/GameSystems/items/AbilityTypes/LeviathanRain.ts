import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../../../Wolfie2D/Events/GameEventType";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../../../Wolfie2D/Scene/Scene";
import AbilityType from "./AbilityType";

export default class LeviathanRain extends AbilityType {

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
        let furthestRightTile = 14, furthestLeftTile = 1;
        let furthestUpTile = 1, furthestDownTile = 7;
        let damageTileBase = new Vec2();

        /* Horizontal Lines */
        for(let i=furthestUpTile ; i <= furthestDownTile ; i++){
            for(let j=furthestLeftTile ; j <= furthestRightTile ; j++){
                let randomInt = Math.random();
                if(randomInt >= 0.25){
                    let damageTile = damageTileBase.clone();
                    damageTile.x = j;
                    damageTile.y = i;
                    damageTiles.push(damageTile);
                }
            }
        }

        return damageTiles;
    }

    doAnimation(attacker: GameNode, direction: Vec2, abilitySprite: AnimatedSprite): void {
        attacker.getEmitter().fireEvent(GameEventType.PLAY_SOUND, {key: "snipe_sound"});
    }

    doIndicatorAnimations(position: Vec2, sprite: AnimatedSprite): void{
        sprite.position = position;
        sprite.animation.play("SNIPE");
        sprite.animation.queue("NORMAL", true);
    }

    createRequiredAssets(scene: Scene): [AnimatedSprite] {
        let rain = scene.add.animatedSprite("leviathan_rain", "primary");
        rain.animation.play("NORMAL");
        return [rain];
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