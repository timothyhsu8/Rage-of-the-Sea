import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import CharacterState from "../CharacterState";
import Item, { ItemType } from "../GameSystems/items/Item";
import MapScene from "./MapScene";


export default class ItemSelectScene extends Scene {
    private characterState: CharacterState;
    private selections: Array<Button>;
    private selectButton: Button;
    private itemSelected: number;

    private allItems: Array<ItemType>;
    private itemChoices: Array<ItemType>;
    
    initScene(init: Record<string, any>): void {
        this.characterState = init.characterState;
    }

    loadScene(){}

    startScene(){
        /* Determine random items to offer the player */
        this.allItems = this.load.getObject("itemData").items;

        /* Assigns random items to the selection */
        this.itemChoices = new Array<ItemType>(3);
        for(let i=0 ; i < this.itemChoices.length ; i++){
            if(this.allItems.length !== 0)
                this.itemChoices[i] = this.allItems.splice(this.randomInt(this.allItems.length), 1)[0];    
            else this.itemChoices[i] = ItemType.NONE;
        }

        /* Display Item Selection Scene */
        this.addLayer("primary", 10);
        this.addLayer("descriptions", 11);
        const center = this.viewport.getCenter();

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
                            this.characterState.addToInventory(this.itemChoices[i]);
                            this.itemChoices[i] = ItemType.NONE;
                        }

                    /* Put non-selected items back into the pool */
                    for(let i=0 ; i < this.itemChoices.length ; i++)
                        if(this.itemChoices[i] !== "none")
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

                else this.selections[i].backgroundColor = new Color(50, 50, 70, 1);
            }

            this.selectButton.backgroundColor = new Color(50, 50, 70, 1);
        }        
    }
    
    makeItemButtons(position: Vec2, itemChoice: number){
        const item = <Button>this.add.uiElement(UIElementType.BUTTON, "primary", {position: position, text: this.itemChoices[itemChoice]});
        item.size.set(400, 500);
        item.borderWidth = 2;
        item.borderColor = Color.WHITE;
        item.backgroundColor = new Color(50, 50, 70, 1);
        item.onClickEventId = "item"+(itemChoice+1);
        item.fontSize = 35;
        this.selections[itemChoice] = item;

        const item1description = <Label>this.add.uiElement(UIElementType.LABEL, "descriptions", {position: new Vec2(position.x, position.y+50), text:""});
        item1description.textColor = Color.WHITE;
        item1description.fontSize = 20;
    }

    randomInt(max: number): number{
        return Math.floor(Math.random() * max);
    }
}