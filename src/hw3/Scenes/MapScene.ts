import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import BattleRoom from "./BattleRoom";
import CharacterState from "../CharacterState";
import InventoryScene from "./MenuScenes/InventoryScene";
import MainMenu from "./MenuScenes/MainMenu";
import PancakeColor from "../../Wolfie2D/Utils/PancakeColor";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Floor from "../GameSystems/Mapping/Floor";
import MapGenerator from "../GameSystems/MapGenerator";
import Line from "../../Wolfie2D/Nodes/Graphics/Line";
import Room from "../GameSystems/Mapping/Room";
import { RoomTypes } from "../GameSystems/Mapping/RoomType_Enums";
import MapState from "../GameSystems/MapState";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import HelpScreen from "./MenuScenes/HelpScreen";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import UITweens from "../../Wolfie2D/Rendering/Animations/UITweens";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import ItemSelectScene from "./ItemSelectScene";

export default class MapScene extends Scene{
    private sceneObjects: Array<GameNode>;
    private quitConfirmation: Array<Label>
    private quitLabelVisible: boolean;

    private mapState: MapState;
    private characterState: CharacterState; // All data of the character goes here
    private roomArray: Array<Array<Room>>;
    private roomButtons: Array<Array<Button>>;
    private nextFloorButton: Button;

    initScene(init: Record<string, any>): void {
        this.characterState = init.characterState;
        this.mapState = this.characterState.mapState;
    }

    loadScene(){
        //this.load.image("portrait", "game_assets/sprites/healthUI/" + this.characterState.portrait + ".png");
    }

    startScene(){
        const floor_names = ["Floor 1: Engine Room", "Floor 2: Casino", "Floor 3: Event Room", "Floor 4: Dining Area", "Floor 5: Poolside", "Floor 6: The Bridge", "Floor 7: Boss"];
        const MAX_FLOOR_NUM = 7;
        const center = this.viewport.getCenter();

        this.quitConfirmation = new Array<Label>();
        this.sceneObjects = new Array<GameNode>();
        this.quitLabelVisible = false;

        /* Background Artwork */
        this.addLayer("background", 1);
        let backgroundart = this.add.sprite("defaultbackground", "background");
        backgroundart.position.set(center.x, center.y);

        // The main menu
        this.addUILayer("map");
        this.addUILayer("rooms");
        this.addUILayer("floortext");
        this.addUILayer("quitConfirmation");
        this.addLayer("primary", 10);

        /* Generate map or load the saved one */
        let generatedFloor = null;
        if(this.mapState.savedFloor === undefined){
            generatedFloor = MapGenerator.generateFloor(0);
            this.mapState.savedFloor = generatedFloor;
        }
        else generatedFloor = this.mapState.savedFloor;

        /* Initialize Buttons Array */
        this.roomButtons = new Array<Array<Button>>(generatedFloor.roomArray.length);
        for(let i=0; i < generatedFloor.roomArray.length; i++)
            this.roomButtons[i] = new Array<Button>(generatedFloor.roomArray[i].length);
    
        // render map
        this.renderMap(generatedFloor);

        /* Load saved button colors */
        if(this.mapState.savedButtons !== undefined){
            for(let i=0 ; i<this.roomButtons.length ; i++)
                for(let j=0 ; j<this.roomButtons[i].length ; j++)
                    this.roomButtons[i][j].backgroundColor = this.mapState.savedButtons[i][j].backgroundColor;
        }
        
        /* Set next floor as open if the cheat is enabled */
        if(HelpScreen.roomSkipping)
            this.mapState.nextFloorOpen = true;

        /* Next Floor Button */
        const nextFloor = <Button>this.add.uiElement(UIElementType.BUTTON, "map", {position: new Vec2(center.x, center.y+400), text: "Next Floor"});
        this.nextFloorButton = nextFloor;  
        nextFloor.size.set(250, 50);
        nextFloor.borderWidth = 2;
        nextFloor.borderColor = Color.WHITE;
        nextFloor.onClickEventId = "nextfloor";
        nextFloor.fontSize = 30;
        nextFloor.font = "Merriweather";
        
        if(this.characterState.mapState.currentFloor === 6)
            nextFloor.text = "Boss Room";

        (HelpScreen.roomSkipping || this.mapState.nextFloorOpen)?(nextFloor.backgroundColor = PancakeColor.colorFromIndex(16)):(nextFloor.backgroundColor = Color.TRANSPARENT);

        /* Disables 'Next Floor' button on the last  floor */
        if(this.mapState.currentFloor === MAX_FLOOR_NUM)
            nextFloor.visible = false;

        /* Inventory Button */
        // if (this.characterState.getInventory().getBasicAttack() != null){  // Final Project TODO: After setting basicAttack in Character Select instead of BattleRoom, remove if statement
        const inventory = <Button>this.add.uiElement(UIElementType.BUTTON, "map", {position: new Vec2(center.x-575, center.y+400), text: "View Inventory"});
        inventory.size.set(250, 50);
        inventory.borderWidth = 2;
        inventory.borderColor = Color.WHITE;
        inventory.backgroundColor = new Color(50, 50, 70, 1);
        inventory.onClickEventId = "inventory";
        inventory.font = "Merriweather";
        inventory.fontSize = 30;
        // }

        /* Quit Button */
        const quit = <Button>this.add.uiElement(UIElementType.BUTTON, "map", {position: new Vec2(center.x + 600, center.y+400), text: "Quit"});
        quit.size.set(200, 50);
        quit.borderWidth = 2;
        quit.borderColor = Color.WHITE;
        quit.backgroundColor = new Color(50, 50, 70, 1);
        quit.onClickEventId = "quit";
        quit.font = "Merriweather";
        quit.fontSize = 30;

        /* Quit Confirmation Label */
        const quitConfirmation = <Label>this.add.uiElement(UIElementType.LABEL, "quitConfirmation", {position: new Vec2(center.x, center.y), text:""});
        quitConfirmation.size.set(500, 325);
        quitConfirmation.borderColor = PancakeColor.PINK;
        quitConfirmation.backgroundColor = PancakeColor.MAGENTA;
        quitConfirmation.visible = false;

        const areYouSure = <Label>this.add.uiElement(UIElementType.LABEL, "quitConfirmation", {position: new Vec2(center.x, center.y-100), text:"Are you sure you want to quit?"});
        areYouSure.fontSize = 30;
        areYouSure.textColor = PancakeColor.BEIGE;
        areYouSure.font = "Merriweather";
        areYouSure.visible = false;

        const progress = <Label>this.add.uiElement(UIElementType.LABEL, "quitConfirmation", {position: new Vec2(center.x, center.y-60), text:"(Progress won't be saved)"});
        progress.fontSize = 22;
        progress.textColor = PancakeColor.BEIGE;
        progress.font = "Merriweather";
        progress.visible = false;
        
        const yesQuit = <Button>this.add.uiElement(UIElementType.BUTTON, "quitConfirmation", {position: new Vec2(center.x-125, center.y+100), text: "Yes"});
        yesQuit.size.set(200, 50);
        yesQuit.borderWidth = 2;
        yesQuit.borderColor = Color.WHITE;
        yesQuit.backgroundColor = new Color(50, 50, 70, 1);
        yesQuit.onClickEventId = "yesQuit";
        yesQuit.font = "Merriweather";
        yesQuit.fontSize = 30;
        yesQuit.visible = false;

        const noQuit = <Button>this.add.uiElement(UIElementType.BUTTON, "quitConfirmation", {position: new Vec2(center.x+125, center.y+100), text: "No"});
        noQuit.size.set(200, 50);
        noQuit.borderWidth = 2;
        noQuit.borderColor = Color.WHITE;
        noQuit.backgroundColor = new Color(50, 50, 70, 1);
        noQuit.onClickEventId = "noQuit";
        noQuit.font = "Merriweather";
        noQuit.fontSize = 30;
        noQuit.visible = false;

        this.quitConfirmation.push(quitConfirmation);
        this.quitConfirmation.push(areYouSure);
        this.quitConfirmation.push(progress);
        this.quitConfirmation.push(yesQuit);
        this.quitConfirmation.push(noQuit);

        /* Current Floor Label */
        const currentFloor = <Label>this.add.uiElement(UIElementType.LABEL, "map", {position: new Vec2(center.x, center.y-265), text: floor_names[this.characterState.mapState.currentFloor-1]});
        currentFloor.textColor = PancakeColor.MAGENTA;
        currentFloor.fontSize = 40;
        currentFloor.font = "PixelSimple";

        /* Start Text */
        const start = <Label>this.add.uiElement(UIElementType.LABEL, "map", {position: new Vec2(center.x-460, center.y-220), text: "Start"});
        start.textColor = PancakeColor.MAGENTA;
        start.fontSize = 21;
        start.font = "PixelSimple";

        /* End Text */
        const end = <Label>this.add.uiElement(UIElementType.LABEL, "map", {position: new Vec2(center.x+442, center.y-220), text: "Finish"});
        end.textColor = PancakeColor.MAGENTA;
        end.fontSize = 22;
        end.font = "PixelSimple";

        // healthbar
        /* Healthbar and Healthbar Border*/
        this.addLayer("health", 11);
        let multiplier = this.characterState.stats.maxHealth/100;
        let health = this.add.graphic(GraphicType.RECT, "health", {position: new Vec2(330+this.characterState.stats.health, 66), size: new Vec2((this.characterState.stats.health*6)/multiplier, 30)});
        health.position = new Vec2(125+(this.characterState.stats.health*3)/multiplier, 66);
        let healthbarborder = this.add.sprite("healthbarborder", "primary");
        healthbarborder.position = new Vec2(437, 48);
        this.sceneObjects.push(health);
        this.sceneObjects.push(healthbarborder);
        
        /* Sprite for character portrait */
        let portrait = this.add.sprite("portrait", "primary");
        portrait.position = new Vec2(62, 45);
        this.sceneObjects.push(portrait);

        /* Sprite for portrait border */
        let portraitborder = this.add.sprite("portraitborder", "primary");
        portraitborder.position = new Vec2(62, 45);
        this.sceneObjects.push(portraitborder);

        /* Sprite for map */
        let mapBackground = this.add.sprite("mapBackground", "primary");
        mapBackground.position = new Vec2(center.x, center.y);
        this.sceneObjects.push(mapBackground);

        /* Subscribe to the button events */
        this.receiver.subscribe("inventory");
        this.receiver.subscribe("quit");
        this.receiver.subscribe("nextfloor");
        this.receiver.subscribe("yesQuit");
        this.receiver.subscribe("noQuit");

        UITweens.fadeInScene(this.sceneObjects);
    }
    updateScene(){
        if (Input.isJustPressed("escape")){
            if (this.quitLabelVisible == true){
                this.quitLabelVisible = false;
                for(let i=0 ; i < this.quitConfirmation.length ; i++)
                    this.quitConfirmation[i].visible = false;
            }
            else{
                this.quitLabelVisible = true;
                for(let i=0 ; i < this.quitConfirmation.length ; i++)
                    this.quitConfirmation[i].visible = true;
            }
        }
        
        const LAST_ROOM_COL = 6;

        while(this.receiver.hasNextEvent()){
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "click"});
            let event = this.receiver.getNextEvent();

            if(event.type === "inventory")
                this.sceneManager.changeToScene(InventoryScene, {characterState: this.characterState});
            
            if(event.type === "quit"){
                this.quitLabelVisible = true;
                for(let i=0 ; i < this.quitConfirmation.length ; i++)
                    this.quitConfirmation[i].visible = true;
            }

            if(event.type === "noQuit"){
                this.quitLabelVisible = false;
                for(let i=0 ; i < this.quitConfirmation.length ; i++)
                    this.quitConfirmation[i].visible = false;
            }

            if(event.type === "yesQuit"){
                this.mapState.resetMap();
                this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level" + this.characterState.mapState.currentFloor + "music"});
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "mainmenu_music", loop:"true", holdReference: true});
                this.sceneManager.changeToScene(MainMenu, {});
            }

            /* Move To Next Floor */
            if(event.type === "nextfloor"){
                if(this.mapState.nextFloorOpen){
                    this.mapState.nextFloor();
                    this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level" + (this.characterState.mapState.currentFloor-1) + "music"});
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level" + this.characterState.mapState.currentFloor +"music", loop:"true", holdReference: true});

                    /* If next room is boss room load it, otherwise load next floor as normal */
                    (this.mapState.currentFloor === 7)?(this.sceneManager.changeToScene(BattleRoom, {characterState: this.characterState})):(this.sceneManager.changeToScene(ItemSelectScene, {characterState: this.characterState, specialItems: true}));
                }
            }

            /* Showing completion of rooms */
            if(event.type.substring(0, 4) === "room" && !this.quitLabelVisible){
                for(let i=0 ; i < this.roomButtons.length ; i++)
                    for(let j=0 ; j < this.roomButtons[i].length ; j++){
                        let buttonColor = this.roomButtons[i][j].backgroundColor.toString()
                        if(this.roomButtons[i][j].onClickEventId === event.type && (buttonColor === PancakeColor.LIGHT_GRAY.toString() || 
                            buttonColor === PancakeColor.colorFromIndex(19).toString())){ // shrine room
                            this.roomButtons[i][j].backgroundColor = PancakeColor.GREEN;

                            /* Turn next1 node grey, check for room type */
                            if(this.roomArray[i][j].next1 !== null && this.roomArray[i][j].next1.roomType !== RoomTypes.BOSS_ROOM){
                                let roomIndex = this.findRoomRowCol(this.roomArray, this.roomArray[i][j].next1.roomNum);
                                if(roomIndex !== null && this.roomButtons[roomIndex.x][roomIndex.y].backgroundColor.toString() !== PancakeColor.GREEN.toString())
                                    if(this.roomArray[i][j].next1 !== null && this.roomArray[i][j].next1.roomType === RoomTypes.SHRINE_ROOM){
                                        this.roomButtons[roomIndex.x][roomIndex.y].backgroundColor = PancakeColor.colorFromIndex(19);
                                    }    
                                    else{
                                        this.roomButtons[roomIndex.x][roomIndex.y].backgroundColor = PancakeColor.LIGHT_GRAY;
                                    }
                            }
                            /* Turn next2 node grey, check for room type */
                            if(this.roomArray[i][j].next2 !== null && this.roomArray[i][j].next2.roomType !== RoomTypes.BOSS_ROOM){
                                let roomIndex = this.findRoomRowCol(this.roomArray, this.roomArray[i][j].next2.roomNum);
                                if(roomIndex !== null && this.roomButtons[roomIndex.x][roomIndex.y].backgroundColor.toString() !== PancakeColor.GREEN.toString())
                                    if (this.roomArray[i][j].next2.roomType === RoomTypes.SHRINE_ROOM){
                                        this.roomButtons[roomIndex.x][roomIndex.y].backgroundColor = PancakeColor.colorFromIndex(19);
                                    }   
                                    else{
                                        this.roomButtons[roomIndex.x][roomIndex.y].backgroundColor = PancakeColor.LIGHT_GRAY;
                                    }
                            }

                            /* Make other rooms in this column unavailable */
                            for(let k=0 ; k < this.roomButtons[i].length ; k++)
                                if(k !== j)
                                    this.roomButtons[i][k].backgroundColor = new Color(91, 95, 99);


                            /* Check if this is a glitched room with no neighbors. If it is, set whole next column as available */
                            if(this.roomArray[i][j].next1.roomType !== RoomTypes.BOSS_ROOM){
                                let nextRoomAvailable = false;
                                for(let k=0 ; k < this.roomArray[i+1].length ; k++)
                                    if(this.roomButtons[i+1][k].backgroundColor.toString() === PancakeColor.LIGHT_GRAY.toString() ||
                                        this.roomButtons[i+1][k].backgroundColor.toString() === PancakeColor.colorFromIndex(19).toString())
                                        nextRoomAvailable = true;

                                if(!nextRoomAvailable){
                                    for(let k=0 ; k < this.roomArray[i+1].length ; k++)
                                        this.roomButtons[i+1][k].backgroundColor = PancakeColor.LIGHT_GRAY;
                                }
                            }
                            
                            /* Save button colors and load into the battle scene */
                            this.mapState.savedButtons = this.roomButtons;
                            if (buttonColor == PancakeColor.colorFromIndex(19).toString()){  // Final Project TODO - change scene to shrine room
                                // console.log("Shrine Room")
                                this.sceneManager.changeToScene(BattleRoom, {characterState: this.characterState, shrineRoom: "shrine"});

                            }
                            else if (buttonColor == PancakeColor.LIGHT_GRAY.toString()){
                                this.sceneManager.changeToScene(BattleRoom, {characterState: this.characterState});
                            }
                        }
                    }
                
                /* Enable Next Floor Button */
                if(parseInt(event.type.substring(4,5)) === LAST_ROOM_COL)
                    this.mapState.nextFloorOpen = true;       
            }
        }
        /* Skip Floor buttons pressed */
        if(HelpScreen.roomSkipping){
            const NUM_FLOORS = 6;
            for(let i=1 ; i <= NUM_FLOORS ; i++)
                if(Input.isJustPressed("floor"+i)){
                    if(this.characterState.mapState.currentFloor !== i){
                        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level" + (this.characterState.mapState.currentFloor) + "music"});
                        this.characterState.mapState.currentFloor = i;
                        this.characterState.mapState.resetMap();
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level" + this.characterState.mapState.currentFloor +"music", loop:"true", holdReference: true});
                        this.sceneManager.changeToScene(MapScene, {characterState: this.characterState});
                    }
                }
            
            /* Boss Room */
            if(Input.isJustPressed("floor7")){
                this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level" + (this.characterState.mapState.currentFloor) + "music"});
                this.characterState.mapState.currentFloor = 7;
                this.characterState.mapState.resetMap();
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level" + this.characterState.mapState.currentFloor +"music", loop:"true", holdReference: true});
                this.sceneManager.changeToScene(BattleRoom, {characterState: this.characterState})
            }
        }
    }

    // generates room buttons with icons on the map
    renderMap(floor: Floor): void {
        this.roomArray = floor.roomArray;
        for(let i = 0; i < floor.roomArray.length; i++){
            for(let j = 0; j < floor.roomArray[i].length; j++){
                var position = new Vec2(i*150 + 350 - 20*Math.random(), j*90 + 300 - 20*Math.random())
                let room = <Button>this.add.uiElement(UIElementType.BUTTON, "rooms" , 
                {position: position, text: ""});

                let icon = "";
                (floor.roomArray[i][j].roomType === RoomTypes.SHRINE_ROOM)?(icon = "shrineIcon"):(icon = "battleIcon");
                let levelimage = this.add.sprite(icon, "rooms"); // draw battle icon as a placeholder until more kinds of rooms are added
                levelimage.position.set(position.x, position.y);
                levelimage.size.set(64, 64)
                this.sceneObjects.push(levelimage);

                // room.position = new Vec2(i*12 + 3 - 6*Math.random(), j*14 + 3 + 3.5 - 7*Math.random());
                room.borderWidth = 1;
                room.borderColor = PancakeColor.colorFromIndex(6);
                room.backgroundColor = PancakeColor.SAND;
                room.size.set(64,64);
                floor.roomArray[i][j].position = position
                
                /* Add On-Click Events to each room */
                room.onClickEventId = "room" + i+j;
                this.receiver.subscribe("room" + i+j);
                this.roomButtons[i][j] = room;

                /* Sets first column of rooms as available */
                if(i === 0){
                    if (floor.roomArray[i][j].roomType == RoomTypes.SHRINE_ROOM){
                        room.backgroundColor = PancakeColor.colorFromIndex(19);
                    }
                    else{
                        room.backgroundColor = PancakeColor.LIGHT_GRAY;
                    }
                }
            }
        }

        // generating the lines
        for(let i = 0; i < floor.roomArray.length; i++){
            for(let j = 0; j < floor.roomArray[i].length; j++){
                if (floor.roomArray[i][j].next1 != null){  // check if next1 is null
                    if (floor.roomArray[i][j].next1.position != null){  // check if the position is null
                        let line = <Line>this.add.graphic(GraphicType.LINE, "map", {start: floor.roomArray[i][j].position, end: floor.roomArray[i][j].next1.position});
                        line.color = new Color(133, 90, 80);
                    }
                }
                if (floor.roomArray[i][j].next2 != null){  // check if next2 is null
                    if (floor.roomArray[i][j].next2.position != null){  // check if position is null
                        let line2 = <Line>this.add.graphic(GraphicType.LINE, "map", {start: floor.roomArray[i][j].position, end: floor.roomArray[i][j].next2.position});
                        line2.color = new Color(133, 90, 80);
                    }
                }
            }
        }
    }

    findRoomRowCol(roomsArray:Array<Array<Room>>, roomToFind:number): Vec2{
        for(let i=0 ; i < roomsArray.length ; i++)
            for(let j=0 ; j < roomsArray[i].length ; j++)
                if(roomsArray[i][j].roomNum === roomToFind)
                    return new Vec2(i, j);
        return null;
    }
}