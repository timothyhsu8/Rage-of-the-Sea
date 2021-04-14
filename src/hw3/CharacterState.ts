import Inventory from "./GameSystems/Inventory";

/* Holds all data for the character between rooms. Pass this class into floor scenes */
export default class CharacterState{
    private health: number;
    private attack: number;
    private defense: number;
    private speed: number;
    private inventory: Inventory;

    constructor(health: number, attack: number, defense: number, speed:number, inventory: Inventory){
        this.health = health;
        this.attack = attack;
        this.defense = defense;
        this.speed = speed;
        this.inventory = inventory;
    }

    getHealth(): number{
        return this.health;
    }
    setHealth(health: number): void{
        this.health = health;
    }
    getAttack(): number{
        return this.attack;
    }
    setAttack(attack: number): void{
        this.attack = attack;
    }
    getDefense(): number{
        return this.defense;
    }
    setDefense(defense: number): void{
        this.defense = defense;
    }
    getSpeed(): number{
        return this.speed;
    }
    setSpeed(speed: number): void{
        this.speed = speed;
    }
    getInventory(): Inventory{
        return this.inventory;
    }
    setInventory(inventory: Inventory): void{
        this.inventory = inventory;
    }

}