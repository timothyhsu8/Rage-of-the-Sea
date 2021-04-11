import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import BattlerAI from "../AI/BattlerAI";
import Ability from "./items/Ability";
import Weapon from "./items/Weapon";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";

export default class BattleManager {
    playerAI: BattlerAI;

    enemies: Array<BattlerAI>;

    player: AnimatedSprite;

    tilemap: OrthogonalTilemap;

    handleInteraction(attackerType: string, ability: Ability, direction: Vec2, attacker: GameNode){
        /* Attacker is the player */
        if(attackerType === "player"){
            // Check for collisions with enemies
            for(let enemy of this.enemies){
                if(ability.hits(enemy.owner)){
                    enemy.damage(ability.type.damage);
                }
            }
        } 
        /* Attacker is a monster */
        else {
            let damageTiles = ability.type.findHitArea(this.tilemap.getColRowAt(attacker.position), direction);
            
            /* Set floor tiles to indicate they're about to be damaged */
            for(let i = 0 ; i < damageTiles.length ; i++)
                this.tilemap.setTileAtRowCol(damageTiles[i], 2);
            
            let tilemap = this.tilemap;
            let playerPos = this.player.position;
            let playerAI = this.playerAI;
            setTimeout(function(){
                // Check if player is hit by attack by comparing player tile to damage tiles
                if(ability.hitsSprite(tilemap.getColRowAt(playerPos), damageTiles))
                    playerAI.damage(ability.type.damage);

                /* Set floor tiles back to normal */
                for(let i = 0 ; i < damageTiles.length ; i++)
                    tilemap.setTileAtRowCol(damageTiles[i], 1);

            }, 1000);
        }
    }

    setPlayerAI(player: BattlerAI): void {
        this.playerAI = player;
    }

    setEnemies(enemies: Array<BattlerAI>): void {
        this.enemies = enemies;
    }

    setTileMap(player: AnimatedSprite, tilemap: OrthogonalTilemap){
        this.player = player;
        this.tilemap = tilemap;
    }

}