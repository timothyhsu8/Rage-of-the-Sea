import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../../../Wolfie2D/Events/GameEventType";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../../../Wolfie2D/Scene/Scene";
import AbilityType from "./AbilityType";

export default class Spike_Line extends AbilityType {

    initialize(options: Record<string, any>): void {
        this.damage = options.damage;
        this.cooldown = options.cooldown;
        this.chargeTime = options.chargeTime;
        this.displayName = options.displayName;
        this.spriteKey = options.spriteKey;
        this.hasTileAnimations = false;
    }

    /* Calculates the squares to damage and returns them as an array */
    findHitArea(ownerPos: Vec2, direction: Vec2, playerPos: Vec2) : Array<Vec2>{
        let damageTiles = new Array<Vec2>();
        
        /* Attack Up or Down */
        if(direction.y >= 0.5 || direction.y <= -0.5){
            let xPos: number;
            (direction.x >= 0)?(xPos = 1):(xPos = -1);
            for(let i=0 ; i < 4 ; i++){
                 /* Attack Up */
                 if(direction.y <= -0.5){
                    damageTiles.push(new Vec2(ownerPos.x, ownerPos.y-(i+1)));
                    damageTiles.push(new Vec2(ownerPos.x+xPos, ownerPos.y-(i+1)));
                }
                /* Attack Down */
                else if(direction.y >= 0.5){
                    damageTiles.push(new Vec2(ownerPos.x, ownerPos.y+(i+1)));
                    damageTiles.push(new Vec2(ownerPos.x+xPos, ownerPos.y+(i+1)));
                }
            }
        }

        /* Attack Left or Right */
        else if(direction.x >= 0.5 || direction.x <= -0.5){
            let yPos: number;
            (direction.y >= 0)?(yPos = 1):(yPos = -1);
            for(let i=0 ; i < 4 ; i++){
                /* Attack Left */
                if(direction.x <= -0.5){
                    damageTiles.push(new Vec2(ownerPos.x-(i+1), ownerPos.y))
                    damageTiles.push(new Vec2(ownerPos.x-(i+1), ownerPos.y+yPos))
                }
                /* Attack Right */
                else if(direction.x >= 0.5){
                    damageTiles.push(new Vec2(ownerPos.x+(i+1), ownerPos.y))
                    damageTiles.push(new Vec2(ownerPos.x+(i+1), ownerPos.y+yPos))
                }
            }
        }
    
        return damageTiles;
    }

    doAnimation(attacker: GameNode, direction: Vec2, abilitySprite: AnimatedSprite): void {
        attacker.getEmitter().fireEvent(GameEventType.PLAY_SOUND, {key: "spikeline_sound"});
    }

    doIndicatorAnimations(position: Vec2, sprite: AnimatedSprite): void{
        sprite.position = position;
        sprite.position.y += 10;
        sprite.animation.play("SPIKES");
        sprite.animation.queue("NORMAL", true);
    }

    createRequiredAssets(scene: Scene): [AnimatedSprite] {
        let snipe = scene.add.animatedSprite("spike_line", "primary");
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