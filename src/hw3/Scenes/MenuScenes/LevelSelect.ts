import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Button from "../../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../../Wolfie2D/Scene/Layer";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import MainMenu from "./MainMenu";

export default class LevelSelect extends Scene {
    
    loadScene(){
        this.load.image("levelimage", "hw3_assets/sprites/levelimage.png");
    }

    startScene(){
        const center = this.viewport.getCenter();
        this.addUILayer("levelSelect");
        
        /* Back Button */
        const back = <Button>this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x-650, center.y-375), text: "Back"});
        back.size.set(200, 50);
        back.borderWidth = 2;
        back.borderColor = Color.WHITE;
        back.backgroundColor = new Color(50, 50, 70, 1);
        back.onClickEventId = "back";
    
        /* Level Select Header */
        const header = <Label>this.add.uiElement(UIElementType.LABEL, "levelSelect", {position: new Vec2(center.x, center.y-375), text: "Level Select"});
        header.textColor = Color.WHITE;
        header.fontSize = 50;

        this.addLayer("levelimages", 9);
        /* Row 1 */
        for(let i = 0 ; i < 3 ; i++){
            /* Border Buttons */
            const level = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x-500 + (i*500), center.y-150), text: ""});
            level.size.set(375, 200);
            level.borderColor = Color.WHITE;
            level.backgroundColor = Color.TRANSPARENT;
            level.onClickEventId = "back";

            let levelimage = this.add.sprite("levelimage", "levelimages");
            levelimage.position.set(center.x-500 + (i*500), center.y-150);
        }

        /* Row 2 */
        for(let i = 0 ; i < 3 ; i++){
            /* Border Buttons */
            const level = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x-500 + (i*500), center.y+150), text: ""});
            level.size.set(375, 200);
            level.borderColor = Color.WHITE;
            level.backgroundColor = Color.TRANSPARENT;
            level.onClickEventId = "back";

            let levelimage = this.add.sprite("levelimage", "levelimages");
            levelimage.position.set(center.x-500 + (i*500), center.y+150);
        }

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
}