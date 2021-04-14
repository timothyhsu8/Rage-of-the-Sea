import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Slider from "../../Wolfie2D/Nodes/UIElements/Slider";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import TextInput from "../../Wolfie2D/Nodes/UIElements/TextInput";
import floor1_scene from "./floor1_scene";


export default class CharacterSelect extends Scene {
   
    private characterSelect: Layer;

    loadScene(){
        this.load.image("portrait", "hw3_assets/sprites/diversplashart.png");
        this.load.image("portraitborder", "hw3_assets/sprites/splashartborder.png");
        this.load.image("lasergun", "hw3_assets/sprites/lasergun.png"); // Load anchor icon for weapon
    }

    startScene(){
        this.characterSelect = this.addUILayer("characterSelect");
        const center = this.viewport.getCenter();

        this.addLayer("primary", 10);
        let portrait = this.add.sprite("portrait", "primary");
        portrait.position = new Vec2(center.x, center.y-150);
        
        let portraitborder = this.add.sprite("portraitborder", "primary");
        portraitborder.position = new Vec2(center.x, center.y-150);

        // Add play button, and give it an event to emit on press 
        const select = this.add.uiElement(UIElementType.BUTTON, "characterSelect", {position: new Vec2(center.x, center.y+165), text: "SELECT"});
        select.size.set(200, 75);
        select.borderWidth = 3;
        select.borderColor = Color.WHITE;
        select.backgroundColor = new Color(50, 50, 70, 1);
        select.onClickEventId = "select";

        const description = this.add.uiElement(UIElementType.BUTTON, "characterSelect", {position: new Vec2(center.x, center.y+280), text: "The diver has a dark and mysterious past."});
        description.size.set(800, 100);
        description.borderWidth = 2;
        description.borderColor = Color.WHITE;
        description.backgroundColor = Color.TRANSPARENT;

        // Subscribe to the button events
        this.receiver.subscribe("select");
    }

    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            if(event.type === "select"){
                this.sceneManager.changeScene(floor1_scene, {});
            }
        }
    }
}