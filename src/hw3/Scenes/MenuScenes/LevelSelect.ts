import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Button from "../../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import UITweens from "../../../Wolfie2D/Rendering/Animations/UITweens";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import CharacterSelect from "./CharacterSelect";
import HelpScreen from "./HelpScreen";
import MainMenu from "./MainMenu";

export default class LevelSelect extends Scene {
    private sceneUI: Array<GameNode>;

    loadScene(){
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
        
        /* Background Artwork */
        this.addLayer("background", 1);
        let backgroundart = this.add.sprite("defaultbackground", "background");
        backgroundart.position.set(center.x, center.y);
        UITweens.fadeIn(backgroundart, 0, 600);

        /* Back Button */
        const back = <Button>this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x-650, center.y-375), text: "Back"});
        back.size.set(200, 50);
        back.borderWidth = 2;
        back.borderColor = Color.WHITE;
        back.backgroundColor = new Color(50, 50, 70, 1);
        back.onClickEventId = "back";
        this.sceneUI.push(back);
    
        /* Level Select Header */
        const header = <Label>this.add.uiElement(UIElementType.LABEL, "levelSelect", {position: new Vec2(center.x, center.y-375), text: "Level Select"});
        header.textColor = Color.WHITE;
        header.fontSize = 50;
        this.sceneUI.push(header);

        this.addLayer("levelimages", 9);
        this.addLayer("locks", 10);
        this.makeLevelButtons(new Vec2(center.x-500, center.y-150), "floor1", 0, "Floor 1: Engine Room", false, 1);
        this.makeLevelButtons(new Vec2(center.x, center.y-150), "floor2", 0, "Floor 2: Casino", true, 2);
        this.makeLevelButtons(new Vec2(center.x+500, center.y-150), "floor3", 0, "Floor 3: Dining Area", true, 3);
        this.makeLevelButtons(new Vec2(center.x-500, center.y+150), "floor4", 0, "Floor 4", true, 4);
        this.makeLevelButtons(new Vec2(center.x, center.y+150), "floor5", 0, "Floor 5", true, 5);
        this.makeLevelButtons(new Vec2(center.x+500, center.y+150), "floor6", 0, "Floor 6", true, 6);


        // Subscribe to the button events
        this.receiver.subscribe("back");
        for(let i=1 ; i <= NUM_LEVELS ; i++)
            this.receiver.subscribe("floor" + i);

        /* Tween Animation for Scene */
        UITweens.slideInScene(this.sceneUI, 30, new Vec2(2000, 0));
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
        button.font = "Tahoma";
        this.sceneUI.push(button);

        /* Level Images */
        const levelimage = this.add.sprite("level" + num + "image", "levelimages");
        levelimage.position.set(position.x, position.y);
        this.sceneUI.push(levelimage);

        /* Add lock icon and lower alpha on locked rooms */
        if(locked && !HelpScreen.allLevelsUnlocked){
            levelimage.alpha = 0.3;
            const lockIcon = this.add.sprite("lock", "locks");
            lockIcon.position.set(position.x, position.y);
            this.sceneUI.push(lockIcon);
            button.onClickEventId = "locked";
        }

        /* Descriptions */
        const description = <Label>this.add.uiElement(UIElementType.LABEL, "levelSelect", {position: new Vec2(position.x, position.y+120), text:text});
        description.textColor = Color.WHITE;
        description.fontSize = 25;
        this.sceneUI.push(description);
    }
    
    updateScene(){
        while(this.receiver.hasNextEvent()){
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "click"});
            let event = this.receiver.getNextEvent();

            if(event.type === "back")
                this.sceneManager.changeToScene(MainMenu, {});

            /* Go To Character Select Screen */
            if(event.type.substring(0,5) === "floor"){
                let floorLevel = parseInt(event.type.substring(5)); // Obtains floor level that user chose
                this.sceneManager.changeToScene(CharacterSelect, {startingLevel: floorLevel});
            }
        }
    }
}