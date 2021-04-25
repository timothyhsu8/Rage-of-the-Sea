export default class Stats {
    maxHealth: number;
    health: number;
    attack: number;
    attackMult: number;
    defense: number;
    speed: number;
    takeDamageMult: number;

    constructor(maxHealth: number, health: number, attack: number, attackMult: number, defense: number, speed: number, takeDamageMult: number){
        this.maxHealth = maxHealth;
        this.health = health;
        this.attack = attack;
        this.attackMult = attackMult;
        this.defense = defense;
        this.speed = speed;
        this.takeDamageMult = takeDamageMult;
    }
}