import RegistryManager from "../../../Wolfie2D/Registry/RegistryManager";
import Scene from "../../../Wolfie2D/Scene/Scene";
import MainMenu from "./MainMenu";

/* 
    Loading of all essential data before the game starts will be done here 
    FINAL PROJECT TODO - Make this come before the splash screen and have a loading bar
*/
export default class LoadScreen extends Scene {
    loadScene(){
        /* Load Menu Images */
        this.load.image("menubackground", "hw3_assets/sprites/backgroundart/menubackground.png");

        /* Load Map */
        this.load.image("mapBackground", "hw3_assets/sprites/map/map.png");
        this.load.image("battleIcon", "hw3_assets/sprites/map/battleicon.png");

        /* Load Player Spritesheet */
        this.load.spritesheet("player", "hw3_assets/spritesheets/player.json");

        /* Load Player Portraits */
        this.load.image("portrait", "hw3_assets/sprites/healthUI/diverportrait.png");
        this.load.image("portraitborder", "hw3_assets/sprites/healthUI/portraitborder.png");
        this.load.image("healthbarborder", "hw3_assets/sprites/healthUI/healthbarborder.png");

        /* Load Enemies for each floor */
        this.load.object("floor1enemies", "hw3_assets/data/floor1enemies.json");

        /* Load Abilities  */
        this.load.object("abilityData", "hw3_assets/data/abilityData.json");

        /* Load Inventory Slots */
        this.load.image("inventorySlot", "hw3_assets/sprites/inventory.png");
    }

    startScene(){
        this.initializeAbilities();
        this.sceneManager.changeToScene(MainMenu, {});
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
