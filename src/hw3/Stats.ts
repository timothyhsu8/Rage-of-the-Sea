export default class Stats {
    health: number;
    attack: number;
    attackMult: number;
    defense: number;
    speed: number;
    takeDamageMult: number;

    constructor(health: number, attack: number, attackMult: number, defense: number, speed: number, takeDamageMult: number){
        this.health = health;
        this.attack = attack;
        this.attackMult = attackMult;
        this.defense = defense;
        this.speed = speed;
        this.takeDamageMult = takeDamageMult;
    }
}