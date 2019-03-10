import HostileEntity from "../HostileEnemy.js";
import BoundingBox from "../BoundingBox.js";
import Animation from "../Animation.js";

class Sorcerer extends HostileEntity {
    constructor(game, x, y) {
        super(game, x, y);
        this.boundingBox = new BoundingBox(x, y, 20, 60, 35, 30);
        this.standingAttackAnimation = new Animation(this.game.assetManager.getAsset("./assets/sprites/sorcererVillain.png"), 0, 0, 100, 100, 0.1, 10, true, false);
        this.death = null;
        this.animation = this.standingAttackAnimation;
        this.moveSpeed = 70;
        this.fleeSpeed = 90;
        this.attackSpeed = 3;
        this.attackInterval = 0.6;
        this.cooldown = 0;
        this.special = 4;
        this.dangerRange = 50;
        this.fleeRange = 100;
        this.startAttackRange = 80;
        this.stopAttackRange = 300;
        this.startFollowRange = 150;
        this.stopFollowRange = 350;
        this.maxHealth = 200;
        this.health = 200;
    }

    update() {
        let player = this.game.levelManager.level.getEntityWithTag("Player");

        if (this.cooldown > 0) this.cooldown -= this.game.clockTick;
        if (this.special > 0) this.cooldown -= this.game.clockTick;
        let canMove = false;
        let xOrigC = (player.x + player.animation.frameWidth / 2);
        let yOrigC = (player.y + player.animation.frameHeight / 2);
        let xOrigS = (this.x + this.animation.frameWidth / 2)
        let yOrigS = (this.y + this.animation.frameHeight / 2)
        let xDiff = xOrigC - xOrigS;
        let yDiff = yOrigC - yOrigS;
        let distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
        let origX = this.x;
        let origY = this.y;

        if (!this.alive) {
            if (this.death && this.animation == this.death) {
                this.life -= this.game.clockTick;
                if (this.life <= 0) this.destroyed = true;
            } else {
                this.destroyed = true;
            }

            return;
        }

        if (distance < this.fleeRange) {
            let velX = (this.fleeSpeed * xDiff) / distance;
            let velY = (this.fleeSpeed * yDiff) / distance;

            this.x -= this.game.clockTick * velX;
            this.y -= this.game.clockTick * velY;

            if (distance < this.dangerRange) this.specialAttack(xDiff, yDiff, distance, xOrigS, yOrigS);
        } else if (this.startAttackRange <= distance && distance <= this.stopAttackRange) {
            this.attack(xDiff, yDiff, distance, xOrigS, yOrigS);
        }

        if (this.startFollowRange <= distance && distance <= this.stopFollowRange) {
            let velX = (this.moveSpeed * xDiff) / distance;
            let velY = (this.moveSpeed * yDiff) / distance;

            this.x += this.game.clockTick * velX;
            this.y += this.game.clockTick * velY;

        }

        if (!this.game.levelManager.level.hasCollidedWithWalls(this)) {
            canMove = true
        }

        if (!canMove) {
            this.x = origX;
            this.y = origY;
        }

        super.update();
    }

    attack(xDiff, yDiff, distance, xOrigS, yOrigS) {
        if (this.special <= 0) {
            this.specialAttack(xDiff, yDiff, distance, xOrigS, yOrigS);
        } else if (this.cooldown <= 0) {
            this.normalAttack(xDiff, yDiff, distance, xOrigS, yOrigS);
        }
    }

    normalAttack(xDiff, yDiff, distance, xOrigS, yOrigS) {
        let velX = (this.attackSpeed * xDiff) / distance;
        let velY = (this.attackSpeed * yDiff) / distance;

        let projectile = new Projectile(
            xOrigS,
            yOrigS,
            velX,
            velY);
        this.game.levelManager.level.addEntity(projectile);
        this.cooldown = this.attackInterval;
    }

    specialAttack(xDiff, yDiff, distance, xOrigS, yOrigS) {
    }

    draw(ctx) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);

        super.draw(ctx);
    }
}

export default Sorcerer;