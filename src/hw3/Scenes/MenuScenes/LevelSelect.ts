import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Button from "../../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import UITweens from "../../../Wolfie2D/Rendering/Animations/UITweens";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import CharacterSelect from "./CharacterSelect";
import MainMenu from "./MainMenu";

export default class LevelSelect extends Scene {
    private sceneUI: Array<GameNode>;

    loadScene(){
        this.load.image("levelimage", "hw3_assets/sprites/levelselect/levelimage.png");
    }

    startScene(){
        const NUM_LEVELS = 6;
        
        this.sceneUI = new Array<GameNode>();
        const center = this.viewport.getCenter();
        this.addUILayer("levelSelect");
        
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
        /* Row 1 */
        for(let i = 0 ; i < 3 ; i++){
            /* Border Buttons */
            const level = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x-500 + (i*500), center.y-150), text: ""});
            level.size.set(375, 200);
            level.borderColor = Color.WHITE;
            level.backgroundColor = Color.TRANSPARENT;
            level.onClickEventId = "level"+(i+1);
            this.sceneUI.push(level);

            let levelimage = this.add.sprite("levelimage", "levelimages");
            levelimage.position.set(center.x-500 + (i*500), center.y-150);
            this.sceneUI.push(levelimage);
        }

        /* Row 2 */
        for(let i = 0 ; i < 3 ; i++){
            /* Border Buttons */
            const level = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x-500 + (i*500), center.y+150), text: ""});
            level.size.set(375, 200);
            level.borderColor = Color.WHITE;
            level.backgroundColor = Color.TRANSPARENT;
            level.onClickEventId = "level"+(i+4);
            this.sceneUI.push(level);

            let levelimage = this.add.sprite("levelimage", "levelimages");
            levelimage.position.set(center.x-500 + (i*500), center.y+150);
            this.sceneUI.push(levelimage);
        }

        // Subscribe to the button events
        this.receiver.subscribe("back");
        
        for(let i=1 ; i <= NUM_LEVELS ; i++)
            this.receiver.subscribe("level" + i);

        UITweens.slideInScene(this.sceneUI, 50, new Vec2(2000, 0));
    }
    
    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            if(event.type === "back")
                this.sceneManager.changeToScene(MainMenu, {});

            /* Go To Character Select Screen */
            if(event.type.substring(0,5) === "level"){
                let floorLevel = parseInt(event.type.substring(5)); // Obtains floor level that user chose
                this.sceneManager.changeToScene(CharacterSelect, {startingLevel: floorLevel});
            }
        }
    }
}