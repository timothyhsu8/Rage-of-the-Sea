import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Stats from "../../Stats";
import Ability from "./Ability";

export default class Item {
    /** The sprite that represents this weapon in the world or in an inventory */
    name: string;
    key: ItemType;
    sprite: Sprite;
    ability: Ability;
    damage: number;

    /* Stats */
    stats: Stats;

    constructor(name: string, key:ItemType, ability: Ability, maxHealth: number, health: number, attack: number, 
        attackMult: number, defense: number, speed:number, takeDamageMult: number){
        this.name = name;
        this.key = key;
        this.ability = ability;
        this.stats = new Stats(maxHealth, health, attack, attackMult, defense, speed, takeDamageMult);
    }

    moveSprite(position: Vec2, layer?: string){
        // Change the layer if needed
        if(layer){
            let currentLayer = this.sprite.getLayer();
            currentLayer.removeNode(this.sprite);
            let newLayer = this.sprite.getScene().getLayer(layer);
            newLayer.addNode(this.sprite);
            this.sprite.setLayer(newLayer);
        }

        // Move the sprite
        this.sprite.position.copy(position);
    }

    /* FINAL PROJECT TODO - Implement this method */
    use(user: AnimatedSprite, userType: string, direction: Vec2): boolean { 
        /* If this item has no active ability return false */
        if(this.ability === null)
            return false;
        return this.ability.cast(user, userType, direction);
    }
}

export enum ItemType {
    DOUBLE_EDGED_SWORD = "double_edged_sword",
    NORMAL_BOOTS = "normal_boots",
    HEAL = "heal",
    IRON_PLATING = "iron_plating",
    FURY_GEMSTONE = "fury_gemstone",
    RESILIENCE_GEMSTONE = "resilience_gemstone",
    SWIFTNESS_GEMSTONE = "swiftness_gemstone",
    NONE = "none"
}