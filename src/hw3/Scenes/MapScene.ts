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
import PancakeColor from "../../Wolfie2D/Utils/PancakeColor";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import BattlerAI from "../AI/BattlerAI";

export default class MapScene extends Scene{
    // Layers, for multiple main menu screens
    
    private characterState: CharacterState; // All data of the character goes here
    private map: Layer;
    private controls: Layer;
    private about: Layer;
    private map_render: Layer;
    private healthbar: Graphic;
    
    initScene(init: Record<string, any>): void {
        this.characterState = init.characterState;
    }

    loadScene(){
        this.load.image("healthbarborder", "hw3_assets/sprites/healthbarborder.png");
        this.load.image("mapBackground", "hw3_assets/sprites/map.png");
        this.load.image("portrait", "hw3_assets/sprites/" + this.characterState.portrait + ".png");
        this.load.image("portraitborder", "hw3_assets/sprites/portraitborder.png");
    }

    startScene(){
        this.addLayer("primary", 10);
        const center = this.viewport.getCenter();

        // The main menu
        this.map = this.addUILayer("map");

        // Add play button, and give it an event to emit on press
        const play = <Button>this.add.uiElement(UIElementType.BUTTON, "map", {position: new Vec2(center.x - 300, center.y + 400), text: "Next Room"});
        play.size.set(200, 50);
        play.borderWidth = 2;
        play.borderColor = Color.WHITE;
        play.backgroundColor = new Color(50, 50, 70, 1);
        play.onClickEventId = "play";
        play.fontSize = 35;

        const inventory = <Button>this.add.uiElement(UIElementType.BUTTON, "map", {position: new Vec2(center.x, center.y+400), text: "View Inventory"});
        inventory.size.set(250, 50);
        inventory.borderWidth = 2;
        inventory.borderColor = Color.WHITE;
        inventory.backgroundColor = new Color(50, 50, 70, 1);
        inventory.onClickEventId = "inventory";
        inventory.fontSize = 35;

        const quit = <Button>this.add.uiElement(UIElementType.BUTTON, "map", {position: new Vec2(center.x + 300, center.y+400), text: "Quit"});
        quit.size.set(200, 50);
        quit.borderWidth = 2;
        quit.borderColor = Color.WHITE;
        quit.backgroundColor = new Color(50, 50, 70, 1);
        quit.onClickEventId = "quit";
        quit.fontSize = 35;

        // healthbar
        /* Healthbar and Healthbar Border*/
        this.addLayer("health", 11);
        let health = this.add.graphic(GraphicType.RECT, "health", {position: new Vec2(330+this.characterState.health, 66), size: new Vec2(this.characterState.health*6 , 30)});
        health.position = new Vec2(125+(this.characterState.health*3), 66);
        let healthbarborder = this.add.sprite("healthbarborder", "primary");
        healthbarborder.position = new Vec2(437, 48);
        
        /* Sprite for character portrait */
        let portrait = this.add.sprite("portrait", "primary");
        portrait.position = new Vec2(62, 45);

        /* Sprite for portrait border */
        let portraitborder = this.add.sprite("portraitborder", "primary");
        portraitborder.position = new Vec2(62, 45);

        // // placeholder for map screen composition
        // const map_render = <Label>this.add.uiElement(UIElementType.LABEL, "map", {position: new Vec2(center.x, center.y), text: "placeholder"})
        // map_render.size.set(1280, 640);
        // map_render.borderWidth = 4;
        // map_render.borderColor = Color.WHITE;
        // map_render.backgroundColor = PancakeColor.TAN;
        // map_render.fontSize = 35;

        let mapBackground = this.add.sprite("mapBackground", "primary");
        mapBackground.position = new Vec2(center.x, center.y);

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