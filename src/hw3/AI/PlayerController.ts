import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Input from "../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Inventory from "../GameSystems/Inventory";
import BattlerAI from "./BattlerAI";

export default class PlayerController implements BattlerAI {

    // Fields from BattlerAI
    health: number;

    // The actual player sprite
    owner: AnimatedSprite;

    // The inventory of the player
    private inventory: Inventory;

    // Movement
    private direction: Vec2;
    private speed: number;

    // Attacking
    private lookDirection: Vec2;

    // Tilemap
    tilemap: OrthogonalTilemap;

    // Array of tiles that player is currently standing on
    activeTile: Vec2;

    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        this.direction = Vec2.ZERO;
        this.lookDirection = Vec2.ZERO;
        this.speed = options.speed;
        this.health = options.health;

        this.inventory = options.inventory;
        this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;
        this.activeTile = this.tilemap.getColRowAt(new Vec2(this.owner.position.x, this.owner.position.y));
    }

    activate(options: Record<string, any>): void {}

    handleEvent(event: GameEvent): void {}

    /* Finds if activeTiles array has specified RowCol tile in it */
    hasColRow(tileArray: Vec2, itemToFind: Vec2): boolean {
        if(tileArray.x === itemToFind.x && tileArray.y === itemToFind.y)
            return true;
        return false;
    }

    update(deltaT: number): void {
        // Get the movement direction
        this.direction.x = (Input.isPressed("left") ? -1 : 0) + (Input.isPressed("right") ? 1 : 0);
        this.direction.y = (Input.isPressed("forward") ? -1 : 0) + (Input.isPressed("backward") ? 1 : 0);

        /* --HANDLING TILE HIGHLIGHTING OF WHERE PLAYER IS CURRENTLY STANDING-- */
        let currentColRow: Vec2 = this.tilemap.getColRowAt(new Vec2(this.owner.position.x, this.owner.position.y));
        if(currentColRow !== this.activeTile){
            // Set previous tile back to 1 (Standard floor tile)
            if(this.tilemap.getTileAtRowCol(this.activeTile) === 2)
                this.tilemap.setTileAtRowCol(this.activeTile, 1);

            // If previous tile was red, set back to yellow
            else if(this.tilemap.getTileAtRowCol(this.activeTile) === 4)
                this.tilemap.setTileAtRowCol(this.activeTile, 3);

            // Set current tile to 2 (Highlighted floor tile)
            if(this.tilemap.getTileAtRowCol(currentColRow) === 1)
                this.tilemap.setTileAtRowCol(currentColRow, 2);
            
            // If current tile is yellow, set to red
            else if(this.tilemap.getTileAtRowCol(currentColRow) === 3)
                this.tilemap.setTileAtRowCol(currentColRow, 4);

            this.activeTile = currentColRow;
        }

         /* Move player */
        if(!this.direction.isZero())
            this.owner.move(this.direction.normalized().scale(this.speed * deltaT));

        /* Player Move Animations */
        if(!this.owner.animation.isPlaying("ATTACK")){
            /* Turns player sprite when moving left/right */
            if(!this.direction.isZero() && this.direction.y === 0){
                (this.direction.x === -1) ? ((<AnimatedSprite>this.owner).invertX = true):((<AnimatedSprite>this.owner).invertX = false);
                this.owner.animation.playIfNotAlready("WALK", true);
            }

            /* Turns player sprite when moving up/down */
            else if(!this.direction.isZero() && this.direction.y === 1)
                this.owner.animation.playIfNotAlready("WALKDOWN", true);

            /* Turns player sprite when moving up/down */
            else if(!this.direction.isZero() && this.direction.y === -1)
            this.owner.animation.playIfNotAlready("WALKUP", true);

            /* If player is not moving, play IDLE animation */
            else {
                this.owner.animation.playIfNotAlready("IDLE", true);
            }
        }

        // Use an Attack/Ability
        if(Input.isMouseJustPressed()){
            // Do Basic Attack on left click
            if(!Input.isMouseRightClick()){
                // Rotate the player
                this.owner.rotation = Vec2.UP.angleToCCW(this.lookDirection);
                this.owner.animation.playIfNotAlready("ATTACK");
                this.inventory.getBasicAttack().cast(this.owner, "player", this.lookDirection);
                this.owner.rotation = 0;
            }

            // Use Current Item on right click
            else if(Input.isMouseRightClick())
                if(!this.inventory.isEmpty()){
                    this.owner.rotation = Vec2.UP.angleToCCW(this.lookDirection);
                    // this.owner.animation.playIfNotAlready("USEITEM");
                    this.inventory.getCurrentItem().use(this.owner, "player", this.lookDirection);
                    this.owner.rotation = 0;
                }
        }

        // Get the unit vector in the look direction
        this.lookDirection = this.owner.position.dirTo(Input.getGlobalMousePosition());
    }

    /* FINAL PROJECT TODO - Implement */
    destroy(): void {
        // this.owner.destroy();
    }

    damage(damage: number): void {
        if(this.owner !== undefined){
            if(this.owner.tweens.isStopped("takedamage")){
                this.health -= damage;
                this.owner.tweens.play("takedamage", true);
                setTimeout(() => {
                    if(this.owner !== undefined){
                    this.owner.tweens.stop("takedamage");
                    this.owner.alpha = 1.0;
                    }
                }, 2000);
            }
        }
    }
}