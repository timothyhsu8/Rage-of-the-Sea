import Registry from "../../Wolfie2D/Registry/Registries/Registry";
import ResourceManager from "../../Wolfie2D/ResourceManager/ResourceManager";
import GroundSlam from "../GameSystems/items/AbilityTypes/GroundSlam";
import AnchorSwing from "../GameSystems/items/AbilityTypes/AnchorSwing";
import Snipe from "../GameSystems/items/AbilityTypes/Snipe";
import Double_Snipe from "../GameSystems/items/AbilityTypes/Double_Snipe";
import Spike_Line from "../GameSystems/items/AbilityTypes/SpikeLine";
import Triple_Snipe from "../GameSystems/items/AbilityTypes/Triple_Snipe";
import Cross from "../GameSystems/items/AbilityTypes/Cross";
import TentacleSprout from "../GameSystems/items/AbilityTypes/TentacleSprout";
import LeviathanSpikes from "../GameSystems/items/AbilityTypes/LeviathanSpikes";
import LeviathanWhirlpool from "../GameSystems/items/AbilityTypes/LeviathanWhirlpool";
import LeviathanRain from "../GameSystems/items/AbilityTypes/LeviathanRain";
import AbilityType from "../GameSystems/items/AbilityTypes/AbilityType";
import LeviathanCross from "../GameSystems/items/AbilityTypes/LeviathanCross";

export default class AbilityTemplateRegistry extends Registry<AbilityConstructor> {
    
    public preload(): void {
        const rm = ResourceManager.getInstance();

        // Load spritesheets
        rm.spritesheet("slice", "game_assets/spritesheets/abilities/slice.json");
        rm.spritesheet("groundslam", "game_assets/spritesheets/abilities/groundslam.json");
        rm.spritesheet("anchorswing", "game_assets/spritesheets/abilities/anchorswing.json");
        rm.spritesheet("snipe", "game_assets/spritesheets/abilities/snipe.json");
        rm.spritesheet("double_snipe", "game_assets/spritesheets/abilities/double_snipe.json");
        rm.spritesheet("triple_snipe", "game_assets/spritesheets/abilities/triple_snipe.json");
        rm.spritesheet("spike_line", "game_assets/spritesheets/abilities/spike_line.json");
        rm.spritesheet("cross", "game_assets/spritesheets/abilities/cross.json");
        rm.spritesheet("tentacle_sprout", "game_assets/spritesheets/abilities/tentacle_sprout.json");
        rm.spritesheet("leviathan_spikes", "game_assets/spritesheets/abilities/leviathan_spikes.json");
        rm.spritesheet("leviathan_whirlpool", "game_assets/spritesheets/abilities/leviathan_whirlpool.json");
        rm.spritesheet("leviathan_rain", "game_assets/spritesheets/abilities/leviathan_rain.json");
        rm.spritesheet("leviathan_cross", "game_assets/spritesheets/abilities/leviathan_cross.json");

        // Register default types
        this.registerItem("groundslam", GroundSlam);
        this.registerItem("anchorswing", AnchorSwing);
        this.registerItem("snipe", Snipe);
        this.registerItem("double_snipe", Double_Snipe);
        this.registerItem("triple_snipe", Triple_Snipe);
        this.registerItem("spike_line", Spike_Line);
        this.registerItem("cross", Cross);
        this.registerItem("tentacle_sprout", TentacleSprout);
        this.registerItem("leviathan_spikes", LeviathanSpikes);
        this.registerItem("leviathan_whirlpool", LeviathanWhirlpool);
        this.registerItem("leviathan_rain", LeviathanRain);
        this.registerItem("leviathan_cross", LeviathanCross);
    }

    // We don't need this for this assignment
    public registerAndPreloadItem(key: string): void {}

    public registerItem(key: string, constr: AbilityConstructor): void {
        this.add(key, constr);
    }
}

type AbilityConstructor = new (...args: any) => AbilityType;