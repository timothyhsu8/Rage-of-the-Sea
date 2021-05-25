import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import RegistryManager from "../../../Wolfie2D/Registry/RegistryManager";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import MainMenu from "./MainMenu";

/* 
    Loading of all essential data before the game starts will be done here 
    FINAL PROJECT TODO - Make this come before the splash screen and have a loading bar
*/
export default class LoadScreen extends Scene {

    private itemData: any;

    loadScene(){
        /* Music */
        this.load.audio("level1music", "game_assets/music/level1music.mp3");
        this.load.audio("level2music", "game_assets/music/level2music.mp3");
        this.load.audio("level3music", "game_assets/music/level3music.mp3");
        this.load.audio("level4music", "game_assets/music/level4music.mp3");
        this.load.audio("level5music", "game_assets/music/level5music.mp3");
        this.load.audio("level6music", "game_assets/music/level6music.mp3");
        this.load.audio("level7music", "game_assets/music/level7music.mp3");

        /* Player Audio */
        this.load.audio("anchorswing_sound", "game_assets/sounds/anchorswing.mp3");
        this.load.audio("dash_sound", "game_assets/sounds/dash.mp3");
        this.load.audio("playerdamage", "game_assets/sounds/playerdamage.mp3")

        /* Ability Audio */
        this.load.audio("snipe_sound", "game_assets/sounds/snipe.mp3")
        this.load.audio("spikeline_sound", "game_assets/sounds/spikeline.mp3")
        this.load.audio("cross_sound", "game_assets/sounds/cross.mp3")

        /* Load Menu Images */
        this.load.image("menubackground", "game_assets/sprites/backgroundart/menubackground.png");
        this.load.image("defaultbackground", "game_assets/sprites/backgroundart/defaultbackground.png");
        this.load.image("darkbackground", "game_assets/sprites/backgroundart/darkbackground.png");
        this.load.image("itemdescriptionbox", "game_assets/sprites/itemicons/itemdescriptionbox.png");
        this.load.image("health_icon", "game_assets/sprites/healthUI/health_icon.png");
        
        /* Load Map */
        this.load.image("mapBackground", "game_assets/sprites/map/map.png");
        this.load.image("battleIcon", "game_assets/sprites/map/battleicon.png");
        this.load.image("shrineIcon", "game_assets/sprites/map/shrineicon.png");

        /* Load Player Spritesheet */
        this.load.spritesheet("player", "game_assets/spritesheets/player.json");

        /* Load Player Portraits */
        this.load.image("portrait", "game_assets/sprites/healthUI/diverportrait.png");
        this.load.image("portraitborder", "game_assets/sprites/healthUI/portraitborder.png");
        this.load.image("healthbarborder", "game_assets/sprites/healthUI/healthbarborder.png");
        this.load.image("dashcd", "game_assets/sprites/healthUI/dashcd.png");
        this.load.image("secondarycd", "game_assets/sprites/healthUI/secondarycd.png");
        this.load.image("dashborder", "game_assets/sprites/healthUI/dashborder.png");
        this.load.image("dashbg", "game_assets/sprites/healthUI/dashbg.png");
        this.load.image("secondarybg", "game_assets/sprites/healthUI/secondarybg.png");
        this.load.image("bosshp", "game_assets/sprites/healthUI/bosshp.png");
        this.load.image("bosshpbg", "game_assets/sprites/healthUI/bosshpbg.png");

        /* Load Enemies for each floor */
        this.load.object("floorEnemies", "game_assets/data/floorEnemies.json");

        /* Load Items and Abilities  */
        this.load.object("abilityData", "game_assets/data/abilityData.json");

        this.itemData = this.load.getObject("itemInfo");
        for(let i=0; i < this.itemData.numItems ; i++){
            this.load.image(this.itemData.allitems[i].key, "game_assets/sprites/itemicons/" + this.itemData.allitems[i].key + ".png");
        }

        for(let i=0; i < this.itemData.numSpecialItems ; i++){
            this.load.image(this.itemData.specialitems[i].key, "game_assets/sprites/itemicons/" + this.itemData.specialitems[i].key + ".png");
        }
        
        /* Load Rarity Borders */
        this.load.image("commonBorder", "game_assets/sprites/rarityborders/common.png");
        this.load.image("uncommonBorder", "game_assets/sprites/rarityborders/uncommon.png");
        this.load.image("rareBorder", "game_assets/sprites/rarityborders/rare.png");
        this.load.image("ultra_rareBorder", "game_assets/sprites/rarityborders/ultra_rare.png");
        this.load.image("specialBorder", "game_assets/sprites/rarityborders/special.png");
    }

    unloadScene(){
        this.load.keepAudio("level1music");
        this.load.keepAudio("level2music");
        this.load.keepAudio("level3music");
        this.load.keepAudio("level4music");
        this.load.keepAudio("level5music");
        this.load.keepAudio("level6music");
        this.load.keepAudio("level7music");

        this.load.keepAudio("anchorswing_sound");
        this.load.keepAudio("dash_sound");
        this.load.keepAudio("playerdamage");
        this.load.keepAudio("snipe_sound");
        this.load.keepAudio("spikeline_sound");
        this.load.keepAudio("cross_sound");

        this.load.keepSpritesheet("player");

        this.load.keepObject("abilityData");
        this.load.keepObject("floorEnemies");

        this.load.keepImage("battleIcon");
        this.load.keepImage("shrineIcon");
        this.load.keepImage("health_icon");

        this.load.keepImage("menubackground");
        this.load.keepImage("defaultbackground");
        this.load.keepImage("darkbackground");
        this.load.keepImage("mapBackground");
        this.load.keepImage("portrait");
        this.load.keepImage("portraitborder");
        this.load.keepImage("healthbarborder");
        this.load.keepImage("dashcd");
        this.load.keepImage("secondarycd");
        this.load.keepImage("dashborder");
        this.load.keepImage("dashbg");
        this.load.keepImage("secondarybg");
        this.load.keepImage("itemdescriptionbox");
        this.load.keepImage("bosshp");
        this.load.keepImage("bosshpbg");

        for(let i=0; i < this.itemData.numItems ; i++)
            this.load.keepImage(this.itemData.allitems[i].key);

        for(let i=0; i < this.itemData.numSpecialItems ; i++)
            this.load.keepImage(this.itemData.specialitems[i].key);

        this.load.keepImage("commonBorder");    
        this.load.keepImage("uncommonBorder");
        this.load.keepImage("rareBorder");
        this.load.keepImage("ultra_rareBorder");
        this.load.keepImage("specialBorder");
    }

    startScene(){
        const center = this.viewport.getCenter();
        this.addUILayer("primary");
        const textlabel = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: center, text:"Loading..."});
        textlabel.textColor = Color.WHITE;
        textlabel.fontSize = 30;
        textlabel.font = "Merriweather";
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
