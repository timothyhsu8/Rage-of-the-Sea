import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import Button from "../../../Wolfie2D/Nodes/UIElements/Button";
import Inventory from "../../GameSystems/Inventory";
import CharacterState from "../../CharacterState";
import MainMenu from "./MainMenu";
import MapScene from "../MapScene";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import UITweens from "../../../Wolfie2D/Rendering/Animations/UITweens";


export default class CharacterSelect extends Scene {
    private sceneObjects: Array<GameNode>;
    private sceneUI: Array<GameNode>;
    private startingLevel: number;
    
    initScene(init: Record<string, any>): void {
        this.startingLevel = init.startingLevel;
    }

    loadScene(){
        this.load.image("diversplash", "hw3_assets/sprites/characterselect/diversplashart.png");
        this.load.image("splashborder", "hw3_assets/sprites/characterselect/splashartborder.png");
    }

    startScene(){this.addUILayer("characterSelect");
        this.sceneObjects = new Array<GameNode>();
        this.sceneUI = new Array<GameNode>();
        const center = this.viewport.getCenter();

        /* Background Artwork */
        this.addLayer("background", 9);
        let backgroundart = this.add.sprite("defaultbackground", "background");
        backgroundart.position.set(center.x, center.y);
        UITweens.fadeIn(backgroundart, 0, 600);

        this.addLayer("primary", 10);

        let diversplash = this.add.sprite("diversplash", "primary");
        diversplash.position = new Vec2(center.x, center.y-150);
        this.sceneObjects.push(diversplash);
    
        let portraitborder = this.add.sprite("splashborder", "primary");
        portraitborder.position = new Vec2(center.x, center.y-150);
        this.sceneObjects.push(portraitborder);

        /* Back Button */
        const back = <Button>this.add.uiElement(UIElementType.BUTTON, "characterSelect", {position: new Vec2(center.x-650, center.y-375), text: "Back"});
        back.size.set(200, 50);
        back.borderWidth = 2;
        back.borderColor = Color.WHITE;
        back.backgroundColor = new Color(50, 50, 70, 1);
        back.onClickEventId = "back";
        this.sceneUI.push(back);

        /* Character Name */
        const header = <Label>this.add.uiElement(UIElementType.LABEL, "characterSelect", {position: new Vec2(center.x, center.y+130), text: "Diver"});
        header.textColor = Color.WHITE;
        header.fontSize = 40;
        this.sceneUI.push(header);

        /* Select Button */
        const select = this.add.uiElement(UIElementType.BUTTON, "characterSelect", {position: new Vec2(center.x, center.y+230), text: "SELECT"});
        select.size.set(200, 75);
        select.borderWidth = 3;
        select.borderColor = Color.WHITE;
        select.backgroundColor = new Color(50, 50, 70, 1);
        select.onClickEventId = "select";
        this.sceneUI.push(select);

        /* Character Description */
        const description = this.add.uiElement(UIElementType.BUTTON, "characterSelect", {position: new Vec2(center.x, center.y+350), text: "The diver has a dark and mysterious past."});
        description.size.set(800, 100);
        description.borderWidth = 2;
        description.borderColor = Color.WHITE;
        description.backgroundColor = Color.TRANSPARENT;
        this.sceneUI.push(description);

        /* Subscribe to the button events */
        this.receiver.subscribe("select");
        this.receiver.subscribe("back");

        /* Play Tweens */
        UITweens.fadeInScene(this.sceneObjects);
        UITweens.slideInScene(this.sceneUI, 150, new Vec2(1200, 0));
    }

    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            if(event.type === "select"){
                let inventory = new Inventory(this, 50);
                let characterState = new CharacterState(100, 0, 0, 80, inventory, "diverportrait", this.startingLevel);
                this.sceneManager.changeToScene(MapScene, {characterState: characterState});
            }

            if(event.type === "back")
                this.sceneManager.changeToScene(MainMenu, {});
        }
    }
}