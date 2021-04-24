import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Floor from "./Mapping/Floor";

export default class MapState{
    currentFloor: number;
    savedButtons: Array<Array<Button>>;
    savedFloor: Floor;
    nextFloorOpen: boolean;

    constructor(currentFloor: number){
        this.currentFloor = currentFloor;
        this.savedButtons = undefined;
        this.savedFloor = undefined;
        this.nextFloorOpen = false;
    }

    nextFloor(){
        this.currentFloor++;
        this.resetMap();
    }

    resetMap(){
        this.savedButtons = undefined;
        this.savedFloor = undefined;
        this.nextFloorOpen = false;
    }
}