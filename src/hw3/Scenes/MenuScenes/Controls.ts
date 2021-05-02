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
import MainMenu from "./MainMenu";

export default class Controls extends Scene {
    
    private sceneObjects: Array<GameNode>;

    loadScene(){
        this.load.image("image1", "hw3_assets/sprites/howtoplay/tutorial1.png");
        this.load.image("image2", "hw3_assets/sprites/howtoplay/tutorial2.png");
        this.load.image("image3", "hw3_assets/sprites/howtoplay/tutorial3.png");
        this.load.image("image4", "hw3_assets/sprites/howtoplay/tutorial4.png");
    }

    startScene(){
        this.sceneObjects = new Array<GameNode>();
        this.addUILayer("primary");
        const center = this.viewport.getCenter();
        
        /* Background Artwork */
        this.addLayer("background", 1);
        let backgroundart = this.add.sprite("defaultbackground", "background");
        backgroundart.position.set(center.x, center.y);

        /* Back Button */
        const back = <Button>this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(center.x-650, center.y-375), text: "Back"});
        back.size.set(200, 50);
        back.borderWidth = 2;
        back.borderColor = Color.WHITE;
        back.backgroundColor = new Color(50, 50, 70, 1);
        back.onClickEventId = "back";
        back.font = "Merriweather";
        this.sceneObjects.push(back);
    
        /* Controls */
        const controls = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x-560, center.y-150), text: ""});
        controls.textColor = Color.WHITE;
        controls.size.set(400, 350);
        controls.borderRadius = 2;
        controls.borderColor = PancakeColor.PINK;
        controls.backgroundColor = PancakeColor.MAGENTA;
        controls.borderWidth = 2;
        controls.fontSize = 20;
        controls.font = "Merriweather";

        const controlsHeader = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x-560, center.y-285), text:"Controls"});
        controlsHeader.textColor = PancakeColor.BEIGE;
        controlsHeader.fontSize = 35;
        controlsHeader.font = "Merriweather";
        this.sceneObjects.push(controlsHeader);

        let controlsText = ["WASD - Move", "Left Mouse - Basic Attack", "Right Mouse - Use Item"];
        this.makeTextLabels(controlsText, 75, new Vec2(center.x-560, center.y - 200));

        /* How To Play */
        const tutorial = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x+230, center.y+50), text:""});
        tutorial.textColor = Color.WHITE;
        tutorial.size.set(1050, 750);
        tutorial.borderRadius = 2;
        tutorial.borderColor = PancakeColor.PINK;
        tutorial.backgroundColor = PancakeColor.MAGENTA;
        tutorial.borderWidth = 2;
        tutorial.fontSize = 20;
        tutorial.font = "Merriweather";

        const tutorialHeader = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x+230, center.y-285), text:"How To Play"});
        tutorialHeader.textColor = PancakeColor.BEIGE;
        tutorialHeader.fontSize = 35;
        tutorialHeader.font = "Merriweather";
        this.sceneObjects.push(tutorialHeader);

        /* Tutorial Images */
        this.makeTutorialImage("image1", new Vec2(center.x-40, center.y-100));
        this.makeTutorialImage("image2", new Vec2(center.x+500, center.y-100));
        this.makeTutorialImage("image3", new Vec2(center.x-40, center.y+225));
        this.makeTutorialImage("image4", new Vec2(center.x+500, center.y+225));

        /* Image Captions */
        this.makeTutorialCaption(25, "Fight enemies using attacks and items", new Vec2(center.x-40, center.y+45));
        
        this.makeTutorialCaption(22, "Yellow tiles indicate where an enemy is planning", new Vec2(center.x+500, center.y+45));
        this.makeTutorialCaption(22, "to attack. Avoid these to save your health", new Vec2(center.x+500, center.y+75));

        this.makeTutorialCaption(22, "Each sword icon indicates a battle room. Fight your", new Vec2(center.x-40, center.y+365));
        this.makeTutorialCaption(22, "way to the rightmost rooms to advance to the next floor", new Vec2(center.x-40, center.y+395));

        this.makeTutorialCaption(22, "You'll be able to obtain a new item every 2 battle rooms.", new Vec2(center.x+500, center.y+365));
        this.makeTutorialCaption(22, "Items give different upgrades that make you stronger.", new Vec2(center.x+500, center.y+395));

        // Subscribe to the button events
        this.receiver.subscribe("back");
        UITweens.slideInScene(this.sceneObjects, 30, new Vec2(2000, 0));
    }

    updateScene(){
        while(this.receiver.hasNextEvent()){
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "click"});
            let event = this.receiver.getNextEvent();

            if(event.type === "back")
                this.sceneManager.changeToScene(MainMenu, {});
        }
    }

    /* Create Text Labels */
    makeTextLabels(text: Array<String>, spacing: number, position: Vec2){
        let xpos = position.x;
        let ypos = position.y;

        for(let i=0 ; i<text.length ; i++){
            const textlabel = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(xpos, ypos+(spacing*i)), text:text[i]});
            textlabel.textColor = Color.WHITE;
            textlabel.fontSize = 30;
            textlabel.font = "Merriweather";
            this.sceneObjects.push(textlabel);
        }
    }

    makeTutorialImage(image: string, position: Vec2){
        let levelimage = this.add.sprite(image, "primary");
        levelimage.position.set(position.x, position.y);
        this.sceneObjects.push(levelimage);
        
        const imageborder = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: position, text: ""});
        imageborder.size.set(440, 240);
        imageborder.borderWidth = 2;
        imageborder.borderColor = Color.WHITE;
        this.sceneObjects.push(imageborder);
    }

    makeTutorialCaption(fontSize: number, text: string, position:Vec2){
        const label = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: position, text: text});
        label.textColor = Color.WHITE;
        label.fontSize = fontSize;
        label.font = "Merriweather";
        this.sceneObjects.push(label);
    }
}