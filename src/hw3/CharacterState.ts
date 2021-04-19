import Inventory from "./GameSystems/Inventory";
import Item, { ItemType } from "./GameSystems/items/Item";

/* Holds all data for the character between rooms. Pass this class into floor scenes */
export default class CharacterState{
    health: number;
    attack: number;
    attackMult: number;
    defense: number;
    speed: number;
    portrait: string;
    takeDamageMult: number;
    
    private inventory: Inventory;   // Private to prevent direct changes to the inventory. Use the methods in this class

    constructor(health: number, attack: number, defense: number, speed:number, inventory: Inventory, portrait: string){
        this.health = health;
        this.attack = attack;
        this.defense = defense;
        this.speed = speed;
        this.portrait = portrait;
        this.inventory = inventory;
        
        this.attackMult = 1.0;
        this.takeDamageMult = 1.0;
    }
    /* Adds item to inventory */
    addToInventory(itemtype: ItemType){
        let newItem = null;
        if(itemtype === ItemType.DOUBLE_EDGED_SWORD){ // FINAL PROJECT TODO - Planning to revamp the item adding system later, so don't add too much to this
            newItem = new Item("Double Edged Sword", itemtype, false, null, 0, 0, 2.0, 0, 0, 2.0);
        }

        if(itemtype === ItemType.NORMAL_BOOTS){
            newItem = new Item("Normal Boots", itemtype, false, null, 0, 0, 0, 0, 10, 0);
        }

        this.addItemStats(newItem);
        this.inventory.addItem(newItem);
    }

    addItemStats(item: Item){
        this.health += item.health;
        this.attack += item.attack;
        this.defense += item.defense;
        this.speed += item.speed;

        if(this.attackMult < item.attackMult)
            this.attackMult = item.attackMult;
        
        if(this.takeDamageMult < item.takeDamageMult)
            this.takeDamageMult = item.takeDamageMult;
    }

    getInventory(){
        return this.inventory;
    }

}