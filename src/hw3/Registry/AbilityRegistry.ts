import Registry from "../../Wolfie2D/Registry/Registries/Registry";
import ResourceManager from "../../Wolfie2D/ResourceManager/ResourceManager";
import GroundSlam from "../GameSystems/items/AbilityTypes/GroundSlam";
import WeaponType from "../GameSystems/items/WeaponTypes/WeaponType";
import AnchorSwing from "../GameSystems/items/AbilityTypes/AnchorSwing";
import Snipe from "../GameSystems/items/AbilityTypes/Snipe";
import Double_Snipe from "../GameSystems/items/AbilityTypes/Double_Snipe";

export default class AbilityTemplateRegistry extends Registry<WeaponConstructor> {
    
    public preload(): void {
        const rm = ResourceManager.getInstance();

        // Load spritesheets
        rm.spritesheet("groundslam", "hw3_assets/spritesheets/abilities/groundslam.json");
        rm.spritesheet("anchorswing", "hw3_assets/spritesheets/abilities/anchorswing.json");
        rm.spritesheet("snipe", "hw3_assets/spritesheets/abilities/snipe.json");
        rm.spritesheet("double_snipe", "hw3_assets/spritesheets/abilities/double_snipe.json");
        rm.spritesheet("slice", "hw3_assets/spritesheets/abilities/slice.json");

        // Register default types
        this.registerItem("groundslam", GroundSlam);
        this.registerItem("anchorswing", AnchorSwing);
        this.registerItem("snipe", Snipe);
        this.registerItem("double_snipe", Double_Snipe);
    }

    // We don't need this for this assignment
    public registerAndPreloadItem(key: string): void {}

    public registerItem(key: string, constr: WeaponConstructor): void {
        this.add(key, constr);
    }
}

type WeaponConstructor = new (...args: any) => WeaponType;