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
    addToInventory(itemChoice: any){
        if(itemChoice.key !== "none"){
            let newItem = new Item(itemChoice.name, itemChoice.key, itemChoice.ability, itemChoice.maxHealth, itemChoice.health, itemChoice.attack,
                itemChoice.attackMult, itemChoice.defense, itemChoice.speed, itemChoice.takeDamageMult, itemChoice.description, itemChoice.stats, itemChoice.rarity);
            this.addItemStats(newItem);
            this.inventory.addItem(newItem);
        }
    }

    /* Adds item stats to player stats */
    addItemStats(item: Item){
        this.stats.attack += item.stats.attack;
        this.stats.defense += item.stats.defense;
        
        
        /* Speed (Doesn't exceed 110) */
        (this.stats.speed+item.stats.speed >= 108)?(this.stats.speed = 108):(this.stats.speed += item.stats.speed);

        this.stats.maxHealth += item.stats.maxHealth;
        this.healPlayer(item.stats.maxHealth);

        /* Healing (Doesn't exceed maxHealth) */
        this.healPlayer(item.stats.health);

        /* Attack Multiplier */
        if(this.stats.attackMult < item.stats.attackMult)
            this.stats.attackMult = item.stats.attackMult;
        
        /* Take Damage Multiplier */
        if(item.stats.takeDamageMult !== 0 && (item.stats.takeDamageMult < this.stats.takeDamageMult))
            this.stats.takeDamageMult = item.stats.takeDamageMult;
    }

    healPlayer(healthToAdd: number){
        (this.stats.health + healthToAdd > this.stats.maxHealth)?(this.stats.health = this.stats.maxHealth):(this.stats.health += healthToAdd);
    }

    getInventory(){
        return this.inventory;
    }

}