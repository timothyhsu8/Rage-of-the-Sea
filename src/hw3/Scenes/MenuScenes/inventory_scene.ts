import PlayerController from "../../AI/PlayerController";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../../Wolfie2D/Scene/Scene";
import { GraphicType } from "../../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import PositionGraph from "../../../Wolfie2D/DataTypes/Graphs/PositionGraph";
import Navmesh from "../../../Wolfie2D/Pathfinding/Navmesh";
import {hw3_Names} from "../../hw3_constants";
import EnemyAI from "../../AI/EnemyAI";
import WeaponType from "../../GameSystems/items/WeaponTypes/WeaponType";
import RegistryManager from "../../../Wolfie2D/Registry/RegistryManager";
import Weapon from "../../GameSystems/items/Weapon";
import Healthpack from "../../GameSystems/items/Healthpack";
import InventoryManager from "../../GameSystems/InventoryManager";
import Item from "../../GameSystems/items/Item";
import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import BattleManager from "../../GameSystems/BattleManager";
import BattlerAI from "../../AI/BattlerAI";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../../Wolfie2D/Utils/Color";
import Input from "../../../Wolfie2D/Input/Input";
import GameOver from "../GameOver";
import Graphic from "../../../Wolfie2D/Nodes/Graphic";
import MainMenu from "./MainMenu";
import Layer from "../../../Wolfie2D/Scene/Layer";

export default class hw3_scene extends Scene {
    private inventory: Layer;


    loadScene(){
        this.load.image("portrait", "hw3_assets/sprites/playerportrait.png");
        this.load.image("lasergun", "hw3_assets/sprites/lasergun.png");
        this.load.image("healthpack", "hw3_assets/sprites/healthpack.png");
    
    }

    startScene(){
        console.log("UPDATED");
        this.inventory = this.addUILayer("inventory");
        this.addLayer("primary", 10);
        const inventoryHeader = <Label>this.add.uiElement(UIElementType.LABEL, "inventory", {position: new Vec2(200, 100), text: MainMenu.char});
        const currentlyEquipped = <Label>this.add.uiElement(UIElementType.LABEL, "inventory", {position: new Vec2(900, 100), text: "Currently Equipped"});
        const ownedItems = <Label>this.add.uiElement(UIElementType.LABEL, "inventory", {position: new Vec2(900, 450), text: "Owned Items"});
        inventoryHeader.textColor = Color.WHITE;
        currentlyEquipped.textColor = Color.WHITE;
        ownedItems.textColor = Color.WHITE;

    }

    updateScene(deltaT: number): void {
        
        let portrait = this.add.sprite(MainMenu.image, "primary");
        portrait.scale = new Vec2(10,10);
        portrait.position = new Vec2(200, 200);

        let width = 500;
        let height = 150;
        var text = ""
        for (let x in MainMenu.equipped){
            let portrait = this.add.sprite(MainMenu.equipped[x], "primary");
            portrait.scale = new Vec2(4,4);
            portrait.position = new Vec2(width, height);
            width += 200
            if (width >= 1400){
                height += 100
                width = 500
            }
        }                

        width = 500;
        height = 500;
        for (let x in MainMenu.items){
            let portrait = this.add.sprite(MainMenu.items[x], "primary");
            portrait.scale = new Vec2(4,4);
            portrait.position = new Vec2(width, height);
            width += 200
            if (width >= 1400){
                height += 100
                width = 500
            }
        }
    }
}