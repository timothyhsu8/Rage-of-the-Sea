import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import inventory_scene from "./MenuScenes/InventoryScene";
import Slider from "../../Wolfie2D/Nodes/UIElements/Slider";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import TextInput from "../../Wolfie2D/Nodes/UIElements/TextInput";
import floor1_scene from "./floor1_scene";
import CharacterState from "../CharacterState";
import InventoryScene from "./MenuScenes/InventoryScene";
import MainMenu from "./MenuScenes/MainMenu";

export default class Map_Scene_Testing extends Scene{
    // Layers, for multiple main menu screens
    
    private characterState: CharacterState; // All data of the character goes here
    private map: Layer;
    private controls: Layer;
    private about: Layer;
    
    initScene(init: Record<string, any>): void {
        this.characterState = init.characterState;
    }

    loadScene(){}

    startScene(){
        this.addLayer("primary", 10);
        const center = this.viewport.getCenter();

        // The main menu
        this.map = this.addUILayer("map");

        // Add play button, and give it an event to emit on press
        const play = <Button>this.add.uiElement(UIElementType.BUTTON, "map", {position: new Vec2(center.x, center.y - 100), text: "Next Room"});
        play.size.set(400, 100);
        play.borderWidth = 2;
        play.borderColor = Color.WHITE;
        play.backgroundColor = new Color(50, 50, 70, 1);
        play.onClickEventId = "play";
        play.fontSize = 35;

        const inventory = <Button>this.add.uiElement(UIElementType.BUTTON, "map", {position: new Vec2(center.x, center.y+50), text: "View Inventory"});
        inventory.size.set(400, 100);
        inventory.borderWidth = 2;
        inventory.borderColor = Color.WHITE;
        inventory.backgroundColor = new Color(50, 50, 70, 1);
        inventory.onClickEventId = "inventory";
        inventory.fontSize = 35;

        const quit = <Button>this.add.uiElement(UIElementType.BUTTON, "map", {position: new Vec2(center.x, center.y+200), text: "Quit"});
        quit.size.set(400, 100);
        quit.borderWidth = 2;
        quit.borderColor = Color.WHITE;
        quit.backgroundColor = new Color(50, 50, 70, 1);
        quit.onClickEventId = "quit";
        quit.fontSize = 35;

        /* Subscribe to the button events */
        this.receiver.subscribe("play");
        this.receiver.subscribe("inventory");
        this.receiver.subscribe("quit");
    }
    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            if(event.type === "play")
                this.sceneManager.changeScene(floor1_scene, {characterState: this.characterState});

            if(event.type === "inventory")
                this.sceneManager.changeScene(InventoryScene, {characterState: this.characterState});
            
            if(event.type === "quit")
                this.sceneManager.changeScene(MainMenu, {});

        }
    }
}