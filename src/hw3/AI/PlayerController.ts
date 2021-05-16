import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import Inventory from "../GameSystems/Inventory";
import { ItemType } from "../GameSystems/items/Item";
import HelpScreen from "../Scenes/MenuScenes/HelpScreen";
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

    walls: OrthogonalTilemap;

    // Array of tiles that player is currently standing on
    activeTile: Vec2;

    dashIsReady: boolean;
    
    private dashVelocity: Vec2;

    private dashCD: Sprite;

    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        this.direction = Vec2.ZERO;
        this.lookDirection = Vec2.ZERO;
        this.speed = options.speed;
        this.health = options.health;

        this.inventory = options.inventory;
        this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;
        this.activeTile = this.tilemap.getColRowAt(new Vec2(this.owner.position.x, this.owner.position.y));
        this.dashIsReady = true;
        this.walls = this.owner.getScene().getTilemap(options.walls) as OrthogonalTilemap;
        this.dashCD = options.dashCD;
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
        if (this.owner.active){
            this.dashCD.tweens.resume("runCooldown")
            
            // Get the movement direction
            this.direction.x = (Input.isPressed("left") ? -1 : 0) + (Input.isPressed("right") ? 1 : 0);
            this.direction.y = (Input.isPressed("forward") ? -1 : 0) + (Input.isPressed("backward") ? 1 : 0);

            /* Enable invincibility */
            if(HelpScreen.allowInvincibility && Input.isJustPressed("invincibility")){
                this.owner.getEmitter().fireEvent(GameEventType.PLAY_SOUND, {key: "click"});
                (HelpScreen.invincibility)?(HelpScreen.invincibility = false):(HelpScreen.invincibility=true);
            }

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

            /* Use Dash */
            if(this.dashIsReady && Input.isJustPressed("dash")){
                let useDash = false;
                let newPos = this.owner.position.clone();

                this.dashVelocity = new Vec2(0, 0);
                if(Input.isPressed("left")){
                    useDash = true;
                    newPos.x -= 50;
                    this.dashVelocity.x = -1.0;
                }
                else if(Input.isPressed("right")){
                    useDash = true;
                    newPos.x += 50;
                    this.dashVelocity.x = 1.0;
                }
                if(Input.isPressed("forward")){
                    useDash = true;
                    newPos.y -= 50;
                    this.dashVelocity.y = -1.0;
                }
                else if(Input.isPressed("backward")){
                    useDash = true;
                    newPos.y += 50;
                    this.dashVelocity.y = 1.0;
                }

                /* Slightly reduce distance of diagonal dashes */
                if(this.dashVelocity.x !== 0 && this.dashVelocity.y !== 0){
                    (this.dashVelocity.x > 0)?(newPos.x -= 12):(newPos.x += 12);
                    (this.dashVelocity.y > 0)?(newPos.y -= 12):(newPos.y += 12);
                }

                /* If user presses SPACE without WASD, dash forward */
                if(this.dashVelocity.x === 0 && this.dashVelocity.y === 0){
                    (this.owner.invertX)?(newPos.x -=50):(newPos.x +=50);
                    (this.owner.invertX)?(this.dashVelocity.x = -1.0):(this.dashVelocity.x = 1.0);
                    useDash = true;
                }

                /* If player has Flowing Water item, increase dash distance */
                if(this.inventory.hasItem(ItemType.FLOWING_WATER)){
                    if(this.dashVelocity.x !== 0)
                        (this.dashVelocity.x > 0)?(newPos.x += 18):(newPos.x -= 18);

                    if(this.dashVelocity.y !== 0)
                        (this.dashVelocity.y > 0)?(newPos.y += 18):(newPos.y -= 18);
                }

                /* Uses dash if Spacebar + WASD was pressed */
                if(useDash){
                    let dashCooldown = 0;
                    (this.inventory.hasItem(ItemType.BLESSING_OF_THE_TIDES))?(dashCooldown = 1800):(dashCooldown = 2500);

                    this.putDashOnCooldown(dashCooldown);
                    this.owner.tweens.add("dash", {startDelay: 0, duration: 500,
                        effects: [{
                                property: TweenableProperties.posX,
                                start: this.owner.position.x,
                                end: newPos.x,
                                ease: EaseFunctionType.OUT_SINE
                            },
                            {
                                property: TweenableProperties.posY,
                                start: this.owner.position.y,
                                end: newPos.y,
                                ease: EaseFunctionType.OUT_SINE
                            }
                            ]
                        });
                    this.owner.tweens.play("dash");
                    this.owner.animation.playUninterruptable("DASH");
                    this.dashIsReady = false;
                    this.owner.getEmitter().fireEvent(GameEventType.PLAY_SOUND, {key: "dash_sound"});
                    setTimeout(() => {
                        this.dashIsReady = true;
                    }, dashCooldown);
                }
            }

            /* Prevent dash from going through walls */
            let colrow = this.tilemap.getColRowAt(this.owner.position);
            if(this.walls.isTileCollidable(colrow.x, colrow.y)){
                this.owner.tweens.stop("dash");
                if(this.dashVelocity.x > 0)
                    this.owner.position.x -= 8;

                if(this.dashVelocity.x < 0)
                    this.owner.position.x += 8;

                if(this.dashVelocity.y > 0)
                    this.owner.position.y -= 8;

                if(this.dashVelocity.y < 0)
                    this.owner.position.y += 8;    
            }

            // Use an Attack/Ability
            if(Input.isMouseJustPressed()){
                // Do Basic Attack on left click
                if(!Input.isMouseRightClick()){
                    if (this.owner.active){ // make sure the player has physics enabled
                        // Rotate the player
                        this.owner.rotation = Vec2.UP.angleToCCW(this.lookDirection);
                        if(this.inventory.getBasicAttack().cast(this.owner, "player", this.lookDirection)){
                            (this.owner.rotation > 2) ? ((<AnimatedSprite>this.owner).invertX = false):((<AnimatedSprite>this.owner).invertX = true);   // Rotate player to face direction of swing
                            this.owner.animation.playIfNotAlready("ATTACK");
                        }
                        this.owner.rotation = 0;
                    }
                    
                }

                // Use Current Item on right click
                // else if(Input.isMouseRightClick())
                //     if(!this.inventory.isEmpty()){
                //         this.owner.rotation = Vec2.UP.angleToCCW(this.lookDirection);
                //         // this.owner.animation.playIfNotAlready("USEITEM");
                //         //this.inventory.getCurrentItem().use(this.owner, "player", this.lookDirection);
                //         this.owner.rotation = 0;
                //     }
            }

            // Get the unit vector in the look direction
            this.lookDirection = this.owner.position.dirTo(Input.getGlobalMousePosition());
        }
        else{
            this.dashCD.tweens.pause("runCooldown")
        }
    }

    destroy(): void {
        // this.owner.destroy();
    }

    putDashOnCooldown(dashCD: number): void{
        this.dashCD.tweens.add("runCooldown", {startDelay: 0, duration: dashCD,
            effects: [{
                    property: TweenableProperties.scaleX,
                    start: 0,
                    end: 1.0,
                    ease: EaseFunctionType.IN_SINE
                }]
            });
        this.dashCD.tweens.play("runCooldown");
    }

    damage(damage: number): void {
        console.log(damage);
        if(damage <= 0)
            damage = 1;

        if(!HelpScreen.invincibility){
            if(this.owner.tweens !== undefined && this.owner.tweens.isStopped("takedamage")){
                this.health -= damage;
                this.owner.getEmitter().fireEvent(GameEventType.PLAY_SOUND, {key: "playerdamage"});
                this.owner.tweens.play("takedamage", true);
                setTimeout(() => {
                    if(this.owner.tweens !== undefined){
                        this.owner.tweens.stop("takedamage");
                        this.owner.alpha = 1.0;
                    }
                }, 2000);
            }
        }
    }
}