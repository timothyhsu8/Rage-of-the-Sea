import Ability from "./items/Ability";
import Item, { ItemType } from "./items/Item";
import Scene from "../../Wolfie2D/Scene/Scene";

export default class Inventory{
    private items: Array<Item>;
    basicAttack: Ability; 
    currentItem: number;

    constructor(scene: Scene){
        this.currentItem = 0;
        this.items = new Array<Item>();
    }

    hasItem(itemToFind: ItemType): boolean{
        for(let i=0 ; i < this.items.length ; i++)
            if(this.items[i].key === itemToFind)
                return true;
        return false;
    }

    getItems(): Array<Item>{
        return this.items;
    }

    isEmpty(): boolean{
        if(this.items.length === 0)
            return true;
        else return false;
    }

    setBasicAttack(ability: Ability): void{
        this.basicAttack = ability;
    }

    getBasicAttack(): Ability{
        return this.basicAttack;
    }

    addItem(item: Item): void{
        if (item.name != "Health Pack"){
            this.items.push(item);
        }
    }
}