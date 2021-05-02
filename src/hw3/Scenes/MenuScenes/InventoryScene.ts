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
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import Input from "../../../Wolfie2D/Input/Input";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";

export default class InventoryScene extends Scene {
    private characterState: CharacterState;
    private itemIcons: Array<Sprite>;
    
    private itemDescription: Label;
    private hovering: boolean;
    private hoveredItem: Sprite;

    initScene(init: Record<string, any>): void {
        this.characterState = init.characterState;
    }

    loadScene(){}

    startScene(){
        this.itemIcons = new Array<Sprite>();
        this.hovering = false;

        /* Background Artwork */
        this.addLayer("background", 9);
        const center = this.viewport.getCenter();
        let backgroundart = this.add.sprite("defaultbackground", "background");
        backgroundart.position.set(center.x, center.y);

        this.addLayer("primary", 10);
        this.addLayer("inventory", 11);
        this.addLayer("itemdescriptions", 12);
        
        this.itemDescription = <Label>this.add.uiElement(UIElementType.LABEL, "itemdescriptions", {position: new Vec2(-100, -100), text: "Equipped Items"});
        this.itemDescription.textColor = Color.WHITE;
        this.itemDescription.visible = false;
        this.itemDescription.fontSize = 35;
        this.itemDescription.backgroundColor = PancakeColor.MAGENTA;

        const currentlyEquipped = <Label>this.add.uiElement(UIElementType.LABEL, "inventory", {position: new Vec2(1000, 70), text: "Equipped Items"});
        currentlyEquipped.textColor = Color.WHITE;
        currentlyEquipped.fontSize = 35;
        currentlyEquipped.font = "Merriweather";

        const inventoryHeader = <Label>this.add.uiElement(UIElementType.LABEL, "inventory", {position: new Vec2(200, 345), text: "Diver"});
        inventoryHeader.textColor = Color.WHITE;
        inventoryHeader.font = "Merriweather";

        /* Back Button */
        const back = <Button>this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(200, 75), text: "Back to Map"});
        back.size.set(200, 50);
        back.borderWidth = 2;
        back.borderColor = Color.WHITE;
        back.backgroundColor = new Color(50, 50, 70, 1);
        back.onClickEventId = "back";
        back.font = "Merriweather";

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
            this.itemIcons.push(icon);

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
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "click"});
            let event = this.receiver.getNextEvent();

            if(event.type === "back")
                this.sceneManager.changeToScene(MapScene, {characterState: this.characterState});
        }

        if(!this.hovering){
            /* Check if mouse is hovering over item */
            for(let i=0 ; i < this.itemIcons.length ; i++){
                let mousePos: Vec2 = Input.getMousePosition()

                /* If item is being hovered */
                if(this.itemIcons[i].contains(mousePos.x, mousePos.y)){
                    this.hovering = true;
                    this.hoveredItem = this.itemIcons[i];
                    this.itemDescription.position.set(mousePos.x, mousePos.y);
                    this.itemDescription.visible = true;
                }
            }
        }
        
        /* Item is being hovered */
        else{
            let mousePos: Vec2 = Input.getMousePosition()
            if(!this.hoveredItem.contains(mousePos.x, mousePos.y)){
                this.itemDescription.visible = false;
                this.hovering = false;
            }
        }

    }
}