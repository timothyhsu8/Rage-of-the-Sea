import { RoomTypes } from "./RoomType_Enums";

export default class Room {
    roomType: RoomTypes;
    roomNum: number;
    next1: Room;
    next2: Room;
    level: number;
    beConnected: Boolean;
    toConnect: Boolean;

    constructor(roomType: RoomTypes, roomNum: number, level: number){
        this.roomType = roomType;
        this.roomNum = roomNum;
        this.next1 = null;
        this.next2 = null;
        this.level = level;
        this.beConnected = false;
        this.toConnect = false;
    }

    isRoomConnected(){
        if (this.next1 || this.next2) return true;
        else return false;
    }
}