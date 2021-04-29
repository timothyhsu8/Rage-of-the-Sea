import Inventory from "./GameSystems/Inventory";
import Item, { ItemType } from "./GameSystems/items/Item";
import MapState from "./GameSystems/MapState";
import Stats from "./Stats";

/* Holds all data for the character between rooms. Pass this class into floor scenes */
export default class CharacterState{
    portrait: string;
    itemRotation: number;   // Keeps track of when player can receieve an item. Receives an item when this reaches 3
    stats: Stats;
    mapState: MapState;
    
    private inventory: Inventory;   // Private to prevent direct changes to the inventory. Use the methods in this class

    constructor(maxHealth: number, attack: number, defense: number, speed:number, inventory: Inventory, portrait: string, currentFloor: number){
        this.stats = new Stats(maxHealth, maxHealth, attack, 1.0, defense, speed, 1.0);
        this.portrait = portrait;
        this.inventory = inventory;
        this.itemRotation = 0;
        this.mapState = new MapState(currentFloor);
    }

    /* Adds item to inventory */
    addToInventory(itemtype: ItemType){
        if(itemtype !== ItemType.NONE){
            let newItem = Item.createItem(itemtype);
            this.addItemStats(newItem);
            this.inventory.addItem(newItem);
        }
    }

    /* Adds item stats to player stats */
    addItemStats(item: Item){
        this.stats.attack += item.stats.attack;
        this.stats.defense += item.stats.defense;
        this.stats.speed += item.stats.speed;
        (this.stats.health + item.stats.health > this.stats.maxHealth)?(this.stats.health = this.stats.maxHealth):(this.stats.health += item.stats.health);

        if(this.stats.attackMult < item.stats.attackMult)
            this.stats.attackMult = item.stats.attackMult;
        
        if(this.stats.takeDamageMult < item.stats.takeDamageMult || (item.stats.takeDamageMult !== 0 && this.stats.takeDamageMult === 1.0))
            this.stats.takeDamageMult = item.stats.takeDamageMult;
    }

    getInventory(){
        return this.inventory;
    }

}