import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../../Wolfie2D/Events/Emitter";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Timer from "../../../Wolfie2D/Timing/Timer";
import { hw3_Events } from "../../hw3_constants";
import BattleManager from "../BattleManager";
import Item from "./Item";
import WeaponType from "./WeaponTypes/WeaponType";
import AbilityType from "./AbilityTypes/AbilityType";
import Scene from "../../../Wolfie2D/Scene/Scene";

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

    constructor(type: WeaponType, battleManager: BattleManager, scene: Scene){

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

    cast(user: GameNode, userType: string, direction: Vec2): boolean {
        // If the cooldown timer is still running, we can't use the weapon
        if(!this.cooldownTimer.isStopped()){
            return false;
        }

        //console.log(...this.assets);
        // Do a type specific weapon animation
        this.type.doAnimation(user, direction, ...this.assets);

        // Apply damage
        //this.battleManager.handleInteraction(userType, this);

        // Send out an event to alert enemies
        //this.emitter.fireEvent(hw3_Events.SHOT_FIRED, {position: user.position.clone(), volume: this.type.useVolume});
    
        // Reset the cooldown timer
        this.cooldownTimer.start();

        return true;
    }


    // @override
    /**
     * Uses this weapon in the specified direction.
     * This only works if the cooldown timer has ended
     */
    use(user: GameNode, userType: string, direction: Vec2): boolean {
        // If the cooldown timer is still running, we can't use the weapon
        if(!this.cooldownTimer.isStopped()){
            return false;
        }
        // let this.assets = this.type.createRequiredAssets();
        //this.assets = this.type.createRequiredAssets(this.sprite.getScene());
        // Do a type specific weapon animation
        this.type.doAnimation(user, direction, ...this.assets);

        // Apply damage
        //this.battleManager.handleInteraction(userType, this);

        // Send out an event to alert enemies
        this.emitter.fireEvent(hw3_Events.SHOT_FIRED, {position: user.position.clone(), volume: this.type.useVolume});
    
        // Reset the cooldown timer
        this.cooldownTimer.start();

        return true;
    }

    /**
     * A check for whether or not this weapon hit a node
     */
    hits(node: GameNode): boolean {
        return this.type.hits(node, ...this.assets);
    }
}

export enum AbilityTypes {
    GROUNDSLAM = "groundslam"
}