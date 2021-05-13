import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import Input from "../../../Wolfie2D/Input/Input";
import Button from "../../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import PancakeColor from "../../../Wolfie2D/Utils/PancakeColor";
import MainMenu from "./MainMenu";

export default class HelpScreen extends Scene {
    
    cheatButtonLabels: Array<Button>;   // UI Buttons for cheats
    cheatList: Array<boolean>;          // Holds the booleans for each cheat
    cheatEventNames: Array<string>;     // Holds the event names for each cheat

    static allLevelsUnlocked: boolean = false;
    static allowInvincibility: boolean = false;
    static instakill: boolean = false;
    static roomSkipping: boolean = false;
    static cheat5: boolean = false;

    static invincibility: boolean = false;

    loadScene(){}

    startScene(){
        this.addLayer("primary", 10);
        this.addLayer("text", 11);

        const center = this.viewport.getCenter();
        
        /* Background Artwork */
        this.addLayer("background", 9);
        let backgroundart = this.add.sprite("defaultbackground", "background");
        backgroundart.position.set(center.x, center.y);

        /* Initializes the list of cheats */
        this.cheatList = [HelpScreen.allLevelsUnlocked, HelpScreen.allowInvincibility, HelpScreen.instakill, HelpScreen.roomSkipping, HelpScreen.cheat5];

        /* Back Button */
        const back = <Button>this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(center.x-650, center.y-375), text: "Back"});
        back.size.set(200, 50);
        back.borderWidth = 2;
        back.borderColor = Color.WHITE;
        back.backgroundColor = new Color(50, 50, 70, 1);
        back.onClickEventId = "back";
        back.font = "Merriweather";

        /* Backstory */
        let backstory = [
            "You work on the lowest floor of a luxury cruise ship.",
            "On a seemingly normal route, the ship is attacked by a horde of",
            "dangerous sea monsters and sustains a heavy amount of damage.",
            "Under the assault of these creatures, the ship begins to sink",
            "into the depths below. In order to save the lives of everyone",
            "on board, as well as yourself, you have to fight through each",
            "floor of the ship, destroying any monsters that you encounter",
            "along the way until you reach the top."
        ]
        this.createBackstoryText(new Vec2(center.x-350, center.y-200), backstory, 20, 30);

        const backstoryBox = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x-350, center.y-110), text:""});
        backstoryBox.textColor = Color.WHITE;
        backstoryBox.size.set(650, 350);
        backstoryBox.borderRadius = 2;
        backstoryBox.borderWidth = 2;
        backstoryBox.borderColor = PancakeColor.PINK;
        backstoryBox.backgroundColor = PancakeColor.MAGENTA;
        backstoryBox.fontSize = 20;

        const backstoryHeader = <Label>this.add.uiElement(UIElementType.LABEL, "text", {position: new Vec2(center.x-350, center.y-250), text:"Backstory"});
        backstoryHeader.textColor = PancakeColor.BEIGE;
        backstoryHeader.fontSize = 35;
        backstoryHeader.font = "Merriweather";

        /* Cheat Codes */
        const cheats = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x+350, center.y+50), text:""});
        cheats.textColor = PancakeColor.BEIGE;
        cheats.size.set(600, 675);
        cheats.borderRadius = 2;
        cheats.borderColor = PancakeColor.PINK;
        cheats.backgroundColor = PancakeColor.MAGENTA;
        cheats.fontSize = 20;
        cheats.font = "Merriweather";
        cheats.borderWidth = 2;

        const cheatsHeader = <Label>this.add.uiElement(UIElementType.LABEL, "text", {position: new Vec2(center.x+350, center.y-250), text:"Cheats"});
        cheatsHeader.textColor = PancakeColor.BEIGE;
        cheatsHeader.fontSize = 35;
        cheatsHeader.font = "Merriweather";
        
        /* Developers */
        const developers = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x-350, center.y+235), text:""});
        developers.textColor = Color.WHITE;
        developers.size.set(650, 250);
        developers.borderRadius = 2;
        developers.borderWidth = 2;
        developers.borderColor = PancakeColor.PINK;
        developers.backgroundColor = PancakeColor.MAGENTA;
        developers.fontSize = 20;

        const devsHeader = <Label>this.add.uiElement(UIElementType.LABEL, "text", {position: new Vec2(center.x-350, center.y+150), text:"Developers"});
        devsHeader.textColor = PancakeColor.BEIGE;
        devsHeader.fontSize = 35;
        devsHeader.font = "Merriweather";

        let devnames = ["Timothy Hsu", "Edward Huang", "Michael Carpenzano"];
        this.createBackstoryText(new Vec2(center.x-350, center.y+220), devnames, 25, 40);

        /* Create Cheat Code Buttons */
        let cheatTextArray = ["Unlock All Levels", "Invincibility [I]", "Kill All Enemies [LMB]", "Room Skipping [1-6]", "Cheat 5"];
        this.cheatEventNames = ["cheat1", "cheat2", "cheat3", "cheat4", "cheat5"];
        this.createCheatButtons(5, center, cheatTextArray, 110, this.cheatEventNames);

        // Subscribe to the button events
        this.receiver.subscribe("back");
        for(let i = 0 ; i < this.cheatEventNames.length ; i++)
            this.receiver.subscribe(this.cheatEventNames[i]);
    }

    updateScene(){
        if (Input.isJustPressed("escape")){
            this.sceneManager.changeToScene(MainMenu, {});
        }
        else{
            while(this.receiver.hasNextEvent()){
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "click"});
                let event = this.receiver.getNextEvent();

                /* Back Button */
                if(event.type === "back")
                    this.sceneManager.changeToScene(MainMenu, {});

                /* Cheat Codes */
                for(let i = 0 ; i < this.cheatEventNames.length; i++)
                    if(event.type === this.cheatEventNames[i])
                        (this.cheatList[i])?(this.cheatList[i]=false):(this.cheatList[i]=true);
            }

            /* Change color of cheat buttons if they're on/off */
            for(let i = 0 ; i < this.cheatList.length ; i++){
                if(this.cheatList[i])
                    this.cheatButtonLabels[i].backgroundColor = new Color(50, 100, 70, 1);
                
                else this.cheatButtonLabels[i].backgroundColor = new Color(50, 50, 70, 1);
            }

            /* Sets values of the static variables (since the cheatList array only stores the variables by value, not reference)*/
            (this.cheatList[0])?(HelpScreen.allLevelsUnlocked = true):(HelpScreen.allLevelsUnlocked = false);
            (this.cheatList[1])?(HelpScreen.allowInvincibility = true):(HelpScreen.allowInvincibility = false);
            (this.cheatList[2])?(HelpScreen.instakill = true):(HelpScreen.instakill = false);
            (this.cheatList[3])?(HelpScreen.roomSkipping = true):(HelpScreen.roomSkipping = false);
            (this.cheatList[4])?(HelpScreen.cheat5 = true):(HelpScreen.cheat5 = false);
        }
    }

    createBackstoryText(startPos: Vec2, text:Array<string>, fontSize: number, spacing: number){
        for(let i=0 ; i < text.length ; i++){
            const textline = <Label>this.add.uiElement(UIElementType.LABEL, "text", {position: new Vec2(startPos.x, startPos.y+(i*spacing)), text: text[i]});
            textline.textColor = Color.WHITE;
            textline.fontSize = fontSize;
            textline.font = "Merriweather";
        }
    }

    /* Creates the cheat code buttons */
    createCheatButtons(numCheats: number, center: Vec2, text: Array<string>, posOffset: number, onClickEvent: Array<string>){
        this.cheatButtonLabels = new Array<Button>(numCheats);
        for(let i = 0 ; i < numCheats ; i++){
            /* Buttons */
            const cheat = <Button>this.add.uiElement(UIElementType.BUTTON, "text", {position: new Vec2(center.x+350, (center.y-175)+(i*posOffset)), text: text[i]});
            cheat.size.set(320, 75);
            cheat.borderWidth = 2;
            cheat.borderColor = Color.WHITE;
            cheat.backgroundColor = new Color(50, 50, 70, 1);
            cheat.font = "Merriweather";
            cheat.fontSize = 25;
            cheat.onClickEventId = onClickEvent[i];
            this.cheatButtonLabels[i] = cheat;
        }
    }
}