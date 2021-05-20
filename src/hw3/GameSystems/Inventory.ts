import Ability from "./items/Ability";
import Item, { ItemType } from "./items/Item";
import Scene from "../../Wolfie2D/Scene/Scene";

export default class Inventory{
    private items: Array<Item>;
    basicAttack: Ability;
    secondaryAttack: Ability;
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

    setSecondaryAttack(ability: Ability): void{
        this.secondaryAttack = ability;
    }

    getSecondaryAttack(): Ability{
        return this.secondaryAttack;
    }

    addItem(item: Item): void{
        if (item.key !== ItemType.HEALTH_PACK && item.key !== ItemType.SAND_FLOWER){
            this.items.push(item);
        }
    }
}