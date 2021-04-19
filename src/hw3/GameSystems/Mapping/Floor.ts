import UIElement from "../../../Wolfie2D/Nodes/UIElement";
import Button from "../../../Wolfie2D/Nodes/UIElements/Button";
import Room from "./Room";

export default class Floor {
    // floors hold the graph of rooms and their connections
    roomArray: Array<Array<Room>>;

    constructor(){
        this.roomArray = [];
    }

}