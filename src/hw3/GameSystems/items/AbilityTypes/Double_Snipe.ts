import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../../../Wolfie2D/Events/GameEventType";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../../../Wolfie2D/Scene/Scene";
import AbilityType from "./AbilityType";

export default class Double_Snipe extends AbilityType {

    initialize(options: Record<string, any>): void {
        this.damage = options.damage;
        this.cooldown = options.cooldown;
        this.chargeTime = options.chargeTime;
        this.displayName = options.displayName;
        this.spriteKey = options.spriteKey;
        this.useVolume = options.useVolume;
        this.hasTileAnimations = false;
    }

    /* Calculates the squares to damage and returns them as an array */
    findHitArea(ownerPositionRowCol: Vec2, direction: Vec2, playerPos: Vec2) : Array<Vec2>{
        let damageTiles: Array<Vec2> = [playerPos.clone()];
        
        /* Calculate random 2nd spot to snipe */
        let damageTile2 = playerPos;
        let sameSpot = false;
        let randomX = Math.random();
        let randomY = Math.random();
        (randomX > 0.33)?(damageTile2.x +=1):(damageTile2.x -= 1);
        if(randomX > 0.66){
            damageTile2.x -= 1;
            sameSpot = true;
        }

        (randomY > 0.33)?(damageTile2.y +=1):(damageTile2.y -= 1);
        if(randomY > 0.66 && !sameSpot)
            damageTile2.y -=1;

        damageTiles.push(damageTile2);
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
        let snipe = scene.add.animatedSprite("double_snipe", "primary");
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