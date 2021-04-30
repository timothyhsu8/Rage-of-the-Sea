import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../../Wolfie2D/Utils/Color";
import MainMenu from "./MainMenu";
import Layer from "../../../Wolfie2D/Scene/Layer";
import CharacterState from "../../CharacterState";
import Button from "../../../Wolfie2D/Nodes/UIElements/Button";
import MapScene from "../MapScene";
import PancakeColor from "../../../Wolfie2D/Utils/PancakeColor";

export default class InventoryScene extends Scene {
    private characterState: CharacterState;

    initScene(init: Record<string, any>): void {
        this.characterState = init.characterState;
    }

    loadScene(){}

    startScene(){
        /* Background Artwork */
        this.addLayer("background", 9);
        const center = this.viewport.getCenter();
        let backgroundart = this.add.sprite("defaultbackground", "background");
        backgroundart.position.set(center.x, center.y);

        this.addLayer("primary", 10);
        this.addUILayer("inventory");

        const currentlyEquipped = <Label>this.add.uiElement(UIElementType.LABEL, "inventory", {position: new Vec2(1000, 70), text: "Equipped Items"});
        currentlyEquipped.textColor = Color.WHITE;
        currentlyEquipped.fontSize = 35;
        currentlyEquipped.font = "Tahoma";

        const inventoryHeader = <Label>this.add.uiElement(UIElementType.LABEL, "inventory", {position: new Vec2(200, 140), text: MainMenu.char});
        inventoryHeader.textColor = Color.WHITE;

        /* Back Button */
        const back = <Button>this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(200, 75), text: "Back to Map"});
        back.size.set(200, 50);
        back.borderWidth = 2;
        back.borderColor = Color.WHITE;
        back.backgroundColor = new Color(50, 50, 70, 1);
        back.onClickEventId = "back";

        /* Player Portrait */
        let portrait = this.add.sprite(this.characterState.portrait, "primary");
        portrait.scale = new Vec2(2, 2);
        portrait.position = new Vec2(200, 240);
        let portraitborder = this.add.sprite("portraitborder", "primary");
        portraitborder.scale = new Vec2(2, 2);
        portraitborder.position = new Vec2(200, 240);

        /* Item Icons Background */
        const iconBackground = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x+200, center.y), text: ""});
        iconBackground.backgroundColor = PancakeColor.MAGENTA;
        iconBackground.borderWidth = 2;
        iconBackground.borderRadius = 2;
        iconBackground.borderColor = PancakeColor.PINK;
        iconBackground.size.set(1100, 700);

        /* Item Icons */
        let width = 500;
        let height = 150;
        var text = ""
        let equippedItems = this.characterState.getInventory().getItems();
        for(let i=0 ; i < equippedItems.length ; i++){
            /* Item Icon */
            let icon = this.add.sprite(equippedItems[i].key, "inventory");
            icon.scale.set(1/2, 1/2);
            icon.position = new Vec2(width, height);

            /* Item Icon Border */
            const border = <Label>this.add.uiElement(UIElementType.LABEL, "inventory", {position: icon.position, text: ""});
            border.size = new Vec2(icon.size.x/2, icon.size.y/2);
            border.borderRadius = 2;
            border.borderColor = Color.WHITE;
            border.borderWidth = 2;

            width += 100
            if (width >= 1400){
                height += 100
                width = 500
            }
        }

        this.receiver.subscribe("back");
    }

    updateScene(deltaT: number): void {
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            if(event.type === "back")
                this.sceneManager.changeToScene(MapScene, {characterState: this.characterState});
        }
    }
}