import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import Button from "../../../Wolfie2D/Nodes/UIElements/Button";
import Inventory from "../../GameSystems/Inventory";
import CharacterState from "../../CharacterState";
import MainMenu from "./MainMenu";
import MapScene from "../MapScene";


export default class CharacterSelect extends Scene {

    loadScene(){
        this.load.image("diversplash", "hw3_assets/sprites/characterselect/diversplashart.png");
        this.load.image("splashborder", "hw3_assets/sprites/characterselect/splashartborder.png");
    }

    startScene(){this.addUILayer("characterSelect");
        const center = this.viewport.getCenter();

        this.addLayer("primary", 10);

        let diversplash = this.add.sprite("diversplash", "primary");
        diversplash.position = new Vec2(center.x, center.y-150);
    
        let portraitborder = this.add.sprite("splashborder", "primary");
        portraitborder.position = new Vec2(center.x, center.y-150);

        /* Back Button */
        const back = <Button>this.add.uiElement(UIElementType.BUTTON, "characterSelect", {position: new Vec2(center.x-650, center.y-375), text: "Back"});
        back.size.set(200, 50);
        back.borderWidth = 2;
        back.borderColor = Color.WHITE;
        back.backgroundColor = new Color(50, 50, 70, 1);
        back.onClickEventId = "back";

        /* Character Name */
        const header = <Label>this.add.uiElement(UIElementType.LABEL, "characterSelect", {position: new Vec2(center.x, center.y+130), text: "Diver"});
        header.textColor = Color.WHITE;
        header.fontSize = 40;

        /* Select Button */
        const select = this.add.uiElement(UIElementType.BUTTON, "characterSelect", {position: new Vec2(center.x, center.y+230), text: "SELECT"});
        select.size.set(200, 75);
        select.borderWidth = 3;
        select.borderColor = Color.WHITE;
        select.backgroundColor = new Color(50, 50, 70, 1);
        select.onClickEventId = "select";

        /* Character Description */
        const description = this.add.uiElement(UIElementType.BUTTON, "characterSelect", {position: new Vec2(center.x, center.y+350), text: "The diver has a dark and mysterious past."});
        description.size.set(800, 100);
        description.borderWidth = 2;
        description.borderColor = Color.WHITE;
        description.backgroundColor = Color.TRANSPARENT;

        // Subscribe to the button events
        this.receiver.subscribe("select");
        this.receiver.subscribe("back");
    }

    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            if(event.type === "select"){
                let inventory = new Inventory(this, 50);
                let characterState = new CharacterState(100, 10, 10, 80, inventory, "diverportrait");
                this.sceneManager.changeScene(MapScene, {characterState: characterState});
            }

            if(event.type === "back")
                this.sceneManager.changeScene(MainMenu, {});
        }
    }
}