import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import inventory_scene from "./inventory_scene";
import Slider from "../../Wolfie2D/Nodes/UIElements/Slider";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import TextInput from "../../Wolfie2D/Nodes/UIElements/TextInput";
import floor1_scene from "./floor1_scene";
import CharacterState from "../CharacterState";

export default class Map_Scene_Testing extends Scene{
    // Layers, for multiple main menu screens
    
    private characterState: CharacterState; // All data of the character goes here
    private map: Layer;
    private controls: Layer;
    private about: Layer;
    
    initScene(init: Record<string, any>): void {
        this.characterState = init.characterState;
    }

    loadScene(){
        this.load.image("portrait", "hw3_assets/sprites/playerportrait.png");
        this.load.image("lasergun", "hw3_assets/sprites/lasergun.png");
        this.load.image("healthpack", "hw3_assets/sprites/healthpack.png");
    }

    startScene(){
        this.addLayer("primary", 10);

        const center = this.viewport.getCenter();

        // The main menu
        this.map = this.addUILayer("map");

        // Add play button, and give it an event to emit on press
        const play = this.add.uiElement(UIElementType.BUTTON, "map", {position: new Vec2(center.x, center.y - 100), text: "Next Room"});
        play.size.set(200, 50);
        play.borderWidth = 2;
        play.borderColor = Color.WHITE;
        play.backgroundColor = Color.TRANSPARENT;
        play.onClickEventId = "play";

        // Subscribe to the button events
        this.receiver.subscribe("play");


    }
    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            console.log(event);

            if(event.type === "play"){
                this.sceneManager.changeScene(floor1_scene, {characterState: this.characterState});
            }

        }
    }
    
    
}