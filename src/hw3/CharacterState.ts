import Inventory from "./GameSystems/Inventory";

/* Holds all data for the character between rooms. Pass this class into floor scenes */
export default class CharacterState{
    health: number;
    attack: number;
    attackMult: number;
    defense: number;
    speed: number;
    portrait: string;
    takeDamageMult: number;
    inventory: Inventory;

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
}