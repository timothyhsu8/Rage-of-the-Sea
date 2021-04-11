import GameNode from "../../Wolfie2D/Nodes/GameNode";
import BattlerAI from "../AI/BattlerAI";
import Ability from "./items/Ability";
import Weapon from "./items/Weapon";

export default class BattleManager {
    player: BattlerAI;

    enemies: Array<BattlerAI>;

    handleInteraction(attackerType: string, ability: Ability){
        if(attackerType === "player"){
            // Check for collisions with enemies
            for(let enemy of this.enemies){
                if(ability.hits(enemy.owner)){
                    enemy.damage(ability.type.damage);
                }
            }
        } else {
            // Check for collision with player
            if(ability.hits(this.player.owner)){
                this.player.damage(ability.type.damage);
            }
        }
    }

    setPlayer(player: BattlerAI): void {
        this.player = player;
    }

    setEnemies(enemies: Array<BattlerAI>): void {
        this.enemies = enemies;
    }
}