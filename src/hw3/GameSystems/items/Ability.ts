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

    constructor(type: AbilityType, battleManager: BattleManager, scene: Scene){

        // Set the weapon type
        this.type = type;

        // Create an event emitter
        this.emitter = new Emitter();

        // Save a reference to the battler manager
        this.battleManager = battleManager;

        this.scene = scene;

        // Create the cooldown timer
        this.cooldownTimer = new Timer(type.cooldown);

        this.assets = this.type.createRequiredAssets(scene);

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
        this.battleManager.handleInteraction(userType, this, direction, user);

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
        let abilityType = <AbilityType>RegistryManager.getRegistry("abilityTypes").get(type);    // FINAL PROJECT TODO: Make sure this is getting what it needs
        return new Ability(abilityType, battleManager, scene);
    }
}

export enum AbilityTypes {
    PLAYER_ANCHORSWING = "anchorswing",
    GROUNDSLAM = "groundslam",
    SNIPE = "snipe"
}