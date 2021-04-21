import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../../Wolfie2D/Scene/Layer";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import LoadScreen from "./LoadScreen";
import MainMenu from "./MainMenu";

export default class SplashScreen extends Scene {    
    private splashScreen: Layer;

    loadScene(){
        this.load.image("splashart", "hw3_assets/sprites/splashscreen.png");
    }

    startScene(){
        this.addLayer("primary", 10);
        const center = this.viewport.getCenter();

        /* Splash Artwork */
        this.addLayer("splashart", 9);
        let splashart = this.add.sprite("splashart", "splashart");
        splashart.scale.set(3.4, 3.4);
        splashart.position.set(center.x, center.y);

        /* Click To Play */
        this.splashScreen = this.addUILayer("splashScreen");
        const play = this.add.uiElement(UIElementType.BUTTON, "splashScreen", {position: new Vec2(center.x, center.y), text: ""});
        play.size.set(1600, 900);
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