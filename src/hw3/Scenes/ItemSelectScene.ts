import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import PancakeColor from "../../Wolfie2D/Utils/PancakeColor";
import CharacterState from "../CharacterState";
import Item, { ItemType } from "../GameSystems/items/Item";
import MapScene from "./MapScene";
import HelpScreen from "./MenuScenes/HelpScreen";

export default class ItemSelectScene extends Scene {
    private characterState: CharacterState;
    private specialItems: boolean;

    private selections: Array<Button>;
    private selectButton: Button;
    private itemSelected: number;

    private allItems: any;  // Array of all items from the JSON file
    private itemChoices: Array<any>;
    
    initScene(init: Record<string, any>): void {
        this.characterState = init.characterState;
        this.specialItems = init.specialItems;
    }

    loadScene(){}

    startScene(){
        /* Determine random items to offer the player */
        const itemData = this.load.getObject("itemData");
        (this.specialItems)?(this.allItems = itemData.specialitems):(this.allItems = itemData.allitems);

        /* Assigns random items to the selection */
        this.itemChoices = new Array<any>(3);
        for(let i=0 ; i < this.itemChoices.length ;){
            if(this.allItems.length !== 0){
                let randomNum = this.randomInt(this.allItems.length);

                // each additional item of same type has half the chance of appearing as the previous one
                let multiplier = 1.0  
                // checks the inventory to see how many items are of this type
                let characterInventory = this.characterState.getInventory().getItems()
                for (var index = 0; index < characterInventory.length; index ++){ 
                    if (this.allItems[randomNum].key === characterInventory[index].key){
                        multiplier *= 0.5 
                    }
                }
                
                // if invincibility is allowed in help screen then don't drop cloak of invincibility
                if (this.allItems[randomNum].key != ItemType.CLOAK_OF_INVINCIBILITY || !HelpScreen.allowInvincibility){
                    /* Item passes rarity test, add to inventory */
                    if(this.passRarityTest(this.allItems[randomNum].rarity, multiplier)){
                        this.itemChoices[i] = this.allItems.splice(randomNum, 1)[0];
                        i++;
                    }
                }
            }

            else{
                this.itemChoices[i] = itemData.none;
                i++;
            }
        }

        /* Background Artwork */
        const center = this.viewport.getCenter();
        this.addLayer("background", 9);
        let backgroundart = this.add.sprite("defaultbackground", "background");
        backgroundart.position.set(center.x, center.y);

        /* Display Item Selection Scene */
        this.addLayer("primary", 10);
        this.addLayer("descriptions", 11);

        this.itemSelected = -1;
        this.selections = new Array<Button>(4);

        /* Healthbar */
        let multiplier = this.characterState.stats.maxHealth/100;
        let health = this.add.graphic(GraphicType.RECT, "descriptions", {position: new Vec2(330+this.characterState.stats.health, 66), size: new Vec2((this.characterState.stats.health*6)/multiplier, 30)});
        health.position = new Vec2(125+(this.characterState.stats.health*3)/multiplier, 66);
        let healthbarborder = this.add.sprite("healthbarborder", "primary");
        healthbarborder.position = new Vec2(437, 48);

        /* Sprite for character portrait */
        let portrait = this.add.sprite("portrait", "primary");
        portrait.position = new Vec2(62, 45);

        /* Sprite for portrait border */
        let portraitborder = this.add.sprite("portraitborder", "primary");
        portraitborder.position = new Vec2(62, 45);

        /* Header */
        const header = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x, center.y - 315), text: "Select an item to obtain"});
        header.textColor = Color.WHITE;
        header.fontSize = 35;
        header.font = "Merriweather";

        /* Display Item Buttons */
        this.makeItemButtons(new Vec2(center.x-500, center.y), 0);
        this.makeItemButtons(new Vec2(center.x, center.y), 1);
        this.makeItemButtons(new Vec2(center.x+500, center.y), 2);

        /* Heal Button */
        const heal = <Button>this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(center.x-500, center.y+350), text: "Heal for 1/3 of Max HP"});
        heal.size.set(300, 100);
        heal.borderWidth = 2;
        heal.borderColor = PancakeColor.PINK;
        heal.backgroundColor = PancakeColor.MAGENTA;
        heal.onClickEventId = "item4";
        heal.fontSize = 25;
        heal.font = "Merriweather";
        this.selections[3] = heal;

        /* Select */
        const select = <Button>this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(center.x, center.y+350), text: "SELECT"});
        select.size.set(150, 100);
        select.borderWidth = 2;
        select.borderColor = Color.WHITE;
        select.backgroundColor = Color.TRANSPARENT;
        select.onClickEventId = "select";
        select.fontSize = 25;
        select.font = "Merriweather";
        this.selectButton = select;

        // Subscribe to the button events
        this.receiver.subscribe("item1");
        this.receiver.subscribe("item2");
        this.receiver.subscribe("item3");
        this.receiver.subscribe("item4");
        this.receiver.subscribe("select");
    }

    updateScene(){
        while(this.receiver.hasNextEvent()){
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "click"});
            let event = this.receiver.getNextEvent();

            /* Select Item */
            if(event.type.substring(0, 4) === "item")
                this.itemSelected = parseInt(event.type.substring(4))-1;

            /* Select Item and Continue */
            if(event.type === "select"){
                if(this.itemSelected !== -1)
                {
                    /* Heal Player for 1/3 of Max HP */
                    if(this.itemSelected === 3)
                        this.characterState.healPlayer(this.characterState.stats.maxHealth * (1/3));

                    /* Add selected item to inventory, remove it from pool */
                    else{
                        this.characterState.addToInventory(this.itemChoices[this.itemSelected]);
                        
                        if(this.itemChoices[this.itemSelected].rarity === "special")
                            this.itemChoices[this.itemSelected] = null; //Final Project TODO - figure out stacking
                    }

                    /* Put non-selected items back into the pool */
                    for(let i=0 ; i < this.itemChoices.length ; i++)
                        if(this.itemChoices[i] !== null && this.itemChoices[i].key !== "none")
                            this.allItems.push(this.itemChoices[i]);

                    this.sceneManager.changeToScene(MapScene, {characterState: this.characterState});
                }
            }
        }

        /* Change color of button if item is selected */
        if(this.itemSelected !== -1){
            for(let i=0 ; i < this.selections.length ; i++){
                if(i === this.itemSelected)
                    this.selections[i].backgroundColor = new Color(50, 100, 70, 1);

                else this.selections[i].backgroundColor = PancakeColor.MAGENTA;;
            }
            this.selectButton.backgroundColor = PancakeColor.MAGENTA;;
        }        
    }
    
    makeItemButtons(position: Vec2, itemChoice: number){

        if(this.itemChoices[itemChoice].key !== "none"){
            /* Item Icon */
            let itemicon = this.add.sprite(this.itemChoices[itemChoice].key, "descriptions");
            itemicon.position.set(position.x, position.y-125);

            /* Item Icon Border */
            let rarity = this.itemChoices[itemChoice].rarity;
            let rarityColor = Item.getRarityColor(rarity);
            const border = <Label>this.add.uiElement(UIElementType.LABEL, "descriptions", {position: new Vec2(position.x, position.y-125), text:""});
            border.borderWidth = 4;
            border.size = new Vec2(175, 175);
            border.borderColor = rarityColor;

            /* Rarity Text */
            let rarityText = "(" + Item.getRarityText(rarity) + ")";
            const item1description = <Label>this.add.uiElement(UIElementType.LABEL, "descriptions", {position: new Vec2(position.x, position.y+35), text:rarityText});
            item1description.textColor = rarityColor;
            item1description.fontSize = 20;
            item1description.font = "Merriweather";
        }

        /* Selection Box */
        const item = <Button>this.add.uiElement(UIElementType.BUTTON, "primary", {position: position, text: this.itemChoices[itemChoice].name});
        item.size.set(450, 550);
        item.borderWidth = 2;
        item.borderColor = PancakeColor.PINK;
        item.backgroundColor = PancakeColor.MAGENTA;
        item.onClickEventId = "item"+(itemChoice+1);
        item.fontSize = 35;
        item.font = "Merriweather";
        this.selections[itemChoice] = item;

        /* Description */
        const item1description = <Label>this.add.uiElement(UIElementType.LABEL, "descriptions", {position: new Vec2(position.x, position.y+80), text:this.itemChoices[itemChoice].description});
        item1description.textColor = PancakeColor.BEIGE;
        item1description.fontSize = 20;
        item1description.font = "Merriweather";

        if (this.itemChoices[itemChoice] != this.load.getObject("itemData").none){
            // /* Stats */
            const item1stats = <Label>this.add.uiElement(UIElementType.LABEL, "descriptions", {position: new Vec2(position.x, position.y+120), text:this.itemChoices[itemChoice].stats});
            item1stats.textColor = Color.WHITE;
            item1stats.fontSize = 20;
            item1stats.font = "Merriweather";
        }

    }

    passRarityTest(rarity: string, multiplier: any): boolean{
        // console.log(multiplier)
        let chance = 100;
        if(rarity === "common")
            chance = 100;
        else if(rarity === "uncommon")
            chance = 60;
        else if(rarity === "rare")
            chance = 30;
        else if(rarity === "ultra_rare")
            chance = 7;
        // console.log(chance*multiplier)  
        if(this.randomInt(101) < chance * multiplier) // decreases chance each time item is found
            return true;
        return false;
    }

    randomInt(max: number): number{
        return Math.floor(Math.random() * max);
    }
}