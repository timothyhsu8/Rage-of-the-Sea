import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import floor1_scene from "./floor1_scene";
import CharacterState from "../CharacterState";
import InventoryScene from "./MenuScenes/InventoryScene";
import MainMenu from "./MenuScenes/MainMenu";
import PancakeColor from "../../Wolfie2D/Utils/PancakeColor";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Floor from "../GameSystems/Mapping/Floor";
import MapGenerator from "../GameSystems/MapGenerator";
import Line from "../../Wolfie2D/Nodes/Graphics/Line";
import Room from "../GameSystems/Mapping/Room";
import { RoomTypes } from "../GameSystems/Mapping/RoomType_Enums";

export default class MapScene extends Scene{
        
    private characterState: CharacterState; // All data of the character goes here
    private roomArray: Array<Array<Room>>;
    private roomButtons: Array<Array<Button>>;

    static savedButtons: Array<Array<Button>>;
    static savedFloor: Floor;
    
    initScene(init: Record<string, any>): void {
        this.characterState = init.characterState;
    }

    loadScene(){
        this.load.image("portrait", "hw3_assets/sprites/healthUI/" + this.characterState.portrait + ".png");
        this.load.image("battleIcon", "hw3_assets/sprites/map/battleicon.png");
        this.load.image("portrait", "hw3_assets/sprites/healthUI/diverportrait.png");
        this.load.image("portraitborder", "hw3_assets/sprites/healthUI/portraitborder.png");
        this.load.image("healthbarborder", "hw3_assets/sprites/healthUI/healthbarborder.png");
        this.load.image("mapBackground", "hw3_assets/sprites/map/map.png");
    }

    startScene(){
        this.addLayer("primary", 10);
        const center = this.viewport.getCenter();

        // The main menu
        this.addUILayer("map");
        this.addUILayer("rooms");

        /* Generate map or load the saved one */
        let generatedFloor = null;
        if(MapScene.savedFloor === undefined){
            generatedFloor = MapGenerator.generateFloor(0);
            MapScene.savedFloor = generatedFloor;
        }
        else generatedFloor = MapScene.savedFloor;

        /* Initialize Buttons Array */
        this.roomButtons = new Array<Array<Button>>(generatedFloor.roomArray.length);
        for(let i=0; i < generatedFloor.roomArray.length; i++)
            this.roomButtons[i] = new Array<Button>(generatedFloor.roomArray[i].length);
    
        // render map
        this.renderMap(generatedFloor);

        /* Load saved button colors */
        if(MapScene.savedButtons !== undefined){
            for(let i=0 ; i<this.roomButtons.length ; i++)
                for(let j=0 ; j<this.roomButtons[i].length ; j++)
                    this.roomButtons[i][j].backgroundColor = MapScene.savedButtons[i][j].backgroundColor;
        }
        
        const inventory = <Button>this.add.uiElement(UIElementType.BUTTON, "map", {position: new Vec2(center.x-200, center.y+400), text: "View Inventory"});
        inventory.size.set(250, 50);
        inventory.borderWidth = 2;
        inventory.borderColor = Color.WHITE;
        inventory.backgroundColor = new Color(50, 50, 70, 1);
        inventory.onClickEventId = "inventory";
        inventory.fontSize = 35;

        const quit = <Button>this.add.uiElement(UIElementType.BUTTON, "map", {position: new Vec2(center.x + 200, center.y+400), text: "Quit"});
        quit.size.set(200, 50);
        quit.borderWidth = 2;
        quit.borderColor = Color.WHITE;
        quit.backgroundColor = new Color(50, 50, 70, 1);
        quit.onClickEventId = "quit";
        quit.fontSize = 35;

        // healthbar
        /* Healthbar and Healthbar Border*/
        this.addLayer("health", 11);
        let health = this.add.graphic(GraphicType.RECT, "health", {position: new Vec2(330+this.characterState.stats.health, 66), size: new Vec2(this.characterState.stats.health*6 , 30)});
        health.position = new Vec2(125+(this.characterState.stats.health*3), 66);
        let healthbarborder = this.add.sprite("healthbarborder", "primary");
        healthbarborder.position = new Vec2(437, 48);
        
        /* Sprite for character portrait */
        let portrait = this.add.sprite("portrait", "primary");
        portrait.position = new Vec2(62, 45);

        /* Sprite for portrait border */
        let portraitborder = this.add.sprite("portraitborder", "primary");
        portraitborder.position = new Vec2(62, 45);

        // // placeholder for map screen composition
        // const map_render = <Label>this.add.uiElement(UIElementType.LABEL, "map", {position: new Vec2(center.x, center.y), text: "placeholder"})
        // map_render.size.set(1280, 640);
        // map_render.borderWidth = 4;
        // map_render.borderColor = Color.WHITE;
        // map_render.backgroundColor = PancakeColor.TAN;
        // map_render.fontSize = 35;

        let mapBackground = this.add.sprite("mapBackground", "primary");
        mapBackground.position = new Vec2(center.x, center.y);

        /* Subscribe to the button events */
        this.receiver.subscribe("play");
        this.receiver.subscribe("inventory");
        this.receiver.subscribe("quit");
    }
    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            if(event.type === "play")
                this.sceneManager.changeToScene(floor1_scene, {characterState: this.characterState});

            if(event.type === "inventory")
                this.sceneManager.changeToScene(InventoryScene, {characterState: this.characterState});
            
            if(event.type === "quit"){
                MapScene.savedButtons = undefined;
                MapScene.savedFloor = undefined;
                this.sceneManager.changeToScene(MainMenu, {});
            }

            /* Changing colors of nodes */
            if(event.type.substring(0, 4) === "room"){
                for(let i=0 ; i < this.roomButtons.length ; i++)
                    for(let j=0 ; j < this.roomButtons[i].length ; j++)
                        if(this.roomButtons[i][j].onClickEventId === event.type && this.roomButtons[i][j].backgroundColor.toString() === PancakeColor.LIGHT_GRAY.toString()){
                            this.roomButtons[i][j].backgroundColor = PancakeColor.GREEN;

                            /* Turn next1 node grey */  // FINAL PROJECT TODO - Fix this to work with the boss room
                            if(this.roomArray[i][j].next1 !== null && this.roomArray[i][j].next1.roomType !== RoomTypes.BOSS_ROOM){
                                let roomIndex = this.findRoomRowCol(this.roomArray, this.roomArray[i][j].next1.roomNum);
                                if(this.roomButtons[roomIndex.x][roomIndex.y].backgroundColor.toString() !== PancakeColor.GREEN.toString())
                                    this.roomButtons[roomIndex.x][roomIndex.y].backgroundColor = PancakeColor.LIGHT_GRAY;
                            }
                            /* Turn next2 node grey */
                            if(this.roomArray[i][j].next2 !== null && this.roomArray[i][j].next2.roomType !== RoomTypes.BOSS_ROOM){
                                let roomIndex = this.findRoomRowCol(this.roomArray, this.roomArray[i][j].next2.roomNum);
                                if(this.roomButtons[roomIndex.x][roomIndex.y].backgroundColor.toString() !== PancakeColor.GREEN.toString())
                                    this.roomButtons[roomIndex.x][roomIndex.y].backgroundColor = PancakeColor.LIGHT_GRAY;
                            }
                            /* Save button colors and load into the battle scene */
                            MapScene.savedButtons = this.roomButtons;
                            this.sceneManager.changeToScene(floor1_scene, {characterState: this.characterState, roomButtons: this.roomButtons, roomArray:this.roomArray});
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