import Game from "./Wolfie2D/Loop/Game";
import RegistryManager from "./Wolfie2D/Registry/RegistryManager";
import AbilityTemplateRegistry from "./hw3/Registry/AbilityRegistry";
import AbilityTypeRegistry from "./hw3/Registry/AbilityTypeRegistry";
import SplashScreen from "./hw3/Scenes/MenuScenes/SplashScreen";

// The main function is your entrypoint into Wolfie2D. Specify your first scene and any options here.
(function main(){
    // Run any tests
    runTests();

    // Set up options for our game
    let options = {
        canvasSize: {x: 1600, y: 900},          // The size of the game
        clearColor: {r: 0.1, g: 0.1, b: 0.1},   // The color the game clears to
        inputs: [
            {name: "forward", keys: ["w"]},
            {name: "backward", keys: ["s"]},
            {name: "left", keys: ["a"]},
            {name: "right", keys: ["d"]},
            {name: "dash", keys: ["space"]},
            {name: "invincibility", keys: ["i"]},
            {name: "floor1", keys: ["1"]},
            {name: "floor2", keys: ["2"]},
            {name: "floor3", keys: ["3"]},
            {name: "floor4", keys: ["4"]},
            {name: "floor5", keys: ["5"]},
            {name: "floor6", keys: ["6"]},
            {name: "floor7", keys: ["7"]},
            {name: "escape", keys: ["escape"]}
        ],
        useWebGL: false,                        // Tell the game we want to use webgl
        showDebug: false                       // Whether to show debug messages. You can change this to true if you want
    }

    // Set up custom registries
    let abilityTemplateRegistry = new AbilityTemplateRegistry();
    RegistryManager.addCustomRegistry("abilityTemplates", abilityTemplateRegistry);

    let abilityTypeRegistry = new AbilityTypeRegistry();
    RegistryManager.addCustomRegistry("abilityTypes", abilityTypeRegistry);

    // Create a game with the options specified
    const game = new Game(options);

    // Start our game
    game.start(SplashScreen, {});
})();

function runTests(){};