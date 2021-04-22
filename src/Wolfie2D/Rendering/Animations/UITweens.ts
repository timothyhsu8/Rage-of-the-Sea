import Vec2 from "../../DataTypes/Vec2";
import GameNode, { TweenableProperties } from "../../Nodes/GameNode";
import Sprite from "../../Nodes/Sprites/Sprite";
import { EaseFunctionType } from "../../Utils/EaseFunctions";

export default class TweenManager {
    static fadeIn(sprite: GameNode, delay: number, duration: number){
        sprite.tweens.add("fadein", {startDelay: delay, duration: duration, effects: [{property: TweenableProperties.alpha, 
            start: 0, end: 1.0, ease: EaseFunctionType.OUT_SINE}]});
        sprite.tweens.play("fadein");
    }

    static fadeOut(sprite: GameNode, delay: number, duration: number){
        sprite.tweens.add("fadeout", {startDelay: delay, duration: duration, effects: [{property: TweenableProperties.alpha, 
            start: 1.0, end: 0.0, ease: EaseFunctionType.OUT_SINE}]});
        sprite.tweens.play("fadeout");
    }

    static slide(sprite: GameNode, delay: number, duration: number, start: Vec2, end: Vec2){
        sprite.tweens.add("slidein", {
            startDelay: delay, duration: duration, 
            effects: [
            {
                property: TweenableProperties.posX, 
                start: start.x, 
                end: end.x, 
                ease: EaseFunctionType.OUT_SINE
            },
            {
                property: TweenableProperties.posY, 
                start: start.y, 
                end: end.y, 
                ease: EaseFunctionType.OUT_SINE
            }
                ]});
        sprite.tweens.play("slidein");
    }

    static slideOutScene(sceneObjects: Array<GameNode>, delayStagger:number, endPosOffset:Vec2){
        for(let i=0 ; i < sceneObjects.length ; i++){
            this.slide(sceneObjects[i], delayStagger*i, 300, sceneObjects[i].position, new Vec2(sceneObjects[i].position.x+endPosOffset.x, sceneObjects[i].position.y+endPosOffset.y));
        }
    }
    
}