import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import UITweens from "../../Wolfie2D/Rendering/Animations/UITweens";
import Scene from "../../Wolfie2D/Scene/Scene";
import PancakeColor from "../../Wolfie2D/Utils/PancakeColor";
import MainMenu from "./MenuScenes/MainMenu";

export default class GameOver extends Scene {

    loadScene(){
        this.load.image("artwork", "hw3_assets/sprites/backgroundart/gameover.png");
    }

    startScene() {
        const center = this.viewport.getCenter();
        this.addLayer("primary", 10);
        this.addLayer("text", 11);

        /* Back Button */
        const back = <Button>this.add.uiElement(UIElementType.BUTTON, "text", {position: new Vec2(center.x-625, center.y-375), text: "Back To Main Menu"});
        back.size.set(275, 50);
        back.borderWidth = 2;
        back.borderColor = PancakeColor.PINK;
        back.backgroundColor = PancakeColor.MAGENTA;
        back.onClickEventId = "back";

        /* Game Over Artwork */
        this.addLayer("artwork", 9);
        let splashart = this.add.sprite("artwork", "artwork");
        splashart.position.set(center.x, center.y-150);
        UITweens.fadeIn(splashart, 0, 500);

        /* Stats Label */
        const stats = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x, center.y+300), text: ""});
        stats.backgroundColor = PancakeColor.MAGENTA;
        stats.borderColor = PancakeColor.PINK;
        stats.size.set(1600, 320);
        stats.borderWidth = 2;

        const gameOver = <Label>this.add.uiElement(UIElementType.LABEL, "text", {position: new Vec2(center.x-625, center.y+200), text: "You were defeated..."});
        gameOver.textColor = PancakeColor.BEIGE;

        this.receiver.subscribe("back");
    }

    updateScene(){
        while(this.receiver.hasNextEvent()){
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "click"});
            let event = this.receiver.getNextEvent();

            if(event.type === "back"){
                this.sceneManager.changeToScene(MainMenu, {});
            }
        }
    }
}