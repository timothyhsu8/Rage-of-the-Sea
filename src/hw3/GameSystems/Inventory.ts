import Ability from "./items/Ability";
import Item from "./items/Item";
import Scene from "../../Wolfie2D/Scene/Scene";

export default class Inventory{

    private basicAttack: Ability; 
    private items: Array<Item>;
    private currentSize: number;
    private currentItem: number;

    constructor(scene: Scene, inventorySize: number){
        this.currentItem = 0;
        this.currentSize = 0;
        this.items = new Array<Item>(inventorySize);
    }

    getItems(): Array<Item>{
        return this.items;
    }

    isEmpty(): boolean{
        if(this.currentSize === 0)
            return true;
        return false;
    }

    setBasicAttack(ability: Ability): void{
        this.basicAttack = ability;
    }

    getBasicAttack(): Ability{
        return this.basicAttack;
    }

    getItem(): Item{
        return this.items[this.currentItem];
    }

    addItem(item: Item): void{
        if(this.currentSize < this.items.length){
            this.items[this.currentSize] = item;
            this.currentSize++;
        }
    }
}