import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import BattlerAI from "../AI/BattlerAI";
import Ability from "./items/Ability";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import CharacterState from "../CharacterState";

export default class BattleManager {
    playerAI: BattlerAI;

    enemies: Array<BattlerAI>;

    enemySprites: Array<AnimatedSprite>;

    player: AnimatedSprite;
    characterState: CharacterState;

    tilemap: OrthogonalTilemap;

    overlapMap: Map<String, number>   // Maps each damage tile position to prevent attack indicators from canceling each other out

    handleInteraction(attackerType: string, ability: Ability, direction: Vec2, attacker: AnimatedSprite){
        /* Attacker is the player */
        if(attackerType === "player"){
            // Check for collisions with enemies
            let enemies = this.enemies;
            let enemySprites = this.enemySprites;
            let characterState = this.characterState;
            setTimeout(function(){      /*  FINAL PROJECT TODO - Make this a chargeUp of each ability. */
                for(let i = 0 ; i < enemies.length ; i++)
                    if(ability.hits(enemies[i].owner)){
                        enemies[i].damage(ability.type.damage * characterState.attackMult); // FINAL PROJECT TODO - Calculate effoct of Attack stat here
                        enemySprites[i].animation.playIfNotAlready("TAKEDAMAGE");
                    }
            }, 200);
        } 
        /* Attacker is a Monster */
        else {
            let damageTiles = ability.type.findHitArea(this.tilemap.getColRowAt(attacker.position), direction);
            
            /* Set floor tiles to indicate they're about to be damaged */
            for(let i = 0 ; i < damageTiles.length ; i++){
                this.tilemap.setTileAtRowCol(damageTiles[i], 3);
            
                /* Increments overlap map for each damage tile */
                let mapKey = damageTiles[i].toString();
                let mapValue = this.overlapMap.get(mapKey);
                if(mapValue === undefined)
                    this.overlapMap.set(mapKey, 0);
                    
                this.overlapMap.set(mapKey, this.overlapMap.get(mapKey)+1);
            }

            attacker.freeze();
            let tilemap = this.tilemap;
            let overlapMap = this.overlapMap;   // Determines if multiple enemy ability indicators are overlapping
            let playerPos = this.player.position;
            let playerAI = this.playerAI;
            let characterState = this.characterState;
            setTimeout(function(){
                // Check if player is hit by attack by comparing player tile to damage tiles
                if(ability.hitsSprite(tilemap.getColRowAt(playerPos), damageTiles))
                    playerAI.damage(ability.type.damage * characterState.takeDamageMult);   // FINAL PROJECT TODO - Calculate effoct of Defense stat here

                /* Set floor tiles back to normal */
                for(let i = 0 ; i < damageTiles.length ; i++){
                    let mapKey = damageTiles[i].toString();
                    overlapMap.set(mapKey, overlapMap.get(mapKey)-1);
                    if(overlapMap.get(mapKey) === 0)
                        tilemap.setTileAtRowCol(damageTiles[i], 1);
                }

                attacker.unfreeze();
            }, ability.type.chargeTime);
        }
    }

    setPlayer(player: BattlerAI, characterState: CharacterState): void {
        this.playerAI = player;
        this.characterState = characterState;
    }

    setEnemies(enemies: Array<BattlerAI>): void {
        this.enemies = enemies;
    }

    setTileMap(player: AnimatedSprite, tilemap: OrthogonalTilemap){
        this.player = player;
        this.tilemap = tilemap;
        this.overlapMap = new Map<String, number>();
    }

}