import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Input from "../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Timer from "../../Wolfie2D/Timing/Timer";
import InventoryManager from "../GameSystems/InventoryManager";
import Healthpack from "../GameSystems/items/Healthpack";
import Item from "../GameSystems/items/Item";
import Weapon from "../GameSystems/items/Weapon";
import BattlerAI from "./BattlerAI";

export default class PlayerController implements BattlerAI {
    // Fields from BattlerAI
    health: number;

    // The actual player sprite
    owner: AnimatedSprite;

    // The inventory of the player
    private inventory: InventoryManager;

    /** A list of items in the game world */
    private items: Array<Item>;

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
        this.health = 100;

        this.items = options.items;
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

        if(!this.direction.isZero()){
            // Move the player
            this.owner.move(this.direction.normalized().scale(this.speed * deltaT));
            this.owner.animation.playIfNotAlready("WALK", true);
        } else {
            // Player is idle
            this.owner.animation.playIfNotAlready("IDLE", true);
        }

        // Get the unit vector in the look direction
        this.lookDirection = this.owner.position.dirTo(Input.getGlobalMousePosition());

        // Shoot a bullet
        if(Input.isMouseJustPressed()){
            // Get the current item
            let item = this.inventory.getItem();

            // If there is an item in the current slot, use it
            if(item){
                item.use(this.owner, "player", this.lookDirection);

                if(item instanceof Healthpack){
                    // Destroy the used healthpack
                    this.inventory.removeItem();
                    item.sprite.visible = false;
                }
            }
        }

        // Rotate the player
        this.owner.rotation = Vec2.UP.angleToCCW(this.lookDirection);

        // Inventory

        // Check for slot change
        if(Input.isJustPressed("slot1")){
            this.inventory.changeSlot(0);
        } else if(Input.isJustPressed("slot2")){
            this.inventory.changeSlot(1);
        }
        
        if(Input.isJustPressed("pickup")){
            // Check if there is an item to pick up
            for(let item of this.items){
                if(this.owner.collisionShape.overlaps(item.sprite.boundary)){
                    // We overlap it, try to pick it up
                    this.inventory.addItem(item);
                    break;
                }
            }
        }

        if(Input.isJustPressed("drop")){
            // Check if we can drop our current item
            let item = this.inventory.removeItem();
            
            if(item){
                // Move the item from the ui to the gameworld
                item.moveSprite(this.owner.position, "primary");

                // Add the item to the list of items
                this.items.push(item);
            }
        }
    }

    damage(damage: number): void {
        this.health -= damage;

        if(this.health <= 0){
            console.log("Game Over");
        }
    }
}