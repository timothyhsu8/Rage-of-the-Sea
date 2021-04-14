import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Slider from "../../Wolfie2D/Nodes/UIElements/Slider";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import TextInput from "../../Wolfie2D/Nodes/UIElements/TextInput";
import floor1_scene from "./floor1_scene";
import Inventory from "../GameSystems/Inventory";
import Ability, { AbilityTypes } from "../GameSystems/items/Ability";
import PlayerController from "../AI/PlayerController";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import AbilityType from "../GameSystems/items/AbilityTypes/AbilityType";
import RegistryManager from "../../Wolfie2D/Registry/RegistryManager";
import BattleManager from "../GameSystems/BattleManager";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import CharacterState from "../CharacterState";


export default class CharacterSelect extends Scene {
   
    private characterSelect: Layer;
    private player: AnimatedSprite;
    private battleManager: BattleManager;

    loadScene(){
        this.load.spritesheet("player", "hw3_assets/spritesheets/player.json");
        this.load.image("portrait", "hw3_assets/sprites/diversplashart.png");
        this.load.image("portraitborder", "hw3_assets/sprites/splashartborder.png");
        this.load.image("lasergun", "hw3_assets/sprites/lasergun.png"); // Load anchor icon for weapon
        this.load.object("abilityData", "hw3_assets/data/abilityData.json");
    }

    startScene(){
        this.characterSelect = this.addUILayer("characterSelect");
        const center = this.viewport.getCenter();

        this.addLayer("primary", 10);
        let portrait = this.add.sprite("portrait", "primary");
        portrait.position = new Vec2(center.x, center.y-150);
        
        let portraitborder = this.add.sprite("portraitborder", "primary");
        portraitborder.position = new Vec2(center.x, center.y-150);

        // Add play button, and give it an event to emit on press 
        const select = this.add.uiElement(UIElementType.BUTTON, "characterSelect", {position: new Vec2(center.x, center.y+165), text: "SELECT"});
        select.size.set(200, 75);
        select.borderWidth = 3;
        select.borderColor = Color.WHITE;
        select.backgroundColor = new Color(50, 50, 70, 1);
        select.onClickEventId = "select";

        const description = this.add.uiElement(UIElementType.BUTTON, "characterSelect", {position: new Vec2(center.x, center.y+280), text: "The diver has a dark and mysterious past."});
        description.size.set(800, 100);
        description.borderWidth = 2;
        description.borderColor = Color.WHITE;
        description.backgroundColor = Color.TRANSPARENT;

        // Subscribe to the button events
        this.receiver.subscribe("select");
    }

    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            if(event.type === "select"){
                //this.initializeCharacter();
                this.initializeAbilities();
                let inventory = new Inventory(this, 10);
                let basicAttack = this.createAbility(AbilityTypes.PLAYER_ANCHORSWING);
                inventory.setBasicAttack(basicAttack);

                let characterState = new CharacterState(100, 10, 10, 80, inventory);
                this.sceneManager.changeScene(floor1_scene, {characterState: characterState});
            }
        }
    }

    createAbility(type: AbilityTypes){
        let abilityType = <AbilityType>RegistryManager.getRegistry("abilityTypes").get(type);    // FINAL PROJECT TODO: Make sure this is getting what it needs

        return new Ability(abilityType, this.battleManager, this);
    }

    initializeAbilities(): void{
        let abilityData = this.load.getObject("abilityData");

        for(let i = 0 ; i < abilityData.numAbilities ; i++){
            let ability = abilityData.abilities[i];

            // Get the constructor of the prototype
            let constr = RegistryManager.getRegistry("abilityTemplates").get(ability.abilityType);

             // Create a weapon type
             let abilityType = new constr();

             // Initialize the weapon type
             abilityType.initialize(ability);
 
             // Register the weapon type
             RegistryManager.getRegistry("abilityTypes").registerItem(ability.name, abilityType)
        }
    }

}