import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Button from "../../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import MainMenu from "./MainMenu";

export default class Controls extends Scene {
    
    loadScene(){
        this.load.image("image1", "hw3_assets/sprites/howtoplay/tutorial1.png");
        this.load.image("image3", "hw3_assets/sprites/howtoplay/tutorial3.png");
    }

    startScene(){
        this.addUILayer("primary");
        const center = this.viewport.getCenter();
        
        /* Back Button */
        const back = <Button>this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(center.x-650, center.y-375), text: "Back"});
        back.size.set(200, 50);
        back.borderWidth = 2;
        back.borderColor = Color.WHITE;
        back.backgroundColor = new Color(50, 50, 70, 1);
        back.onClickEventId = "back";
    
        /* Controls */
        const controls = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x-560, center.y+50), text: ""});
        controls.textColor = Color.WHITE;
        controls.size.set(450, 750);
        controls.borderRadius = 2;
        controls.borderColor = Color.WHITE;
        controls.fontSize = 20;

        const controlsHeader = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x-560, center.y-285), text:"Controls"});
        controlsHeader.textColor = Color.WHITE;
        controlsHeader.fontSize = 35;

        let controlsText = ["WASD - Move", "Left Mouse - Basic Attack", "Right Mouse - Use Item"];
        this.makeTextLabels(controlsText, 75, new Vec2(center.x-560, center.y - 185));

        /* How To Play */
        const tutorial = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x+230, center.y+50), text:""});
        tutorial.textColor = Color.WHITE;
        tutorial.size.set(1100, 750);
        tutorial.borderRadius = 2;
        tutorial.borderColor = Color.WHITE;
        tutorial.fontSize = 20;

        const tutorialHeader = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x+230, center.y-285), text:"How To Play"});
        tutorialHeader.textColor = Color.WHITE;
        tutorialHeader.fontSize = 35;

        /* Tutorial Images */
        this.makeTutorialImage("image1", new Vec2(center.x-40, center.y-100));
        this.makeTutorialImage("image1", new Vec2(center.x+500, center.y-100));
        this.makeTutorialImage("image3", new Vec2(center.x-40, center.y+225));
        this.makeTutorialImage("image1", new Vec2(center.x+500, center.y+225));

        /* Image Captions */
        this.makeTutorialCaption(25, "Fight enemies using attacks and items", new Vec2(center.x-40, center.y+45));
        
        this.makeTutorialCaption(22, "Items have different effects and can be", new Vec2(center.x+500, center.y+45));
        this.makeTutorialCaption(22, "found after clearing a room", new Vec2(center.x+500, center.y+75));

        this.makeTutorialCaption(22, "Yellow tiles indicate where an enemy is planning", new Vec2(center.x-40, center.y+365));
        this.makeTutorialCaption(22, "to attack. Avoid these to save your health", new Vec2(center.x-40, center.y+395));

        this.makeTutorialCaption(22, "If your health reaches 0 you will game over.", new Vec2(center.x+500, center.y+365));
        this.makeTutorialCaption(22, "Progress doesn't save so be careful!", new Vec2(center.x+500, center.y+395));

        // Subscribe to the button events
        this.receiver.subscribe("back");
    }

    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            if(event.type === "back")
                this.sceneManager.changeScene(MainMenu, {});
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
        }
    }

    makeTutorialImage(image: string, position: Vec2){
        let levelimage = this.add.sprite(image, "primary");
        levelimage.position.set(position.x, position.y);
        
        const imageborder = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: position, text: ""});
        imageborder.size.set(440, 240);
        imageborder.borderWidth = 2;
        imageborder.borderColor = Color.WHITE;
    }

    makeTutorialCaption(fontSize: number, text: string, position:Vec2){
        const label = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: position, text: text});
        label.textColor = Color.WHITE;
        label.fontSize = fontSize;
    }
}