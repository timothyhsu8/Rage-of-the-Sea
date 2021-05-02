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

export default class MapScene extends Scene{
    private sceneObjects: Array<GameNode>;

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
        //this.load.image("portrait", "hw3_assets/sprites/healthUI/" + this.characterState.portrait + ".png");
    }

    startScene(){
        const floor_names = ["Floor 1: Engine Room", "Floor 2: Casino", "Floor 3: Dining Hall", "Floor 4", "Floor 5", "Floor 6"];
        const MAX_FLOOR_NUM = 6;
        const center = this.viewport.getCenter();

        this.sceneObjects = new Array<GameNode>();

        /* Background Artwork */
        this.addLayer("background", 1);
        let backgroundart = this.add.sprite("defaultbackground", "background");
        backgroundart.position.set(center.x, center.y);

        // The main menu
        this.addUILayer("map");
        this.addUILayer("rooms");
        this.addUILayer("floortext");
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

        const nextFloor = <Button>this.add.uiElement(UIElementType.BUTTON, "map", {position: new Vec2(center.x, center.y+400), text: "Next Floor"});
        this.nextFloorButton = nextFloor;  
        nextFloor.size.set(250, 50);
        nextFloor.borderWidth = 2;
        nextFloor.borderColor = Color.WHITE;
        nextFloor.onClickEventId = "nextfloor";
        nextFloor.fontSize = 30;
        nextFloor.font = "Merriweather";
        (HelpScreen.roomSkipping || this.mapState.nextFloorOpen)?(nextFloor.backgroundColor = PancakeColor.GREEN):(nextFloor.backgroundColor = Color.TRANSPARENT);

        /* Disables 'Next Floor' button on the last  floor */
        if(this.mapState.currentFloor === MAX_FLOOR_NUM)
            nextFloor.visible = false;

        const inventory = <Button>this.add.uiElement(UIElementType.BUTTON, "map", {position: new Vec2(center.x-575, center.y+400), text: "View Inventory"});
        inventory.size.set(250, 50);
        inventory.borderWidth = 2;
        inventory.borderColor = Color.WHITE;
        inventory.backgroundColor = new Color(50, 50, 70, 1);
        inventory.onClickEventId = "inventory";
        inventory.font = "Merriweather";
        inventory.fontSize = 30;

        const quit = <Button>this.add.uiElement(UIElementType.BUTTON, "map", {position: new Vec2(center.x + 600, center.y+400), text: "Quit"});
        quit.size.set(200, 50);
        quit.borderWidth = 2;
        quit.borderColor = Color.WHITE;
        quit.backgroundColor = new Color(50, 50, 70, 1);
        quit.onClickEventId = "quit";
        quit.font = "Merriweather";
        quit.fontSize = 30;

        const currentFloor = <Label>this.add.uiElement(UIElementType.LABEL, "map", {position: new Vec2(center.x, center.y-265), text: floor_names[this.characterState.mapState.currentFloor-1]});
        currentFloor.textColor = PancakeColor.MAGENTA;
        currentFloor.fontSize = 40;
        currentFloor.font = "PixelSimple";

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

        let mapBackground = this.add.sprite("mapBackground", "primary");
        mapBackground.position = new Vec2(center.x, center.y);
        this.sceneObjects.push(mapBackground);

        /* Subscribe to the button events */
        this.receiver.subscribe("play");
        this.receiver.subscribe("inventory");
        this.receiver.subscribe("quit");
        this.receiver.subscribe("nextfloor");

        UITweens.fadeInScene(this.sceneObjects);
    }
    updateScene(){
        const LAST_ROOM_COL = 6;

        while(this.receiver.hasNextEvent()){
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "click"});
            let event = this.receiver.getNextEvent();

            if(event.type === "play"){
                this.sceneManager.changeToScene(BattleRoom, {characterState: this.characterState});
            }

            if(event.type === "inventory")
                this.sceneManager.changeToScene(InventoryScene, {characterState: this.characterState});
            
            if(event.type === "quit"){
                this.mapState.resetMap();
                this.sceneManager.changeToScene(MainMenu, {});
            }

            /* Move To Next Floor */
            if(event.type === "nextfloor"){
                if(this.mapState.nextFloorOpen){
                    this.mapState.nextFloor();
                    this.sceneManager.changeToScene(MapScene, {characterState: this.characterState});
                }
            }

            /* Showing completion of rooms */
            if(event.type.substring(0, 4) === "room"){
                for(let i=0 ; i < this.roomButtons.length ; i++)
                    for(let j=0 ; j < this.roomButtons[i].length ; j++)
                        if(this.roomButtons[i][j].onClickEventId === event.type && this.roomButtons[i][j].backgroundColor.toString() === PancakeColor.LIGHT_GRAY.toString()){
                            this.roomButtons[i][j].backgroundColor = PancakeColor.GREEN;

                            /* Turn next1 node grey */  // FINAL PROJECT TODO - Fix this to work with the boss room
                            if(this.roomArray[i][j].next1 !== null && this.roomArray[i][j].next1.roomType !== RoomTypes.BOSS_ROOM){
                                let roomIndex = this.findRoomRowCol(this.roomArray, this.roomArray[i][j].next1.roomNum);
                                if(roomIndex !== null && this.roomButtons[roomIndex.x][roomIndex.y].backgroundColor.toString() !== PancakeColor.GREEN.toString())
                                    this.roomButtons[roomIndex.x][roomIndex.y].backgroundColor = PancakeColor.LIGHT_GRAY;
                            }
                            /* Turn next2 node grey */
                            if(this.roomArray[i][j].next2 !== null && this.roomArray[i][j].next2.roomType !== RoomTypes.BOSS_ROOM){
                                let roomIndex = this.findRoomRowCol(this.roomArray, this.roomArray[i][j].next2.roomNum);
                                if(roomIndex !== null && this.roomButtons[roomIndex.x][roomIndex.y].backgroundColor.toString() !== PancakeColor.GREEN.toString())
                                    this.roomButtons[roomIndex.x][roomIndex.y].backgroundColor = PancakeColor.LIGHT_GRAY;
                            }
                            /* Save button colors and load into the battle scene */
                            this.mapState.savedButtons = this.roomButtons;
                            this.sceneManager.changeToScene(BattleRoom, {characterState: this.characterState, roomButtons: this.roomButtons, roomArray:this.roomArray});
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
                        this.characterState.mapState.currentFloor = i;
                        this.characterState.mapState.resetMap();
                        this.sceneManager.changeToScene(MapScene, {characterState: this.characterState});
                    }
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
                {position: position, text: ""}) ;
                let levelimage = this.add.sprite("battleIcon", "rooms"); // draw battle icon as a placeholder until more kinds of rooms are added
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
                if(i === 0)
                    room.backgroundColor = PancakeColor.LIGHT_GRAY;
            }
        }

        // generating the lines
        for(let i = 0; i < floor.roomArray.length; i++){
            for(let j = 0; j < floor.roomArray[i].length; j++){
                if (floor.roomArray[i][j].next1 != null){  // check if next1 is null
                    if (floor.roomArray[i][j].next1.position != null){  // check if the position is null
                        let line = <Line>this.add.graphic(GraphicType.LINE, "rooms", {start: floor.roomArray[i][j].position, end: floor.roomArray[i][j].next1.position});
                        line.color = Color.WHITE;
                    }
                }
                if (floor.roomArray[i][j].next2 != null){  // check if next2 is null
                    if (floor.roomArray[i][j].next2.position != null){  // check if position is null
                        let line2 = <Line>this.add.graphic(GraphicType.LINE, "rooms", {start: floor.roomArray[i][j].position, end: floor.roomArray[i][j].next2.position});
                        line2.color = Color.WHITE;
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