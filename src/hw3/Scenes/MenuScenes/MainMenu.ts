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
import UITweens from "../../../Wolfie2D/Rendering/Animations/UITweens";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";

export default class MainMenu extends Scene {
    private mainMenu: Layer;
    private controls: Layer;
    private about: Layer;
    private sceneObjects: Array<GameNode>;
    
    static char: string;
    static equipped: string[];
    static items: string[];
    static image: string;
    
    loadScene(){
        this.load.image("lasergun", "hw3_assets/sprites/itemicons/lasergun.png");
        this.load.image("healthpack", "hw3_assets/sprites/itemicons/healthpack.png");
    }

    startScene(){
        this.sceneObjects = new Array<GameNode>();
        // storing out data here
        MainMenu.char = "Diver";
        MainMenu.equipped = ["double-edged", "boots", "anchor", "lasergun", "lasergun", "lasergun", "lasergun", "lasergun"];
        MainMenu.items = ["healthpack", "healthpack", "healthpack", "knife", "knife", "knife", "knife"];
        MainMenu.image = "portrait";
        this.addLayer("primary", 10);

        /* Background Artwork */
        this.addLayer("background", 9);
        const center = this.viewport.getCenter();
        // let backgroundart = this.add.sprite("menubackground", "background");
        // backgroundart.position.set(center.x, center.y);

        // The main menu
        this.mainMenu = this.addUILayer("mainMenu");

        /* Menu Buttons */
        this.makeMenuButton(new Vec2(center.x, center.y-200), "Start Game", new Vec2(400, 100), "play", 0);
        this.makeMenuButton(new Vec2(center.x, center.y-50), "Level Select", new Vec2(400, 100), "levelselect", 150);
        this.makeMenuButton(new Vec2(center.x, center.y+100), "Controls", new Vec2(400, 100), "controls", 300);
        this.makeMenuButton(new Vec2(center.x, center.y+250), "Help", new Vec2(400, 100), "help", 450);
        
        // Subscribe to the button events
        this.receiver.subscribe("play");
        this.receiver.subscribe("controls");
        this.receiver.subscribe("levelselect");
        this.receiver.subscribe("menu");
        this.receiver.subscribe("help");
    }

    makeMenuButton(position: Vec2, text: string, size: Vec2, eventid: string, delay: number){
        const button = <Button>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(position.x+1000, position.y), text: text});
        button.size.set(size.x, size.y);
        button.borderWidth = 2;
        button.borderColor = Color.WHITE;
        button.backgroundColor = new Color(50, 50, 70, 1);
        button.onClickEventId = eventid;
        button.fontSize = 35;
        button.font = "Tahoma";
        this.sceneObjects.push(button);
        UITweens.slide(button, delay, 200, new Vec2(position.x+1000, position.y), position);
    }

    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            if(event.type === "play"){
                UITweens.slideOutScene(this.sceneObjects, 80, new Vec2(-1000, 0));
                let sceneManager = this.sceneManager;
                setTimeout(function(){ 
                    sceneManager.changeScene(CharacterSelect, {});
                }, 500);
            }

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