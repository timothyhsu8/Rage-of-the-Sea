import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import PancakeColor from "../../Wolfie2D/Utils/PancakeColor";
import CharacterState from "../CharacterState";
import MapScene from "./MapScene";

export default class ItemSelectScene extends Scene {
    private characterState: CharacterState;
    private selections: Array<Button>;
    private selectButton: Button;
    private itemSelected: number;

    private allItems: any;  // Array of all items from the JSON file
    private itemChoices: Array<any>;
    
    initScene(init: Record<string, any>): void {
        this.characterState = init.characterState;
    }

    loadScene(){}

    startScene(){
        /* Determine random items to offer the player */
        const itemData = this.load.getObject("itemData");
        this.allItems = itemData.allitems;

        /* Assigns random items to the selection */
        this.itemChoices = new Array<any>(3);
        for(let i=0 ; i < this.itemChoices.length ; i++){
            if(this.allItems.length !== 0)
                this.itemChoices[i] = this.allItems.splice(this.randomInt(this.allItems.length), 1)[0];    
            else this.itemChoices[i] = itemData.none;
        }

        /* Background Artwork */
        const center = this.viewport.getCenter();
        this.addLayer("background", 9);
        let backgroundart = this.add.sprite("defaultbackground", "background");
        backgroundart.position.set(center.x, center.y);

        /* Display Item Selection Scene */
        this.addLayer("primary", 10);
        this.addLayer("descriptions", 11);

        this.itemSelected = -1;
        this.selections = new Array<Button>(3);

        /* Header */
        const header = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x, center.y - 350), text: "Select an item to obtain"});
        header.textColor = Color.WHITE;
        header.fontSize = 35;

        /* Display Item Buttons */
        this.makeItemButtons(new Vec2(center.x-500, center.y), 0);
        this.makeItemButtons(new Vec2(center.x, center.y), 1);
        this.makeItemButtons(new Vec2(center.x+500, center.y), 2);

        /* Select */
        const select = <Button>this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(center.x, center.y+350), text: "SELECT"});
        select.size.set(150, 100);
        select.borderWidth = 2;
        select.borderColor = Color.WHITE;
        select.backgroundColor = Color.TRANSPARENT;
        select.onClickEventId = "select";
        select.fontSize = 25;
        this.selectButton = select;

        // Subscribe to the button events
        this.receiver.subscribe("item1");
        this.receiver.subscribe("item2");
        this.receiver.subscribe("item3");
        this.receiver.subscribe("select");
    }

    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            /* Select Item */
            if(event.type.substring(0, 4) === "item")
                this.itemSelected = parseInt(event.type.substring(4))-1;

            /* Select Item and Continue */
            if(event.type === "select"){
                if(this.itemSelected !== -1)
                {
                    /* Add selected item to inventory, remove it from pool */
                    for(let i=0 ; i < this.itemChoices.length ; i++)
                        if(this.itemSelected === i){
                            this.characterState.addToInventory(this.itemChoices[i].key);
                            this.itemChoices[i] = null;
                        }

                    /* Put non-selected items back into the pool */
                    for(let i=0 ; i < this.itemChoices.length ; i++)
                        if(this.itemChoices[i] !== null && this.itemChoices[i].key !== "none")
                            this.allItems.push(this.itemChoices[i]);

                    this.sceneManager.changeToScene(MapScene, {characterState: this.characterState});
                }
            }
        }

        /* Change color of button if item is selected */
        if(this.itemSelected !== -1){
            for(let i=0 ; i < this.selections.length ; i++){
                if(i === this.itemSelected)
                    this.selections[i].backgroundColor = new Color(50, 100, 70, 1);

                else this.selections[i].backgroundColor = PancakeColor.MAGENTA;;
            }
            this.selectButton.backgroundColor = PancakeColor.MAGENTA;;
        }        
    }
    
    makeItemButtons(position: Vec2, itemChoice: number){

        if(this.itemChoices[itemChoice].key !== "none"){
            /* Item Icon */
            let itemicon = this.add.sprite(this.itemChoices[itemChoice].key, "descriptions");
            itemicon.position.set(position.x, position.y-125);

            /* Item Icon Border */
            const border = <Label>this.add.uiElement(UIElementType.LABEL, "descriptions", {position: new Vec2(position.x, position.y-125), text:""});
            border.borderColor = Color.WHITE;
            border.borderWidth = 2;
            border.size = new Vec2(175, 175);
        }

        /* Selection Box */
        const item = <Button>this.add.uiElement(UIElementType.BUTTON, "primary", {position: position, text: this.itemChoices[itemChoice].name});
        item.size.set(400, 500);
        item.borderWidth = 2;
        item.borderColor = PancakeColor.PINK;
        item.backgroundColor = PancakeColor.MAGENTA;
        item.onClickEventId = "item"+(itemChoice+1);
        item.fontSize = 35;
        this.selections[itemChoice] = item;

        /* Description */
        const item1description = <Label>this.add.uiElement(UIElementType.LABEL, "descriptions", {position: new Vec2(position.x, position.y+50), text:this.itemChoices[itemChoice].description});
        item1description.textColor = PancakeColor.BEIGE;
        item1description.fontSize = 20;
    }

    randomInt(max: number): number{
        return Math.floor(Math.random() * max);
    }
}