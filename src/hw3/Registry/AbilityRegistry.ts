import Registry from "../../Wolfie2D/Registry/Registries/Registry";
import ResourceManager from "../../Wolfie2D/ResourceManager/ResourceManager";
import SemiAutoGun from "../GameSystems/items/WeaponTypes/SemiAutoGun";
import Slice from "../GameSystems/items/WeaponTypes/Slice";
import GroundSlam from "../GameSystems/items/AbilityTypes/GroundSlam";
import WeaponType from "../GameSystems/items/WeaponTypes/WeaponType";

export default class AbilityTemplateRegistry extends Registry<WeaponConstructor> {
    
    public preload(): void {
        const rm = ResourceManager.getInstance();

        // Load sprites
        // rm.image("pistol", "hw3_assets/sprites/pistol.png");
        // rm.image("knife", "hw3_assets/sprites/knife.png");
        // rm.image("lasergun", "hw3_assets/sprites/lasergun.png");

        // Load spritesheets
        rm.spritesheet("slice", "hw3_assets/spritesheets/slice.json");
        rm.spritesheet("groundslam", "hw3_assets/spritesheets/groundslam.json");

        // Register default types
        this.registerItem("groundslam", GroundSlam);

        //this.registerItem("semiAutoGun", SemiAutoGun);
    }

    // We don't need this for this assignment
    public registerAndPreloadItem(key: string): void {}

    public registerItem(key: string, constr: WeaponConstructor): void {
        this.add(key, constr);
    }
}

type WeaponConstructor = new (...args: any) => WeaponType;