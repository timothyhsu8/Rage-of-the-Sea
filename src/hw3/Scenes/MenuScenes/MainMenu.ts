import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../../Wolfie2D/Scene/Layer";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Button from "../../../Wolfie2D/Nodes/UIElements/Button";
import CharacterSelect from "./CharacterSelect";
import LevelSelect from "./LevelSelect";
import HelpScreen from "./HelpScreen";
import Controls from "./Controls";
import UITweens from "../../../Wolfie2D/Rendering/Animations/UITweens";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import PancakeColor from "../../../Wolfie2D/Utils/PancakeColor";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";

export default class MainMenu extends Scene {
    private mainMenu: Layer;
    private controls: Layer;
    private about: Layer;
    private sceneObjects: Array<GameNode>;
    private backgroundart: Sprite;

    static char: string;
    static equipped: string[];
    static items: string[];
    static image: string;
    
    loadScene(){
        this.load.object("itemData", "hw3_assets/data/itemData.json");
    }

    unloadScene(){
        this.load.keepObject("itemData");
    }

    startScene(){
        this.sceneObjects = new Array<GameNode>();
        this.addLayer("primary", 10);

        /* Background Artwork */
        this.addLayer("background", 9);
        const center = this.viewport.getCenter();
        this.backgroundart = this.add.sprite("menubackground", "background");
        this.backgroundart.position.set(center.x, center.y);
        UITweens.fadeIn(this.backgroundart, 0, 600);

        // The main menu
        this.mainMenu = this.addUILayer("mainMenu");

        /* Menu Buttons */
        this.makeMenuButton(new Vec2(center.x-350, center.y-200), "Start Game", new Vec2(450, 100), "play", 0);
        this.makeMenuButton(new Vec2(center.x-350, center.y-50), "Level Select", new Vec2(450, 100), "levelselect", 150);
        this.makeMenuButton(new Vec2(center.x-350, center.y+100), "Controls", new Vec2(450, 100), "controls", 300);
        this.makeMenuButton(new Vec2(center.x-350, center.y+250), "Help", new Vec2(450, 100), "help", 450);
        
        // Subscribe to the button events
        this.receiver.subscribe("play");
        this.receiver.subscribe("controls");
        this.receiver.subscribe("levelselect");
        this.receiver.subscribe("menu");
        this.receiver.subscribe("help");
    }

    makeMenuButton(position: Vec2, text: string, size: Vec2, eventid: string, delay: number){
        const button = <Button>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(position.x+2000, position.y), text: text});
        button.size.set(size.x, size.y);
        button.borderWidth = 4;
        button.borderColor = PancakeColor.PINK;
        button.backgroundColor = PancakeColor.MAGENTA;
        button.onClickEventId = eventid;
        button.fontSize = 40;
        button.textColor = PancakeColor.BEIGE;
        button.font = "Merriweather";
        this.sceneObjects.push(button);
        UITweens.slide(button, delay, 200, new Vec2(position.x+2000, position.y), position);
    }

    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "click"});
            if(event.type === "play"){ 
                UITweens.fadeOut(this.backgroundart, 0, 500);
                UITweens.slideOutScene(this.sceneObjects, 80, new Vec2(-1000, 0));
                let sceneManager = this.sceneManager;
                setTimeout(function(){ 
                    sceneManager.changeToScene(CharacterSelect, {startingLevel: 1});
                }, 500);
            }

            if(event.type === "controls")
                this.sceneManager.changeToScene(Controls, {});

            if(event.type === "levelselect")
                this.sceneManager.changeToScene(LevelSelect, {});

            if(event.type === "menu"){
                this.mainMenu.setHidden(false);
                this.about.setHidden(true);
                this.controls.setHidden(true);
            }

            if(event.type === "help")
                this.sceneManager.changeToScene(HelpScreen, {});
        }
    }
}