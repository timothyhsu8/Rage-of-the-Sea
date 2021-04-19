import Floor from "./Mapping/Floor"
import Room from "./Mapping/Room";
import { RoomTypes } from "./Mapping/RoomType_Enums"

// this class handles the generation of map paths
export default class MapGenerator {
    static floors: Array<Floor>; //the array that holds all generated floors
    static FLOOR_COUNT: number = 1; //number of floors in the game
    static FLOOR_LENGTHS: Array<number> = [8]; //number of levels in the graph

    static generateAllFloors(): void {
        return null;
    }

    static generateFloor(floorNum: number): Floor {
        let newFloor: Floor = new Floor();
        let count: number = 1;

        // add rooms to the floor map
        for (let i=0; i<(this.FLOOR_LENGTHS[floorNum] - 1); i++){
            let level: Array<Room> = [];
            for (let j=0; j<5; j++){
                level.push(
                    this.createRandomRoom(count++, i+1)
                );
            }
            newFloor.roomArray.push(level);
        }
        for(let i = 0; i < newFloor.roomArray[0].length; i++) {
            newFloor.roomArray[0][i].beConnected = true;
        }
        // add the boss room
        let level: Array<Room> = [];
        level.push(
            this.createBossRoom(count, this.FLOOR_LENGTHS[floorNum])
        );
        newFloor.roomArray.push(
            level
        );

        // build connections
        for (let i=0; i<this.FLOOR_LENGTHS[floorNum]-2; i++){
            let nodeConnected = {
                index: 0,
                connectedNodesNum: 0
            };
            for (let j=0; j < newFloor.roomArray[i].length; j++){
                if (!newFloor.roomArray[i][j].beConnected && i!=0) {
                    break;
                }
                if ((Math.random() <= 0.1 || nodeConnected.connectedNodesNum==2) && j!=0) {
                    nodeConnected.index++;
                    nodeConnected.connectedNodesNum = 0;
                } else {}

                if (Math.random() <= 0.45) {
                    newFloor.roomArray[i][j].next1 = newFloor.roomArray[i+1][nodeConnected.index];
                    if (newFloor.roomArray[i+1][nodeConnected.index]) {
                        newFloor.roomArray[i+1][nodeConnected.index].beConnected = true;
                    }
                    nodeConnected.index++;
                    if (nodeConnected.index > 4) {
                        break;
                    }
                    newFloor.roomArray[i][j].next2 = newFloor.roomArray[i+1][nodeConnected.index];
                    if (nodeConnected.index > 4) {
                        break;
                    }
                    newFloor.roomArray[i+1][nodeConnected.index].beConnected = true;
                    nodeConnected.connectedNodesNum = 1;
                } else {
                    newFloor.roomArray[i][j].next1 = newFloor.roomArray[i+1][nodeConnected.index];
                    nodeConnected.connectedNodesNum++;
                    if (nodeConnected.index > 4) {
                        break;
                    }
                    newFloor.roomArray[i+1][nodeConnected.index].beConnected = true;
                }
                if (newFloor.roomArray[i][j].next1) {
                    newFloor.roomArray[i][j].toConnect = true;
                }
            }
        }
        for (let i = 0; i < newFloor.roomArray[newFloor.roomArray.length-2].length; i++) {
            if (newFloor.roomArray[newFloor.roomArray.length-2][i].beConnected) {
                newFloor.roomArray[newFloor.roomArray.length-2][i].next1 = newFloor.roomArray[newFloor.roomArray.length-1][0];
                newFloor.roomArray[newFloor.roomArray.length-2][i].toConnect = true;
            }
        }

        // remove stragglers
        for (let i = 0; i < newFloor.roomArray.length; i++) {
            for (let j = 0; j < newFloor.roomArray[i].length; j++) {
                if (!newFloor.roomArray[i][j].beConnected || !newFloor.roomArray[i][j].toConnect) {
                    newFloor.roomArray[i].splice(j,1);
                    j--;
                }
            }
        }

        return newFloor;
    }

    static createRandomRoom(roomNum: number, level: number): Room {
        // TODO - add weights and random choice of room when
        // more room types are implemented
        return new Room(RoomTypes.BATTLE_ROOM, roomNum, level);
    }

    static createBossRoom(roomNum: number, level: number): Room {
        return new Room(RoomTypes.BOSS_ROOM, roomNum, level);
    }
}