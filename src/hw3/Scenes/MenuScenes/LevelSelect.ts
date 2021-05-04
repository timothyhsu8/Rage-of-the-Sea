import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Button from "../../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import UITweens from "../../../Wolfie2D/Rendering/Animations/UITweens";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import PancakeColor from "../../../Wolfie2D/Utils/PancakeColor";
import CharacterSelect from "./CharacterSelect";
import HelpScreen from "./HelpScreen";
import MainMenu from "./MainMenu";

export default class LevelSelect extends Scene {
    private sceneUI: Array<GameNode>;
    private page: number
    private maxPages: number

    initScene(init: Record<string, any>): void {
        this.page = init.page;
        this.maxPages = 2 // Final Project TODO: after we determine how many levels pages
    }

    loadScene(){
        // Final Project TODO: add conditionals if additional levels / boss room are added
        this.load.image("level1image", "hw3_assets/sprites/levelselect/level1image.png");
        this.load.image("level2image", "hw3_assets/sprites/levelselect/level2image.png");
        this.load.image("level3image", "hw3_assets/sprites/levelselect/level3image.png");
        this.load.image("level4image", "hw3_assets/sprites/levelselect/level4image.png");
        this.load.image("level5image", "hw3_assets/sprites/levelselect/level5image.png");
        this.load.image("level6image", "hw3_assets/sprites/levelselect/level6image.png");

        this.load.image("lock", "hw3_assets/sprites/levelselect/lock.png");
    }

    startScene(){
        const NUM_LEVELS = 6;
        
        this.sceneUI = new Array<GameNode>();
        const center = this.viewport.getCenter();
        this.addUILayer("levelSelect");
        this.addLayer("abovebackground", 2);

        /* Background Artwork */
        this.addLayer("background", 1);
        let backgroundart = this.add.sprite("defaultbackground", "background");
        backgroundart.position.set(center.x, center.y);
        UITweens.fadeIn(backgroundart, 0, 600);

        /* Home, Next, Prev Buttons */
        if (this.page > 1){
            this.makePageButtons(new Vec2(center.x-650, center.y+375), "Previous")
        }
        if (this.page < this.maxPages){
            this.makePageButtons(new Vec2(center.x+650, center.y+375), "Next")
        }
        this.makePageButtons(new Vec2(center.x-650, center.y-375), "Home")

    
        /* Level Select Header */
        const header = <Label>this.add.uiElement(UIElementType.LABEL, "levelSelect", {position: new Vec2(center.x, center.y-375), text: "Level Select"});
        header.textColor = Color.WHITE;
        header.fontSize = 50;
        header.font = "Merriweather";
        this.sceneUI.push(header);

        // Final Project TODO: after adding additional levels / boss stage; conditional for which page to display
        this.addLayer("levelimages", 9);
        this.addLayer("locks", 10);
        this.makeLevelButtons(new Vec2(center.x-500, center.y-150), "floor1", 0, "Floor 1: Engine Room", false, 1);
        this.makeLevelButtons(new Vec2(center.x, center.y-150), "floor2", 0, "Floor 2: Casino", true, 2);
        this.makeLevelButtons(new Vec2(center.x+500, center.y-150), "floor3", 0, "Floor 3: Event Room", true, 3);
        this.makeLevelButtons(new Vec2(center.x-500, center.y+150), "floor4", 0, "Floor 4: Dining Area", true, 4);
        this.makeLevelButtons(new Vec2(center.x, center.y+150), "floor5", 0, "Floor 5: Poolside", true, 5);
        this.makeLevelButtons(new Vec2(center.x+500, center.y+150), "floor6", 0, "Floor 6: The Bridge", true, 6);

        // Subscribe to the button events
        this.receiver.subscribe("home");
        this.receiver.subscribe("next");
        this.receiver.subscribe("previous");
        for(let i=1 ; i <= NUM_LEVELS ; i++)
            this.receiver.subscribe("floor" + i);

        /* Tween Animation for Scene */
        UITweens.slideInScene(this.sceneUI, 30, new Vec2(2000, 0));
    }

    makePageButtons(position: Vec2, name: string){

        const button = <Button>this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: position, text: name});
        button.size.set(200, 50);
        button.borderWidth = 2;
        button.borderColor = Color.WHITE;
        button.backgroundColor = new Color(50, 50, 70, 1);
        button.onClickEventId = name.toLowerCase();
        button.font = "Merriweather";
        this.sceneUI.push(button);
        return button
    }

    makeLevelButtons(position: Vec2, eventid: string, delay: number, text: string, locked: boolean, num: number){
        /* Clickable Buttons */
        const button = <Button>this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: position, text: ""});
        button.size.set(375, 200);
        button.borderWidth = 2;
        button.borderColor = Color.WHITE;
        button.backgroundColor = Color.TRANSPARENT;
        button.onClickEventId = eventid;
        button.fontSize = 35;
        button.font = "Merriweather";
        this.sceneUI.push(button);

        /* Level Images */
        const levelimage = this.add.sprite("level" + num + "image", "levelimages");
        levelimage.position.set(position.x, position.y);
        this.sceneUI.push(levelimage);

        /* Add lock icon and lower alpha on locked rooms */
        if(locked && !HelpScreen.allLevelsUnlocked){
            levelimage.alpha = 0.35;
            const lockIcon = this.add.sprite("lock", "locks");
            lockIcon.position.set(position.x, position.y);
            this.sceneUI.push(lockIcon);
            button.onClickEventId = "locked";

            const blackBG = <Label>this.add.uiElement(UIElementType.LABEL, "abovebackground", {position: position, text:text});
            blackBG.size.set(375, 200);
            blackBG.backgroundColor = Color.BLACK;
            button.borderWidth = 2;
        }

        /* Descriptions */
        const description = <Label>this.add.uiElement(UIElementType.LABEL, "levelSelect", {position: new Vec2(position.x, position.y+120), text:text});
        description.textColor = Color.WHITE;
        description.fontSize = 25;
        description.font = "Merriweather";
        this.sceneUI.push(description);
    }
    
    updateScene(){
        while(this.receiver.hasNextEvent()){
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "click"});
            let event = this.receiver.getNextEvent();

            if(event.type === "home"){
                this.sceneManager.changeToScene(MainMenu, {});
            }
            else if(event.type === "next"){
                this.sceneManager.changeToScene(LevelSelect, {page: this.page + 1});
            }
            else if(event.type === "previous"){
                this.sceneManager.changeToScene(LevelSelect, {page: this.page - 1});
            }
            /* Go To Character Select Screen */
            if(event.type.substring(0,5) === "floor"){
                let floorLevel = parseInt(event.type.substring(5)); // Obtains floor level that user chose
                this.sceneManager.changeToScene(CharacterSelect, {startingLevel: floorLevel});
            }
        }
    }
}