import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import CharacterState from "../CharacterState";
import { ItemType } from "../GameSystems/items/Item";
import MapScene from "./MapScene";


export default class ItemSelectScene extends Scene {
    private characterState: CharacterState;
    private selections: Array<Button>;
    private selectButton: Button;
    private itemSelected: number;
    
    initScene(init: Record<string, any>): void {
        this.characterState = init.characterState;
    }

    loadScene(){}

    startScene(){
        this.addLayer("primary", 10);
        this.addLayer("descriptions", 11);
        const center = this.viewport.getCenter();

        this.itemSelected = -1;
        this.selections = new Array<Button>(3);

        /* Header */
        const header = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x, center.y - 350), text: "Select an item to obtain"});
        header.textColor = Color.WHITE;
        header.fontSize = 35;

        /* Item 1 */
        const item1 = <Button>this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(center.x-500, center.y), text: "Double Edged Sword"});
        item1.size.set(400, 500);
        item1.borderWidth = 2;
        item1.borderColor = Color.WHITE;
        item1.backgroundColor = new Color(50, 50, 70, 1);
        item1.onClickEventId = "item1";
        item1.fontSize = 35;
        this.selections[0] = item1;

        const item1description = <Label>this.add.uiElement(UIElementType.LABEL, "descriptions", {position: new Vec2(center.x-500, center.y+50), text:"Deal double damage, take double damage"});
        item1description.textColor = Color.WHITE;
        item1description.fontSize = 20;

        /* Item 2 */
        const item2 = <Button>this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(center.x, center.y), text: "Normal Boots"});
        item2.size.set(400, 500);
        item2.borderWidth = 2;
        item2.borderColor = Color.WHITE;
        item2.backgroundColor = new Color(50, 50, 70, 1);
        item2.onClickEventId = "item2";
        item2.fontSize = 35;
        this.selections[1] = item2;

        const item2description = <Label>this.add.uiElement(UIElementType.LABEL, "descriptions", {position: new Vec2(center.x, center.y+50), text:"Increased movement speed"});
        item2description.textColor = Color.WHITE;
        item2description.fontSize = 20;

        /* None */
        const item3 = <Button>this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(center.x+500, center.y), text: "None"});
        item3.size.set(400, 500);
        item3.borderWidth = 2;
        item3.borderColor = Color.WHITE;
        item3.backgroundColor = new Color(50, 50, 70, 1);
        item3.onClickEventId = "item3";
        item3.fontSize = 35;
        this.selections[2] = item3;
        
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
                    if(this.itemSelected === 0)
                        this.characterState.addToInventory(ItemType.DOUBLE_EDGED_SWORD);

                    else if(this.itemSelected === 1)
                        this.characterState.addToInventory(ItemType.NORMAL_BOOTS);

                    this.sceneManager.changeScene(MapScene, {characterState: this.characterState});
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
}