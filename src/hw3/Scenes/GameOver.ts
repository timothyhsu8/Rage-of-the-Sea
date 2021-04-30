import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import MapScene from "./MapScene";
import MainMenu from "./MenuScenes/MainMenu";

export default class GameOver extends Scene {

    loadScene(){
        this.load.image("artwork", "hw3_assets/sprites/backgroundart/gameover.png");
    }

    startScene() {
        const center = this.viewport.getCenter();
        this.addUILayer("primary");

        /* Back Button */
        const back = <Button>this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(center.x-625, center.y-375), text: "Back To Main Menu"});
        back.size.set(275, 50);
        back.borderWidth = 2;
        back.borderColor = Color.WHITE;
        back.backgroundColor = new Color(50, 50, 70, 1);
        back.onClickEventId = "back";

        /* Game Over Artwork */
        this.addLayer("artwork", 11);
        let splashart = this.add.sprite("artwork", "artwork");
        //splashart.scale.set(3.4, 3.4);
        splashart.position.set(center.x, center.y-150);

        /* Stats Label */
        const stats = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x, center.y+300), text: ""});
        stats.backgroundColor = new Color(50, 50, 70, 1);
        stats.size.set(1600, 320);
        stats.borderWidth = 2;
        stats.borderColor = Color.WHITE;

        const gameOver = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x-625, center.y+200), text: "You were defeated..."});
        gameOver.textColor = Color.WHITE;

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