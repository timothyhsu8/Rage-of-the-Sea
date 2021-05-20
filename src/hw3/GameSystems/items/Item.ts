import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Color from "../../../Wolfie2D/Utils/Color";
import PancakeColor from "../../../Wolfie2D/Utils/PancakeColor";
import Stats from "../../Stats";
import Ability from "./Ability";

export default class Item {
    /** The sprite that represents this weapon in the world or in an inventory */
    name: string;
    key: ItemType;
    description: string;
    rarity: string;
    sprite: Sprite;
    ability: Ability;
    damage: number;
    statsString: string;

    /* Stats */
    stats: Stats;

    constructor(name: string, key:ItemType, ability: Ability, maxHealth: number, health: number, attack: number, 
        attackMult: number, defense: number, speed:number, takeDamageMult: number, description: string, statsString: string, rarity: string){
        this.name = name;
        this.key = key;
        this.description = description;
        this.statsString = statsString;
        this.rarity = rarity;
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

    use(user: AnimatedSprite, userType: string, direction: Vec2): boolean { 
        /* If this item has no active ability return false */
        if(this.ability === null)
            return false;
        return this.ability.cast(user, userType, direction);
    }

    static getRarityText(rarity: string): string{
        switch(rarity){
            case "common":
                return "Common";
            case "uncommon":
                return "Uncommon";
            case "rare":
                return "Rare";
            case "ultra_rare":
                return "Ultra Rare";
            case "special":
                return "Special";
            default:
                return "Common";
        }
    }

    static getRarityColor(rarity: string): Color{
        switch(rarity){
            case "common":
                return Color.WHITE;
            case "uncommon":
                return PancakeColor.LIGHT_GREEN;
            case "rare":
                return PancakeColor.TURQUOISE;
            case "ultra_rare":
                return PancakeColor.YELLOW;
            case "special":
                return PancakeColor.TURQUOISE;
            default:
                return Color.WHITE;
        }
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
    FLOWING_WATER = "flowing_water",
    BLESSING_OF_THE_TIDES = "blessing_of_the_tides",
    NONE = "none"
}