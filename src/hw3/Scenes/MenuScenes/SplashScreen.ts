import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import { TweenableProperties } from "../../../Wolfie2D/Nodes/GameNode";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import UITweens from "../../../Wolfie2D/Rendering/Animations/UITweens";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../../Wolfie2D/Utils/EaseFunctions";
import LoadScreen from "./LoadScreen";

export default class SplashScreen extends Scene {    
    private splashart: Sprite;

    loadScene(){
        this.load.image("splashart", "hw3_assets/sprites/splashscreen.png");
    }

    startScene(){
        this.addLayer("primary", 10);
        const center = this.viewport.getCenter();

        /* Splash Artwork */
        this.addLayer("splashart", 9);
        this.splashart = this.add.sprite("splashart", "splashart");
        this.splashart.scale.set(3.4, 3.4);
        this.splashart.position.set(center.x, center.y);
        UITweens.fadeIn(this.splashart, 0, 700);

        /* Click To Play */
        this.addUILayer("splashScreen");
        const play = this.add.uiElement(UIElementType.BUTTON, "splashScreen", {position: new Vec2(center.x, center.y), text: ""});
        play.size.set(1650, 950);
        play.backgroundColor = Color.TRANSPARENT;
        play.onClickEventId = "play";

        // Subscribe to the button events
        this.receiver.subscribe("play");
    }
    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            if(event.type === "play"){
                this.sceneManager.changeScene(LoadScreen, {});
            }
        }
    }
}