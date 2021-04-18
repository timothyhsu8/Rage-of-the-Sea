import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../../Wolfie2D/Scene/Layer";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import inventory_scene from "./InventoryScene";
import Slider from "../../../Wolfie2D/Nodes/UIElements/Slider";
import Button from "../../../Wolfie2D/Nodes/UIElements/Button";
import TextInput from "../../../Wolfie2D/Nodes/UIElements/TextInput";
import floor1_scene from "../floor1_scene";
import CharacterSelect from "./CharacterSelect";
import LevelSelect from "./LevelSelect";
import HelpScreen from "./HelpScreen";
import Controls from "./Controls";

export default class MainMenu extends Scene {
    private mainMenu: Layer;
    private controls: Layer;
    private about: Layer;
    
    static char: string;
    static equipped: string[];
    static items: string[];
    static image: string;
    
    loadScene(){
        this.load.image("portrait", "hw3_assets/sprites/diverportrait.png");
        this.load.image("lasergun", "hw3_assets/sprites/lasergun.png");
        this.load.image("healthpack", "hw3_assets/sprites/healthpack.png");
    }

    startScene(){
        // storing out data here
        MainMenu.char = "Diver";
        MainMenu.equipped = ["anchor", "lasergun", "lasergun", "lasergun", "lasergun", "lasergun"];
        MainMenu.items = ["healthpack", "healthpack", "healthpack", "knife", "knife", "knife", "knife"];
        MainMenu.image = "portrait";
        this.addLayer("primary", 10);

        const center = this.viewport.getCenter();

        // The main menu
        this.mainMenu = this.addUILayer("mainMenu");

        // Add play button, and give it an event to emit on press
        const play = <Button>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y-200), text: "Play"});
        play.size.set(400, 100);
        play.borderWidth = 2;
        play.borderColor = Color.WHITE;
        play.backgroundColor = new Color(50, 50, 70, 1);
        play.onClickEventId = "play";
        play.fontSize = 35;

        /* Level Select Button */
        const levelselect = <Button>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y-50), text: "Level Select"});
        levelselect.size.set(400, 100);
        levelselect.borderWidth = 2;
        levelselect.borderColor = Color.WHITE;
        levelselect.backgroundColor = new Color(50, 50, 70, 1);
        levelselect.onClickEventId = "levelselect";
        levelselect.fontSize = 35;

        // Add Controls Button
        const controls = <Button>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y+100), text: "Controls"});
        controls.size.set(400, 100);
        controls.borderWidth = 2;
        controls.borderColor = Color.WHITE;
        controls.backgroundColor = new Color(50, 50, 70, 1);
        controls.onClickEventId = "controls";
        controls.fontSize = 35;

        /* Help Button */
        const inventory = <Button>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 250), text: "Help"});
        inventory.size.set(400, 100);
        inventory.borderWidth = 2;
        inventory.borderColor = Color.WHITE;
        inventory.backgroundColor = new Color(50, 50, 70, 1);
        inventory.onClickEventId = "help";
        inventory.fontSize = 35;

        /* ########## CONTROLS SCREEN ########## */
        this.controls = this.addUILayer("controls");
        this.controls.setHidden(true);

        const controlsHeader = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y - 250), text: "Controls"});
        controlsHeader.textColor = Color.WHITE;

        const  movementText= "Move - WASD";
        const pickupText = "Pickup Item - E";
        const dropText = "Drop Item - Q";
        const useText = "Use Item - Left Mouse Click";
        const equipText = "Equip - 1 and 2";

        const controlsline1 = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y - 150), text: movementText});
        const controlsline2 = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y - 75), text: pickupText});
        const controlsline3 = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y), text: dropText});
        const controlsline4 = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y + 75), text: useText});
        const controlsline5 = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y + 150), text: equipText});

        controlsline1.textColor = Color.WHITE;
        controlsline2.textColor = Color.WHITE;
        controlsline3.textColor = Color.WHITE;
        controlsline4.textColor = Color.WHITE;
        controlsline5.textColor = Color.WHITE;

        const controlsBack = this.add.uiElement(UIElementType.BUTTON, "controls", {position: new Vec2(center.x, center.y + 250), text: "Back"});
        controlsBack.size.set(200, 50);
        controlsBack.borderWidth = 2;
        controlsBack.borderColor = Color.WHITE;
        controlsBack.backgroundColor = new Color(50, 50, 70, 1);
        controlsBack.onClickEventId = "menu";
        
        // Subscribe to the button events
        this.receiver.subscribe("play");
        this.receiver.subscribe("controls");
        this.receiver.subscribe("levelselect");
        this.receiver.subscribe("menu");
        this.receiver.subscribe("help");

    }
    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            if(event.type === "play")
                this.sceneManager.changeScene(CharacterSelect, {});

            if(event.type === "controls")
                this.sceneManager.changeScene(Controls, {});

            if(event.type === "levelselect")
                this.sceneManager.changeScene(LevelSelect, {});

            if(event.type === "menu"){
                this.mainMenu.setHidden(false);
                this.about.setHidden(true);
                this.controls.setHidden(true);
            }

            if(event.type === "help"){
                this.sceneManager.changeScene(HelpScreen, {});
            }
        }
    }
}