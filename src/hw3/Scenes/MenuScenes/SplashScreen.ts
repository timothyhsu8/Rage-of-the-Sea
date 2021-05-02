import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import UITweens from "../../../Wolfie2D/Rendering/Animations/UITweens";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import LoadScreen from "./LoadScreen";

export default class SplashScreen extends Scene {    
    private splashart: Sprite;
    private flashingText: Sprite;

    loadScene(){
        /* Load Audio */
        this.load.audio("click", "hw3_assets/sounds/click.mp3");
        this.load.audio("mainmenu_music", "hw3_assets/music/mainmenu.mp3");

        this.load.image("clicktoplay", "hw3_assets/sprites/backgroundart/clicktoplay.png");
        this.load.image("splashart", "hw3_assets/sprites/backgroundart/splashscreen.png");
        
        /* Load Item Data */
        this.load.object("itemInfo", "hw3_assets/data/itemData.json");
    }

    unloadScene(){
        this.load.keepAudio("click");
        this.load.keepAudio("mainmenu_music");
        this.load.keepObject("itemInfo");
    }

    startScene(){
        this.addLayer("primary", 10);
        const center = this.viewport.getCenter();
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "mainmenu_music", loop:"true", holdReference: true});

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

        /* Click To Play Text */
        this.flashingText = this.add.sprite("clicktoplay", "primary");
        this.flashingText.position.set(center.x, center.y+350);
        this.flashingText.alpha = 0;

        // Subscribe to the button events
        this.receiver.subscribe("play");
    }
    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            if(event.type === "play"){
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "click"});
                UITweens.fadeOut(this.splashart, 0, 300);
                UITweens.fadeOut(this.flashingText, 0, 300);
                let sceneManager = this.sceneManager;
                setTimeout(() => {
                    sceneManager.changeToScene(LoadScreen, {});
                }, 300);
            }
        }

        if(this.flashingText.alpha === 0)
            UITweens.fadeIn(this.flashingText, 0, 950);

        if(this.flashingText.alpha === 1)
            UITweens.fadeOut(this.flashingText, 0, 950);

    }
}