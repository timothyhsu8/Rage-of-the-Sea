import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../../Wolfie2D/Utils/Color";
import CharacterState from "../../CharacterState";
import Button from "../../../Wolfie2D/Nodes/UIElements/Button";
import MapScene from "../MapScene";
import PancakeColor from "../../../Wolfie2D/Utils/PancakeColor";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import Input from "../../../Wolfie2D/Input/Input";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Item from "../../GameSystems/items/Item";
import Stats from "../../Stats";

export default class InventoryScene extends Scene {
    private characterState: CharacterState;
    private equippedItems: Array<Item>;
    private itemIcons: Array<Sprite>;
    
    private itemName: Label;
    private itemDescription: Label;
    private itemDescriptionBox: Sprite;
    private hovering: boolean;
    private hoveredItem: Sprite;

    initScene(init: Record<string, any>): void {
        this.characterState = init.characterState;
    }

    loadScene(){}

    startScene(){
        this.addLayer("background", 9);
        this.addLayer("primary", 10);
        this.addLayer("inventory", 11);
        this.addLayer("itemdescriptionbox", 12);
        this.addLayer("itemdescriptions", 13);

        this.itemIcons = new Array<Sprite>();
        this.hovering = false;

        /* Background Artwork */
        const center = this.viewport.getCenter();
        let backgroundart = this.add.sprite("defaultbackground", "background");
        backgroundart.position.set(center.x, center.y);

        /* Item name Label */
        this.itemName = <Label>this.add.uiElement(UIElementType.LABEL, "itemdescriptions", {position: new Vec2(-100, -100), text: ""});
        this.itemName.font = "Merriweather";
        this.itemName.visible = false;
        this.itemName.fontSize = 15;

        /* Item descriptions on item hover */
        this.itemDescription = <Label>this.add.uiElement(UIElementType.LABEL, "itemdescriptions", {position: new Vec2(-100, -100), text: ""});
        this.itemDescription.textColor = PancakeColor.BEIGE;
        this.itemDescription.font = "Merriweather";
        this.itemDescription.visible = false;
        this.itemDescription.fontSize = 15;

        /* Item Description Box */
        this.itemDescriptionBox = this.add.sprite("itemdescriptionbox", "itemdescriptionbox");
        this.itemDescriptionBox.visible = false;

        const currentlyEquipped = <Label>this.add.uiElement(UIElementType.LABEL, "inventory", {position: new Vec2(950, 75), text: "Equipped Items"});
        currentlyEquipped.textColor = PancakeColor.BEIGE;
        currentlyEquipped.fontSize = 35;
        currentlyEquipped.font = "Merriweather";

        const inventoryHeader = <Label>this.add.uiElement(UIElementType.LABEL, "inventory", {position: new Vec2(center.x-550, 345), text: "Diver"});
        inventoryHeader.textColor = Color.WHITE;
        inventoryHeader.font = "Merriweather";

        /* Back Button */
        const back = <Button>this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(200, 75), text: "Back to Map"});
        back.size.set(200, 50);
        back.borderWidth = 2;
        back.borderColor = Color.WHITE;
        back.backgroundColor = new Color(50, 50, 70, 1);
        back.onClickEventId = "back";
        back.font = "Merriweather";

        /* Player Portrait */
        let portrait = this.add.sprite(this.characterState.portrait, "inventory");
        portrait.scale = new Vec2(2, 2);
        portrait.position = new Vec2(center.x-550, 240);
        let portraitborder = this.add.sprite("portraitborder", "inventory");
        portraitborder.scale = new Vec2(2, 2);
        portraitborder.position = new Vec2(center.x-550, 240);

        /* Player Portrait Background */
        const playerBackground = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x-550, center.y+30), text: ""});
        playerBackground.backgroundColor = PancakeColor.colorFromIndex(5);
        playerBackground.borderWidth = 2;
        playerBackground.borderRadius = 10;
        playerBackground.borderColor = Color.WHITE;
        playerBackground.size.set(350, 700);

        let stats = this.characterState.stats;
        let ability = "Anchor Swing";
        let statNames = ["Ability", "Health", "Attack", "Defense", "Speed", "Attack Multiplier", "Take Damage Multiplier"]
        let statNumbers = ["Anchor Swing", stats.health.toFixed(0) + "/" +stats.maxHealth+"", (1.0 + stats.attack).toFixed(1), stats.defense.toFixed(1), stats.speed+"", stats.attackMult.toFixed(1), stats.takeDamageMult.toFixed(1)];
        let statChanges = this.getStatChanges(stats);
        this.makePlayerStats(new Vec2(center.x-550, 390), 65, statNames, statNumbers, statChanges);

        /* Item Icons Background */
        const iconBackground = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x+150, center.y+25), text: ""});
        iconBackground.backgroundColor = PancakeColor.MAGENTA;
        iconBackground.borderWidth = 2;
        iconBackground.borderRadius = 2;
        iconBackground.borderColor = PancakeColor.PINK;
        iconBackground.size.set(1000, 725);

        /* Item Icons */
        let width = 500;
        let height = 160;
        this.equippedItems = this.characterState.getInventory().getItems();
        for(let i=0 ; i < this.equippedItems.length ; i++){
            /* Item Icon */
            let icon = this.add.sprite(this.equippedItems[i].key, "inventory");
            icon.scale.set(1/2, 1/2);
            icon.position = new Vec2(width, height);
            this.itemIcons.push(icon);

            /* Item Icon Border */
            const border = <Label>this.add.uiElement(UIElementType.LABEL, "inventory", {position: icon.position, text: ""});
            border.size = new Vec2(icon.size.x/2, icon.size.y/2);
            border.borderRadius = 2;
            border.borderColor = Color.WHITE;
            border.borderWidth = 2;

            width += 100
            if (width >= 1500){
                height += 100
                width = 500
            }
        }

        this.receiver.subscribe("back");
    }

    updateScene(deltaT: number): void {
        if (Input.isJustPressed("escape")){
            this.sceneManager.changeToScene(MapScene, {characterState: this.characterState});
        }
        else{            
            while(this.receiver.hasNextEvent()){
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "click"});
                let event = this.receiver.getNextEvent();

                if(event.type === "back")
                    this.sceneManager.changeToScene(MapScene, {characterState: this.characterState});
            }
        }

        /* Check if mouse is hovering over item */
        if(!this.hovering){
            for(let i=0 ; i < this.itemIcons.length ; i++){
                let mousePos: Vec2 = Input.getMousePosition()

                /* If item is being hovered */
                if(this.itemIcons[i].contains(mousePos.x, mousePos.y)){
                    this.hovering = true;
                    this.hoveredItem = this.itemIcons[i];

                    /* Item name */
                    this.itemName.position.set(this.itemIcons[i].position.x, this.itemIcons[i].position.y-92);
                    this.itemName.text = this.equippedItems[i].name + " (" + Item.getRarityText(this.equippedItems[i].rarity) + ")"; 
                    this.itemName.textColor = Item.getRarityColor(this.equippedItems[i].rarity);
                    this.itemName.visible = true;
                    
                    /* Description */
                    this.itemDescription.position.set(this.itemIcons[i].position.x, this.itemIcons[i].position.y-67);
                    this.itemDescription.text = this.equippedItems[i].description; 
                    this.itemDescription.visible = true;

                    /* Description Box */
                    this.itemDescriptionBox.position.set(this.itemIcons[i].position.x, this.itemIcons[i].position.y-80);
                    this.itemDescriptionBox.visible = true;
                }
            }
        }
        
        /* Item is being hovered */
        else{
            let mousePos: Vec2 = Input.getMousePosition()
            if(!this.hoveredItem.contains(mousePos.x, mousePos.y)){
                this.itemName.visible = false;
                this.itemDescriptionBox.visible = false;
                this.itemDescription.visible = false;
                this.hovering = false;
            }
        }
    }

    makePlayerStats(startPos: Vec2, yoffset: number, statNames: Array<string>, statNumbers: Array<string>, statChanges: Array<string>){
        for(let i=0 ; i < statNames.length ; i++){
            let pos = new Vec2(startPos.x, startPos.y + yoffset*i);

            const stat = <Label>this.add.uiElement(UIElementType.LABEL, "itemdescriptions", {position: pos, text: statNames[i]});
            stat.textColor = PancakeColor.BEIGE;
            stat.fontSize = 20;
            stat.font = "Merriweather";

            const statNum = <Label>this.add.uiElement(UIElementType.LABEL, "itemdescriptions", {position: new Vec2(pos.x, pos.y+25), text: statNumbers[i]});
            statNum.textColor = Color.WHITE;
            statNum.fontSize = 20;
            statNum.font = "Merriweather";
            
            if (i != 0){
                const statChangesText = <Label>this.add.uiElement(UIElementType.LABEL, "itemdescriptions", {position: new Vec2(pos.x+130, pos.y+25), text: "(" + statChanges[i] + ")"});
                statChangesText.textColor = PancakeColor.BEIGE;
                statChangesText.fontSize = 17;
                statChangesText.font = "Merriweather";
            }
        }
    }

    getStatChanges(stats: Stats){
        let maxHealth = "+" + (stats.maxHealth-100);
        let attack = "+" + stats.attack.toFixed(1);
        let defense = "+" + stats.defense.toFixed(1);
        let speed = "" + (stats.speed-80);
        (stats.speed >= 80)?(speed = "+" + speed):(speed = speed);
        let attackMult = "+" + (stats.attackMult-1).toFixed(1);
        let takeDamageMult = "-" + (1-stats.takeDamageMult).toFixed(1);
        return ["", maxHealth, attack, defense, speed, attackMult, takeDamageMult];
    }
}