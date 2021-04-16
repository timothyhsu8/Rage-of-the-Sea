import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Button from "../../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import TextInput from "../../../Wolfie2D/Nodes/UIElements/TextInput";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../../Wolfie2D/Scene/Layer";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import MainMenu from "./MainMenu";

export default class HelpScreen extends Scene {
    
    cheatButtonLabels: Array<Button>;   // UI Buttons for cheats
    cheatList: Array<boolean>;          // Holds the booleans for each cheat
    cheatEventNames: Array<string>;     // Holds the event names for each cheat

    static allLevelsUnlocked: boolean = false;
    static invincibility: boolean = false;
    static cheat3: boolean = false;
    static cheat4: boolean = false;
    static cheat5: boolean = false;

    loadScene(){}

    startScene(){
        this.addLayer("primary", 10);
        const center = this.viewport.getCenter();
        this.addUILayer("help");
        
        /* Initializes the list of cheats */
        this.cheatList = [HelpScreen.allLevelsUnlocked, HelpScreen.invincibility, HelpScreen.cheat3, HelpScreen.cheat4, HelpScreen.cheat5];

        /* Back Button */
        const back = <Button>this.add.uiElement(UIElementType.BUTTON, "help", {position: new Vec2(center.x-650, center.y-375), text: "Back"});
        back.size.set(200, 50);
        back.borderWidth = 2;
        back.borderColor = Color.WHITE;
        back.backgroundColor = new Color(50, 50, 70, 1);
        back.onClickEventId = "back";
    
        /* Developer Names */
        let aboutText = "Developers: Edward Huang, Michael Carpenzano, and Timothy Hsu";
        const about = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y-375), text: aboutText});
        about.textColor = Color.WHITE;
        about.size.set(200, 500);
        about.fontSize = 20;

        /* Backstory */
        let backstoryText = "Game backstory here";
        const backstory = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x-350, center.y), text: backstoryText});
        backstory.textColor = Color.WHITE;
        backstory.size.set(600, 675);
        backstory.borderRadius = 2;
        backstory.borderColor = Color.WHITE;
        backstory.fontSize = 20;

        const backstoryHeader = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x-350, center.y-300), text:"Backstory"});
        backstoryHeader.textColor = Color.WHITE;
        backstoryHeader.fontSize = 35;

        /* Cheat Codes */
        const cheats = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x+350, center.y), text:""});
        cheats.textColor = Color.WHITE;
        cheats.size.set(600, 675);
        cheats.borderRadius = 2;
        cheats.borderColor = Color.WHITE;
        cheats.fontSize = 20;

        const cheatsHeader = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x+350, center.y-300), text:"Cheats"});
        cheatsHeader.textColor = Color.WHITE;
        cheatsHeader.fontSize = 35;
        
        /* Create Cheat Code Buttons */
        let cheatTextArray = ["Unlock All Levels", "Invincibility", "Cheat 3", "Cheat 4", "Cheat 5"];
        this.cheatEventNames = ["cheat1", "cheat2", "cheat3", "cheat4", "cheat5"];
        this.createCheatButtons(5, center, cheatTextArray, 100, this.cheatEventNames);

        // Subscribe to the button events
        this.receiver.subscribe("back");
        for(let i = 0 ; i < this.cheatEventNames.length ; i++)
            this.receiver.subscribe(this.cheatEventNames[i]);
    }

    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            /* Back Button */
            if(event.type === "back")
                this.sceneManager.changeScene(MainMenu, {});

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
        (this.cheatList[1])?(HelpScreen.invincibility = true):(HelpScreen.invincibility = false);
        (this.cheatList[2])?(HelpScreen.cheat3 = true):(HelpScreen.cheat3 = false);
        (this.cheatList[3])?(HelpScreen.cheat4 = true):(HelpScreen.cheat4 = false);
        (this.cheatList[4])?(HelpScreen.cheat5 = true):(HelpScreen.cheat5 = false);
    }

    /* Creates the cheat code buttons */
    createCheatButtons(numCheats: number, center: Vec2, text: Array<string>, posOffset: number, onClickEvent: Array<string>){
        this.cheatButtonLabels = new Array<Button>(numCheats);
        for(let i = 0 ; i < numCheats ; i++){
            /* Buttons */
            const cheat = <Button>this.add.uiElement(UIElementType.BUTTON, "help", {position: new Vec2(center.x+350, (center.y-225)+(i*posOffset)), text: text[i]});
            cheat.size.set(250, 50);
            cheat.borderWidth = 2;
            cheat.borderColor = Color.WHITE;
            cheat.backgroundColor = new Color(50, 50, 70, 1);
            cheat.onClickEventId = onClickEvent[i];
            this.cheatButtonLabels[i] = cheat;
        }
    }
}