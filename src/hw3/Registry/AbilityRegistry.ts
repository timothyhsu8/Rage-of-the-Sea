import Registry from "../../Wolfie2D/Registry/Registries/Registry";
import ResourceManager from "../../Wolfie2D/ResourceManager/ResourceManager";
import GroundSlam from "../GameSystems/items/AbilityTypes/GroundSlam";
import WeaponType from "../GameSystems/items/WeaponTypes/WeaponType";
import AnchorSwing from "../GameSystems/items/AbilityTypes/AnchorSwing";
import Snipe from "../GameSystems/items/AbilityTypes/Snipe";
import Double_Snipe from "../GameSystems/items/AbilityTypes/Double_Snipe";
import Spike_Line from "../GameSystems/items/AbilityTypes/SpikeLine";
import Triple_Snipe from "../GameSystems/items/AbilityTypes/Triple_Snipe";
import Cross from "../GameSystems/items/AbilityTypes/Cross";

export default class AbilityTemplateRegistry extends Registry<WeaponConstructor> {
    
    public preload(): void {
        const rm = ResourceManager.getInstance();

        // Load spritesheets
        rm.spritesheet("slice", "hw3_assets/spritesheets/abilities/slice.json");
        rm.spritesheet("groundslam", "hw3_assets/spritesheets/abilities/groundslam.json");
        rm.spritesheet("anchorswing", "hw3_assets/spritesheets/abilities/anchorswing.json");
        rm.spritesheet("snipe", "hw3_assets/spritesheets/abilities/snipe.json");
        rm.spritesheet("double_snipe", "hw3_assets/spritesheets/abilities/double_snipe.json");
        rm.spritesheet("triple_snipe", "hw3_assets/spritesheets/abilities/triple_snipe.json");
        rm.spritesheet("spike_line", "hw3_assets/spritesheets/abilities/spike_line.json");
        rm.spritesheet("cross", "hw3_assets/spritesheets/abilities/cross.json");

        // Register default types
        this.registerItem("groundslam", GroundSlam);
        this.registerItem("anchorswing", AnchorSwing);
        this.registerItem("snipe", Snipe);
        this.registerItem("double_snipe", Double_Snipe);
        this.registerItem("triple_snipe", Triple_Snipe);
        this.registerItem("spike_line", Spike_Line);
        this.registerItem("cross", Cross);
    }

    // We don't need this for this assignment
    public registerAndPreloadItem(key: string): void {}

    public registerItem(key: string, constr: WeaponConstructor): void {
        this.add(key, constr);
    }
}

type WeaponConstructor = new (...args: any) => WeaponType;