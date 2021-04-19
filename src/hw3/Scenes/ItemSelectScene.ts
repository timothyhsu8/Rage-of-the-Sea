import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import CharacterState from "../CharacterState";
import { ItemType } from "../GameSystems/items/Item";
import MapScene from "./MapScene";


export default class ItemSelectScene extends Scene {
    private characterState: CharacterState;

    static char: string;
    static equipped: string[];
    static items: string[];
    static image: string;
    
    initScene(init: Record<string, any>): void {
        this.characterState = init.characterState;
    }

    loadScene(){

    }

    startScene(){
        this.addLayer("primary", 10);
        const center = this.viewport.getCenter();

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

        /* None */
        const none = <Button>this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(center.x+500, center.y), text: "None"});
        none.size.set(400, 500);
        none.borderWidth = 2;
        none.borderColor = Color.WHITE;
        none.backgroundColor = new Color(50, 50, 70, 1);
        none.onClickEventId = "none";
        none.fontSize = 35;

        // Subscribe to the button events
        this.receiver.subscribe("item1");
        this.receiver.subscribe("none");
    }

    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            /* Item 1 */
            if(event.type === "item1"){
                this.characterState.addToInventory(ItemType.DOUBLE_EDGED_SWORD);
                this.sceneManager.changeScene(MapScene, {characterState: this.characterState});
            }

            if(event.type === "none"){
                this.sceneManager.changeScene(MapScene, {characterState: this.characterState});
            }
                
        }
    }
}