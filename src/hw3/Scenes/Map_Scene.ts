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

export default class Map_Scene extends Scene{
    // Layers, for multiple main menu screens
    
    private map: Layer;
    private controls: Layer;
    private about: Layer;
    static char: string;
    static equipped: string[];
    static items: string[];
    static image: string;
    
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
        const play = this.add.uiElement(UIElementType.BUTTON, "map", {position: new Vec2(center.x, center.y - 100), text: "Play"});
        play.size.set(200, 50);
        play.borderWidth = 2;
        play.borderColor = Color.WHITE;
        play.backgroundColor = Color.TRANSPARENT;
        play.onClickEventId = "play";

        // Add Controls Button
        const controls = this.add.uiElement(UIElementType.BUTTON, "map", {position: new Vec2(center.x, center.y), text: "Controls"});
        controls.size.set(200, 50);
        controls.borderWidth = 2;
        controls.borderColor = Color.WHITE;
        controls.backgroundColor = Color.TRANSPARENT;
        controls.onClickEventId = "controls";

        // Add event button
        const about = this.add.uiElement(UIElementType.BUTTON, "map", {position: new Vec2(center.x, center.y + 100), text: "About"});
        about.size.set(200, 50);
        about.borderWidth = 2;
        about.borderColor = Color.WHITE;
        about.backgroundColor = Color.TRANSPARENT;
        about.onClickEventId = "about";

        const inventory = this.add.uiElement(UIElementType.BUTTON, "map", {position: new Vec2(center.x, center.y + 200), text: "Inventory"});
        inventory.size.set(200, 50);
        inventory.borderWidth = 2;
        inventory.borderColor = Color.WHITE;
        inventory.backgroundColor = Color.TRANSPARENT;
        inventory.onClickEventId = "inventory";

        // Subscribe to the button events
        this.receiver.subscribe("play");
        this.receiver.subscribe("controls");
        this.receiver.subscribe("about");
        this.receiver.subscribe("inventory");

    }
    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            console.log(event);

            if(event.type === "play"){
                this.sceneManager.changeScene(floor1_scene, {});
            }

            if(event.type === "controls"){
                this.controls.setHidden(false);
                this.map.setHidden(true);
            }

            if(event.type === "inventory"){
                this.sceneManager.changeScene(inventory_scene, {});

            }
        }
    }
    
}