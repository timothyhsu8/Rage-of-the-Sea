import Registry from "../../Wolfie2D/Registry/Registries/Registry";
import AbilityType from "../GameSystems/items/AbilityTypes/AbilityType";

export default class AbilityTypeRegistry extends Registry<AbilityType> {
    
    public preload(): void {}

    // We don't need this for this assignment
    public registerAndPreloadItem(key: string): void {}

    public registerItem(key: string, type: AbilityType): void {
        this.add(key, type);
    }
}