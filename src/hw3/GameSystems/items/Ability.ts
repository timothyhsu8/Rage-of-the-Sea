import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../../Wolfie2D/Events/Emitter";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Timer from "../../../Wolfie2D/Timing/Timer";
import BattleManager from "../BattleManager";
import AbilityType from "./AbilityTypes/AbilityType";
import Scene from "../../../Wolfie2D/Scene/Scene";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import RegistryManager from "../../../Wolfie2D/Registry/RegistryManager";

export default class Ability {
    /** The type of this weapon */
    type: AbilityType;

    /** A list of assets this weapon needs to be animated */
    assets: Array<any>;

    /** An event emitter to hook into the EventQueue */
    emitter: Emitter

    /** The battle manager */
    battleManager: BattleManager;

    /** The cooldown timer for this weapon's use */
    cooldownTimer: Timer;

    scene: Scene;

    firstTimeCast: boolean;

    constructor(type: AbilityType, scene: Scene){

        // Set the weapon type
        this.type = type;

        // Create an event emitter
        this.emitter = new Emitter();

        this.scene = scene;

        // Create the cooldown timer
        this.cooldownTimer = new Timer(type.cooldown);

        this.assets = this.type.createRequiredAssets(scene);

        this.firstTimeCast = true;
    }

    setBattleManager(bm: BattleManager){
        this.battleManager = bm;
    }

    setScene(scene: Scene){
        this.scene = scene;
    }

    /* Cast the ability */
    cast(user: AnimatedSprite, userType: string, direction: Vec2): boolean {
        // If the cooldown timer is still running, we can't use the weapon
        if(!this.cooldownTimer.isStopped())
            return false;

        // Do a type specific weapon animation
        this.type.doAnimation(user, direction, ...this.assets);

        // Apply damage
        let damageTiles = this.battleManager.handleInteraction(userType, this, direction, user);
        
        /* Play animations on tiles to be hit */
        if(damageTiles !== undefined){
            /* Adjust animation to center of tile */
            for(let i=0 ; i < damageTiles.length ; i++){
                damageTiles[i].x = damageTiles[i].x+16
                damageTiles[i].y = damageTiles[i].y-16
            }

            /* Play Animation */
            for(let i=0 ; i < damageTiles.length ; i++){
                let asset = this.type.createRequiredAssets(this.scene);
                this.type.doIndicatorAnimations(damageTiles[i], asset[0]);
            }
        }

        // Reset the cooldown timer
        this.cooldownTimer.start();

        return true;
    }

    /* Determines if an entity is on a damage tile */
    hitsSprite(targetRowCol: Vec2, damageTiles: Array<Vec2>): boolean{
        return this.type.hitsSprite(targetRowCol, damageTiles);
    }

    /* Determines if ability hits based on sprites (Player attacking enemy) */
    hits(node: GameNode): boolean {
        return this.type.hits(node, ...this.assets);
    }

    static createAbility(type: AbilityTypes, battleManager: BattleManager, scene: Scene){
        let abilityType = <AbilityType>RegistryManager.getRegistry("abilityTypes").get(type);
        let ret =  new Ability(abilityType, scene);
        ret.setBattleManager(battleManager)
        return ret
    }
}

export enum AbilityTypes {
    PLAYER_ANCHORSWING = "anchorswing",
    LEVIATHAN_SPIKES = "leviathan_spikes",
    LEVIATHAN_WHIRLPOOL = "leviathan_whirlpool"
}