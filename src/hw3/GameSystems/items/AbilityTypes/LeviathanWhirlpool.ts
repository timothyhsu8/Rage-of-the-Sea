import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../../../Wolfie2D/Scene/Scene";
import AbilityType from "./AbilityType";

export default class LeviathanWhirlpool extends AbilityType {

    initialize(options: Record<string, any>): void {
        this.damage = options.damage;
        this.cooldown = options.cooldown;
        this.chargeTime = options.chargeTime;
        this.displayName = options.displayName;
        this.spriteKey = options.spriteKey;
        this.hasTileAnimations = false;
    }

    /* Calculates the squares to damage and returns them as an array */
    findHitArea(ownerPos: Vec2, direction: Vec2, playerPos: Vec2) : Array<Vec2>{
        let damageTiles = new Array<Vec2>();
        let damageTileBase = new Vec2();

        for(let i=playerPos.y-3 ; i < playerPos.y+3 ; i++)
            for(let j=playerPos.x-3 ; j < playerPos.x+4 ; j++){
                let damageTile = damageTileBase.clone();
                damageTile.x = j;
                damageTile.y = i;
                damageTiles.push(damageTile);
            }

        damageTiles.push(this.makeTile(damageTileBase, playerPos.x+4, playerPos.y));
        damageTiles.push(this.makeTile(damageTileBase, playerPos.x-4, playerPos.y));
        damageTiles.push(this.makeTile(damageTileBase, playerPos.x, playerPos.y+3));
        damageTiles.push(this.makeTile(damageTileBase, playerPos.x, playerPos.y-4));
        return damageTiles;
    }

    doAnimation(attacker: GameNode, direction: Vec2, abilitySprite: AnimatedSprite): void {
        //attacker.getEmitter().fireEvent(GameEventType.PLAY_SOUND, {key: "snipe_sound"});
    }

    doIndicatorAnimations(position: Vec2, sprite: AnimatedSprite): void{
        sprite.position = position;
        sprite.position.y += 10;
        sprite.animation.play("SPROUT");
        sprite.animation.queue("NORMAL", true);
    }

    createRequiredAssets(scene: Scene): [AnimatedSprite] {
        let spikes = scene.add.animatedSprite("leviathan_whirlpool", "primary");
        spikes.animation.play("NORMAL");
        return [spikes];
    }

    /* Determines if an entity is on a damage tile */
    hitsSprite(targetRowCol: Vec2, damageTiles: Array<Vec2>): boolean{
        for(let i = 0 ; i < damageTiles.length ; i++)
            if(targetRowCol.x === damageTiles[i].x && targetRowCol.y === damageTiles[i].y)
                return true;
        return false;
    }

    hits(node: GameNode, abilitySprite: AnimatedSprite): boolean {
        return abilitySprite.boundary.overlaps(node.collisionShape);
    }

    makeTile(baseTile: Vec2, posX: number, posY: number):Vec2{
        let damageTile = baseTile.clone();
        damageTile.x = posX;
        damageTile.y = posY;
        return damageTile;
    }
}