import RegistryManager from "../../../Wolfie2D/Registry/RegistryManager";
import Scene from "../../../Wolfie2D/Scene/Scene";
import MainMenu from "./MainMenu";

/* 
    Loading of all essential data before the game starts will be done here 
    FINAL PROJECT TODO - Make this come before the splash screen and have a loading bar
*/
export default class LoadScreen extends Scene {

    private itemData: any;

    loadScene(){
        /* Load Audio */
        this.load.audio("level1music", "hw3_assets/music/level1music.mp3");
        this.load.audio("level2music", "hw3_assets/music/level1music.mp3");
        this.load.audio("level3music", "hw3_assets/music/level1music.mp3");
        this.load.audio("level4music", "hw3_assets/music/level1music.mp3");
        this.load.audio("level5music", "hw3_assets/music/level1music.mp3");
        this.load.audio("level6music", "hw3_assets/music/level1music.mp3");
        this.load.audio("anchorswing_sound", "hw3_assets/sounds/anchorswing.mp3");

        /* Load Menu Images */
        this.load.image("menubackground", "hw3_assets/sprites/backgroundart/menubackground.png");
        this.load.image("defaultbackground", "hw3_assets/sprites/backgroundart/defaultbackground.png");

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
        this.load.object("floorEnemies", "hw3_assets/data/floorEnemies.json");

        /* Load Items and Abilities  */
        this.load.object("abilityData", "hw3_assets/data/abilityData.json");

        this.itemData = this.load.getObject("itemInfo");
        for(let i=0; i < this.itemData.numItems ; i++){
            this.load.image(this.itemData.allitems[i].key, "hw3_assets/sprites/itemicons/" + this.itemData.allitems[i].key + ".png");
        }
        
        /* Load Inventory Slots */
        this.load.image("inventorySlot", "hw3_assets/sprites/inventory.png");   // FINAL PROJECT TODO - Actually make this
    }

    unloadScene(){
        this.load.keepAudio("level1music");
        this.load.keepAudio("level2music");
        this.load.keepAudio("level3music");
        this.load.keepAudio("level4music");
        this.load.keepAudio("level5music");
        this.load.keepAudio("level6music");
        this.load.keepAudio("anchorswing_sound");

        this.load.keepSpritesheet("player");

        this.load.keepObject("abilityData");
        this.load.keepObject("floorEnemies");

        this.load.keepImage("battleIcon");
        this.load.keepImage("menubackground");
        this.load.keepImage("defaultbackground");
        this.load.keepImage("mapBackground");
        this.load.keepImage("battleIcon");
        this.load.keepImage("portrait");
        this.load.keepImage("portraitborder");
        this.load.keepImage("healthbarborder");

        for(let i=0; i < this.itemData.numItems ; i++)
            this.load.keepImage(this.itemData.allitems[i].key);
    }

    startScene(){
        // this.itemData = this.load.getObject("itemData2");
        // for(let i=0; i < this.itemData.numItems ; i++){
        //     this.load.image(this.itemData.allitems[i].key, "hw3_assets/sprites/itemicons/" + this.itemData.allitems[i].key + ".png");
        // }
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
