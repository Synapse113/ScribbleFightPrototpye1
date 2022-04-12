var players = [];

var Player = function(x, y, width, height, type) {
    this.x = x; // x position
    this.y = y; // y position
    this.width = width; // width
    this.height = height; // height
    this.xVel = 0; // x velocity
    this.yVel = 0; // y velocity
    this.type = type; // player type (ie. player 1, 2, .etc)
    this.angle = 0;
    this.hp = 100; // life
    this.acceleration = 0.7; // x acceleration
    this.friction = 0.95;
    this.weapon = 'sword';
    this.shieldType = 0;
    this.hasShield = false;
    this.hasHelmet = false;
    this.ammo = 0;
    this.wasHit = 0;
    this.maxSpeed = 8; // maximum x speed
    this.gravity = 1; // gravity
    this.jumpHeight = 17.5; // max jump height (higher number, the higher the player can jump)
    this.canJump = false; // determines whether the player can jump at a certain instance
    this.dead = false; // determines whether the player is dead or not
    this.direction = 1; // direction player is facing (1 || -1 ONLY)
    this.image = new Image();
    this.armImage = new Image();
    this.roundRed = 'assets/players/character_roundRed.png';
    this.roundGreen = 'assets/players/character_roundGreen.png';
    this.roundPurple = 'assets/players/character_roundPurple.png';
    this.roundYellow = 'assets/players/character_roundYellow.png';
    this.takeDamageImage = 'assets/players/character_roundTakeDamage.png'
    this.handRed = 'assets/players/character_handRed.png';
    this.handGreen = 'assets/players/character_handGreen.png';
    this.handPurple = 'assets/players/character_handPurple.png';
    this.handYellow = 'assets/players/character_handYellow.png';
    this.handtakeDamage = 'assets/players/character_handTakeDamage.png';
    this.itemImage = new Image();
    this.helmetHp = 50;
    this.shieldHp = 70;
    this.sword = 'assets/items/item_sword.png';
    this.spear = 'assets/items/item_spear.png';
    this.bow = 'assets/items/item_bow.png';
    this.axe = 'assets/items/item_axe.png';
    this.doubleAxe = 'assets/items/item_axe_double.png';
    this.dagger = 'assets/items/item_dagger.png';
    this.hammer = 'assets/items/item_hammer.png';
    this.shield = new Image();
    this.helmet = new Image();
    this.helmetKnight = 'assets/items/item_helmet.png';
    this.helmetViking = 'assets/items/item_helmet2.png';
    this.helmetTrojan = 'assets/items/item_helmet3.png';
    this.shieldImage = 'assets/items/item_shield.png';
    this.shieldRoundImage = 'assets/items/item_shieldRound.png';
    this.arrowImage = new Image();
    this.arrowImage.src = 'assets/items/item_arrow.png';
    this.slashImage = new Image();
    this.slashImage.src = 'assets/effects/effect_trail.png';
    this.swordHit1 = new Audio();
    this.swordHit1.src = 'assets/audio/sfx/swordHit.wav';
    this.swordHit2 = new Audio();
    this.swordHit2.src = 'assets/audio/sfx/swordHit2.wav';
    this.spearHit = new Audio();
    this.spearHit.src = 'assets/audio/sfx/spearHit.wav';
    this.bowDraw = new Audio();
    this.bowDraw.src = 'assets/audio/sfx/bowDraw.wav';
    this.bowRelease = new Audio();
    this.bowRelease.src = 'assets/audio/sfx/bowRelease.wav';
    this.collectPower = new Audio();
    this.collectPower.src = 'assets/audio/sfx/collectPower.wav';
    this.swordHitArmor = new Audio();
    this.swordHitArmor.src = 'assets/audio/sfx/swordHitArmor.wav';
    this.arrowHitArmor = new Audio();
    this.arrowHitArmor.src = 'assets/audio/sfx/arrowStrikeArmor.wav';
    this.hit = new Audio();
    this.hit.src = 'assets/audio/sfx/playerHit.wav';
    this.hitBlock = new Audio();
    this.hitBlock.src = 'assets/audio/sfx/smash.mp3'
    this.deathSound = new Audio();
    this.deathSound.src = 'assets/audio/sfx/death.wav'
    this.hammerSwing = new Audio();
    this.hammerSwing.src = 'assets/audio/sfx/hammerSwing.wav'
    this.keys = [];
    this.armAngle = 0;
    this.armAngle2 = 0;
    this.handX1 = -2;
    this.handX2 = -58;
    this.handY1 = 5;
    this.handY2 = 5;
    this.handRadius = 15;
    this.reload = 0;
    this.coolOff = 1;
    this.spearX = 0;
    this.dashTime = 0;
    this.stunTime = 0;
    this.stamina = 100;
    this.canAttack = true;
    this.jumpCount = 0;
};
Player.prototype.update = function() {
    // change key codes based off of type
    switch (this.type) {
        case 1:
            this.keys = [keys.up, keys.left, keys.right, keys.down];
            break;
        case 2:
            this.keys = [keys.w, keys.a, keys.d, keys.s];
            break;
        case 3:
            this.keys = [keys.i, keys.j, keys.l, keys.k];
            break;
        case 4:
            this.keys = [keys.t, keys.f, keys.h, keys.g];
            break;
    }

    if (!this.dead) {
        if (this.keys[1].pressed) {
            this.xVel *= 0.95; // slow the player down a bit
            this.direction = -1;
            if (this.xVel > -this.maxSpeed) {
                this.xVel -= this.acceleration;
            }
        }else if (this.keys[2].pressed) {
            this.xVel *= 0.95; // slow the player down a bit
            this.direction = 1;
            if (this.xVel < this.maxSpeed) {
                this.xVel += this.acceleration
            }
        }else { 
            this.xVel *= 0.7;
            if (this.xVel > -0.0005 && this.xVel < 0.0005) {
                this.xVel = 0;
            }
        }

        // jump
        if (this.keys[0].pressed && this.canJump) {
            this.yVel = -this.jumpHeight;
            this.canJump = false;
        }


        let hx = this.x + this.handX1 + 45;
        let hy = this.y + this.handY1 + 25;

        this.angle = ((this.xVel * this.direction) / 60) + (-this.yVel / 350); // update angle based on x velocity

        this.x += this.xVel; // update x by x velocity
        this.collide(grounds, this.xVel, 0); // y collisions
    }
    
    if (this.hp <= 0) {
        this.dead = true;
    }  
    this.reload--;

    if (this.stamina <= 0) {
        this.stamina = 0;
        this.canAttack = false;
    }
    if (this.stamina >= 100) {
        this.stamina = 100;
    }
    if (!this.canAttack) {
        if (this.stamina >= 100) {
            this.canAttack = true;
        }
    }

    // attack (meelee)
    if (this.weapon === 'sword') {
        if (this.keys[3].pressed && this.canAttack) {
            this.stamina--;
            if (this.armAngle < toDegree(100)) {
                this.reload = 8;
                this.armAngle = lerp(this.armAngle, toDegree(100), 0.5)
                this.handX2 = lerp(this.handX2, -50, 0.5)
                this.swordHit1.play(); 
            }

            if (this.handY1 < 20) {
                this.handY1 = lerp(this.handY1, 20, 0.5)
                this.attackX = this.x + (this.handX1 + 58) * this.direction; 
                this.attackY = this.y + this.handY1 + 10; 
            }else {
                this.swordHit1.play(); 
            }

            if (this.armAngle < toDegree(90)) {
                c.save();
                c.translate(this.x + this.handX1 + 28, this.y - 10);
                c.scale(this.direction, 1)
                c.drawImage(this.slashImage, -45, 0)
                c.restore();
                meelee(this.attackX, this.attackY, 30, 30, 5, 5 * this.direction, 2, false); // call a new hitbox on weapon
            }

            if (this.armAngle >= toDegree(99.9)) {
                this.armAngle = lerp(this.armAngle, 0, 0.8);
                this.handY1 = lerp(this.handY1, 5, 0.5);
                this.handX1 = lerp(this.handX1, -2, 0.5);
            }
            this.handX2 = lerp(this.handX2, -58, 0.3);
            this.handY2 = lerp(this.handY2, 5, 0.3);
            this.handY1 = lerp(this.handY1, 5, 0.3);
            this.handX1 = lerp(this.handX1, -2, 0.3);
            
        }else {
            this.armAngle = lerp(this.armAngle, 0, 0.5);
            this.handX2 = lerp(this.handX2, -58, 0.3);
            this.handY2 = lerp(this.handY2, 5, 0.3);
            this.handY1 = lerp(this.handY1, 5, 0.3);
            this.handX1 = lerp(this.handX1, -2, 0.3);
            this.stamina += 0.5;
        }
    }else if (this.weapon === 'spear') {
        if (this.keys[3].pressed && this.armAngle >= toDegree(9) && this.canAttack) {
            this.stamina -= 2;
            this.handX1 = 10;

            if (this.armAngle < toDegree(80)) {
                this.spearHit.play();
                this.armAngle += toDegree(13.5)
            }

            if (this.handY1 < 10) {
                this.angle = toDegree(10)
                if (this.dashTime >= 10) {
                    this.xVel = 25 * this.direction;
                    this.dashTime = 0;
                }
                this.handY1 += 12;
                if (this.handX2 > this.handX1 - 50) {
                    this.handX2 -= 10;
                }
            }
            
            this.attackX = this.x + 60 * this.direction; 
            this.attackY = this.y + 35; 

            if (this.handY1 < 5) {
                meelee(this.attackX -15 * this.direction, this.attackY - 50, 45, 30, 5, 25 * this.direction, 10, false); // call a new hitbox on weapon
            }else {
                meelee(this.attackX, this.attackY, 45, 20, 10, 25 * this.direction, 10, false); // call a new hitbox on weapon
            }

            this.spearX = (this.spearX + 1) % 20;

        }else {
            this.armAngle = lerp(this.armAngle, toDegree(10), 0.5);
            this.handX2 = lerp(this.handX1, -40, 0.3);
            this.handY2 = lerp(this.handY2, 20, 0.3);
            this.handY1 = lerp(this.handY1, -30, 0.3);
            this.handX1 = lerp(this.handX1, -5, 0.3);
            if (this.dashTime < 10) {
                this.dashTime ++;
            }
            this.stamina += 0.5;
        }
    
    }else if (this.weapon === 'bow') {
        if (this.keys[3].pressed && this.canAttack) {
            if (this.reload < 0) {
                this.reload = 0;
            }
            this.reload += 2;
            if (this.handX2 > -30) {
                this.bowDraw.play();
                this.handX2 -= 2;
            }
            if (this.handX1 < 12) {
                this.handX1 += 1;
            }
        }else {
            if (this.reload >= 15 && this.ammo > 0) {
                this.bowRelease.play();
                arrows.push(new Arrow(this.x + 20 * this.direction, this.y + this.handY2 * 2.9, this.direction))
                this.stamina -= 10;
                this.ammo --;
                this.reload = 0;
            }else {
                this.stamina += 0.5;
            }

            this.handY1 = lerp(this.handY1, 10, 0.5)
            this.handX1 = lerp(this.handX1, 5, 1)
            this.handY2 = lerp(this.handY2, this.handY1 + 2, 0.5)
            this.handX2 = lerp(this.handX2, -10, 0.8)
            this.armAngle = lerp(this.armAngle, 0, 0.8);
        }
        if (this.ammo <= 0) {
            this.handX1 = -2;
            this.handX2 = -58;
            this.handY1 = 5;
            this.handY2 = 5;
            this.weapon = 'none';
        }
    }else if (this.weapon === 'hammer') {
        if (this.keys[3].pressed && this.coolOff < 0 && this.canAttack) {
            this.hammerSwing.play();
            if (this.armAngle < toDegree(80)) {
                this.armAngle += toDegree(20);
            }
            if (this.handY1 < 20) {
                this.yVel = 20;
                this.handY1 += 5;
                this.handY2 += 5;
                this.handX2 = this.handX1 - 7;
                this.reload = 8;
                this.stamina -= 7;
                this.attackX = this.x + ((this.handX1 + 55) + 28) * this.direction; 
                this.attackY = this.y + this.handY1 - 15; 

                for (var i = 0; i < grounds.length; i++) {
                    let g = grounds[i];
                    if (this.attackX + 54 > g.x && this.attackX < g.x + g.width && this.attackY + 45 > g.y && this.attackY < g.y + g.height) {
                        g.life -= 0.3;
                        g.twitch += Math.random() * -2 + 1;
                        this.hitBlock.play();
                    }
                }

                meelee(this.attackX, this.attackY, 35, 45, 5, 5 * this.direction, 2, true); // call a new hitbox on weapon                
            }else {
                this.coolOff = 50; 
            }
        }else {
            this.stamina += 0.5;
            this.armAngle = lerp(this.armAngle, toDegree(-20), 0.1);
            this.handY1 = lerp(this.handY1, -15, 0.1)
            this.handY2 = lerp(this.handY2, this.handY1 + 7, 0.1)
            this.handX1 = lerp(this.handX1, -2, 0.1)
            this.handX2 = lerp(this.handX2, this.handX1 - 7, 0.1)
        }
    }else if (this.weapon === 'axe') {
        if (this.keys[3].pressed && this.coolOff < 0 && this.canAttack) {
            this.stamina -= 5;
            this.hammerSwing.play();
            this.armAngle = lerp(this.armAngle, toDegree(70), 0.5)
            if (this.handY1 < 20) {
                this.handY2 = lerp(this.handY2, 0, 0.5);
                this.handY1 = lerp(this.handY1, 25, 0.5);
                this.handX1 = lerp(this.handX1, 3, 0.5);
                this.handX2 = lerp(this.handX2, -60, 0.5);
                this.attackX = this.x + ((this.handX1 + 55) + 15) * this.direction; 
                this.attackY = this.y + this.handY1 - 15; 

                meelee(this.attackX, this.attackY, 35, 45, 7, 5 * this.direction, 2, true); // call a new hitbox on weapon                
            }else {
                this.coolOff = 20;
            }
        }else {
            this.stamina += 0.5;
            this.armAngle = lerp(this.armAngle, toDegree(-20), 0.2);
            this.handY2 = lerp(this.handY2, 10, 0.2)
            this.handY1 = lerp(this.handY1, 0, 0.2)
            this.handX2 = lerp(this.handX2, -2, 0.2)
            this.handX1 = lerp(this.handX1, -60, 0.2)
        }
    }else if (this.weapon === 'dagger') {
        if (this.keys[3].pressed && this.canAttack) {
            this.stamina -= 1.5;
            if (this.armAngle < toDegree(100)) {
                this.reload = 8;
                this.armAngle = lerp(this.armAngle, toDegree(100), 0.5)
                this.swordHit1.play(); 
            }

            if (this.handY1 < 20) {
                this.handY1 = lerp(this.handY1, 20, 0.5)
                this.attackX = this.x + 10 + (this.handX1 + 55) * this.direction; 
                this.attackY = this.y + this.handY1 + 15; 
            }else {
                this.swordHit1.play(); 
            }

            if (this.armAngle < toDegree(90)) {
                meelee(this.attackX, this.attackY, 30, 30, 5, (Math.random() * 20) * this.direction, 0, false); // call a new hitbox on weapon
                this.swordHit1.play(); 
            }else {
                this.handY1 = lerp(this.handY1, -20, 0.3);
                this.handX1 = lerp(this.handX1, -20, 0.5);
                this.handX2 = lerp(this.handX2, -10, 0.5)
                this.handY2 = lerp(this.handY2, 10, 0.5)
                this.armAngle2 = lerp(this.armAngle2, toDegree(100), 0.5)
            }

            if (this.armAngle2 >= toDegree(90.9)) {
                this.armAngle = lerp(this.armAngle, 0, 0.5);
                this.armAngle2 = lerp(this.armAngle2, 0, 0.5)
                this.handX2 = lerp(this.handX2, -58, 0.3);
                this.handY2 = lerp(this.handY2, 5, 0.3);
                this.handY1 = lerp(this.handY1, 5, 0.3);
                this.handX1 = lerp(this.handX1, -2, 0.3);
            }
            
        }else {
            this.stamina += 0.5;
            this.armAngle = lerp(this.armAngle, toDegree(10), 0.5);
            this.armAngle2 = lerp(this.armAngle2, toDegree(80), 0.9); 
            this.handY1 = lerp(this.handY1, 10, 0.5);
            this.handX1 = lerp(this.handX1, -6, 0.5);
            this.handY2 = lerp(this.handY2, 15, 0.5)
            this.handX2 = lerp(this.handX2, -50, 0.4)
        }
    }

    if (this.shieldHp <= 0) {
        this.hasShield = false;
    }

    if (this.helmetHp <= 0) {
        this.hasHelmet = false;
    }

    // reload life when player is not attacked for an extended period of time
    if (this.wasHit < -200 && this.hp < 100) {
        this.hp ++;
    }

    this.y += this.yVel; //update y by y velocity
    this.collide(grounds, 0, this.yVel); // y collisions
    this.yVel += this.gravity; // update y velocity by gravity

    if (this.yVel > 1) {
        this.canJump = false;
    }

    this.coolOff--;
};
Player.prototype.collide = function(obj, xVel, yVel) {
    // collision with blocks
    for (var i = 0; i < obj.length; i ++) {
        if (collide(this, obj[i]) && obj[i].type !== 24 && obj[i].type !== 2 && obj[i].type !== 4) {
            if (xVel < 0) {
                this.xVel = 0;
                this.x = obj[i].x + obj[i].width;
            }
            if (xVel > 0) {
                this.xVel = 0;
                this.x = obj[i].x - this.width;
            }

            if (yVel < 0) {
                this.yVel = 0;
                this.canJump = false;
                this.y = obj[i].y + obj[i].height;
            }
            
            if (yVel > 0) {
                this.yVel = 0;
                this.canJump = true;
                this.y = obj[i].y - this.height;
            }
        }
    }
    // collision with ramps
    for (var i = 0; i < ramps.length; i++) {
        var r = ramps[i];
        
        if (this.x + this.width > r.x && this.x < r.x + r.w && this.y + this.height > r.y && this.y < r.y + r.h) {
            // if (ramps[i].type === 'left') {
            //     var y = beamCollide(this, r.x + 3, r.y + 2.6, r.x + 3 + r.w, r.y + r.h);
            //     if (y) {
            //         this.canJump = true;
            //         this.y = y;
            //         this.yVel = 0;
            //     }
            // }else if (ramps[i].type === 'right') {
            //     var y = beamCollide(this, r.x + r.w, r.y, r.x, r.y + r.h);
    
            //     if (y) {
            //         this.canJump = true;
            //         this.y = y;
            //         this.yVel = 0;
            //     }
            // }
            var y = beamCollide(this, r.x + r.w, r.y, r.x, r.y + r.h);
    
            if (y) {
                this.canJump = true;
                this.y = y;
                this.yVel = 0;
            }
        }
        
    }
    // collision with items
    for (var i = 0; i < items.length; i ++) {
        if (collide(this, items[i]) && !this.dead) {
            if (items[i].type === 1) {
                this.collectPower.play();
                this.weapon = 'sword'
            }else if (items[i].type === 2) {
                this.collectPower.play();
                this.weapon = 'spear'
            }else if (items[i].type === 3) {
                this.collectPower.play();
                this.weapon = 'bow'
                this.ammo = 13;
            }else if (items[i].type === 4) {
                this.collectPower.play();
                this.hasShield = true;
                this.shieldHp = 70;
                if (items[i].shieldType === 2) {
                    this.shield.src = this.shieldImage;
                }else if (items[i].shieldType === 1) {
                    this.shield.src = this.shieldRoundImage;
                }
            }else if (items[i].type === 5) {
                this.collectPower.play();
                this.hasHelmet = true;
                this.helmetHp = 50;
                if (items[i].helmetType === 1) {
                    this.helmet.src = this.helmetKnight;
                }else if (items[i].helmetType === 2) {
                    this.helmet.src = this.helmetViking;
                }else if (items[i].helmetType === 3) {
                    this.helmet.src = this.helmetTrojan;
                }
            }else if (items[i].type === 6) {
                this.collectPower.play();
                this.weapon = 'hammer';
            }else if (items[i].type === 7) {
                this.collectPower.play();
                this.weapon = 'axe';
            }else if (items[i].type === 8) {
                this.collectPower.play();
                this.weapon = 'dagger';
            }
            items.splice(i, 1);
        }
    }
};
Player.prototype.takeDamage = function(damage, kickBackX, kickBackY) {
    if (this.hasShield) {
        this.shieldHp -= damage;
        
    }else if (this.hasHelmet) {
        this.helmetHp -= damage;
    }else {
        this.hp -= damage;
    }
    this.xVel = kickBackX;
    this.yVel = kickBackY;
    this.wasHit = 5;
}; 
Player.prototype.draw = function() {
    if (hitbox) {
        c.fillStyle = 'green';
        c.fillRect(this.x, this.y, this.width, this.height)
    }

    // change image based off of type
    switch (this.type) {
        case 1:
            this.armImage.src = this.handRed;
            this.image.src = this.roundRed;
            break;
        case 2:
            this.armImage.src = this.handGreen;
            this.image.src = this.roundGreen;
            break;
        case 3:
            this.armImage.src = this.handPurple;
            this.image.src = this.roundPurple;
            break;
        case 4:
            this.armImage.src = this.handYellow;
            this.image.src = this.roundYellow;
            break;
    }

    // lifebar
    switch (this.type) {
        case 1:
            c.fillStyle = 'rgb(255, 92, 101)'
            break;
        case 2:
            c.fillStyle = 'rgb(55, 217, 140)'
            break;
        case 3:
            c.fillStyle = 'rgb(145, 121, 255)'
            break;
        case 4:
            c.fillStyle = 'rgb(255, 182, 0)'
            break;
    }

    c.fillRect(this.x + 20 - (this.hp / 1.5) / 2, this.y - 15, this.hp / 1.5, 5); // draw lifebar

    if (this.stamina < 100) {
        c.fillRect(this.x + 20 - (this.stamina / 1.5) / 2, this.y - 25, this.stamina / 1.5, 5); // stamina bar
    }

    if (this.weapon === 'sword') {
        this.itemImage.src = this.sword;
        // weapons
        c.save();
        c.translate(this.x + ((this.handX1 - (this.xVel * this.direction) * 1.6) + 53) * this.direction + (this.direction === -1 ? 42 : 0), this.y + (this.handY1 - (this.yVel / 2)) + 30)
        c.scale(this.direction, 1);
        c.rotate(this.armAngle);
        c.drawImage(this.itemImage, -32, -50);
        c.restore();
    }

    this.wasHit --;

    if (this.wasHit > 0 && !this.hasShield && !this.hasHelmet) {
        this.image.src = this.takeDamageImage;
        this.armImage.src = this.handtakeDamage;
    }
    
    // // shield
    // if (this.hasShield && this.weapon !== 'sword' && this.weapon !== 'axe') {
    //     c.save();
    //     c.translate(this.x + 21, this.y);
    //     c.scale(this.direction, 1);
        // c.drawImage(this.shield, this.handX1 - (this.xVel * this.direction) * 1, this.handY1 - (this.yVel)); // back arm
    //     c.restore();
    // }

    // hand (back)
    c.save();
    c.translate(this.x + 21, this.y);
    c.scale(this.direction, 1);
    c.drawImage(this.armImage, this.handX1 +  - (this.xVel * this.direction) * 1.6, this.handY1 - (this.yVel / 2)); // front arm
    c.restore();

    if (this.weapon === 'dagger') {
        this.itemImage.src = this.dagger;
        // weapons
        c.save();
        c.translate(this.x + ((this.handX1 - (this.xVel * this.direction) * 1.6) + 53) * this.direction + (this.direction === -1 ? 42 : 0), this.y + (this.handY1 - (this.yVel / 2)) + 36)
        c.scale(this.direction, 1);
        c.rotate(this.armAngle);
        c.drawImage(this.itemImage, -32, -50);
        c.restore();
    }else if (this.weapon === 'hammer') {
        this.itemImage.src = this.hammer;
        // weapons
        c.save();
        c.translate(this.x + ((this.handX1 - (this.xVel * this.direction) * 1.6) + 53) * this.direction + (this.direction === -1 ? 42 : 0), this.y + (this.handY1 - (this.yVel / 2)) + 30)
        c.scale(this.direction, 1);
        c.rotate(this.armAngle);
        c.drawImage(this.itemImage, -32, -70);
        c.restore();
    }else if (this.weapon === 'axe') { 
        this.itemImage.src = this.doubleAxe;
        // weapons
        c.save();
        c.translate(this.x + ((this.handX1 - (this.xVel * this.direction) * 1.6) + 53) * this.direction + (this.direction === -1 ? 42 : 0), this.y + (this.handY1 - (this.yVel / 2)) + 36)
        c.scale(this.direction, 1);
        c.rotate(this.armAngle);
        c.drawImage(this.itemImage, -23.5, -50);
        c.restore();
    }
    
    // body
    c.save();
    c.translate(this.x + 21, this.y);
    c.scale(this.direction, 1);
    c.rotate(this.angle);
    if (this.hasShield && this.weapon !== 'sword' && this.weapon !== 'axe') {
        c.drawImage(this.shield, -40, 0);
    }
    c.drawImage(this.image, -31, 0);
    if (this.hasHelmet) {
        c.drawImage(this.helmet, -31, -20);
    }
    c.restore();

    if (this.weapon === 'spear') {
        this.itemImage.src = this.spear;
        // weapons
        c.save();
        c.translate(this.x + ((this.handX1 - (this.xVel * this.direction) * 1.6) + 53) * this.direction + (this.direction === -1 ? 42 : 0), this.y + (this.handY1 - (this.yVel / 2)) + 30)
        c.scale(this.direction, 1);
        c.rotate(this.armAngle);
        c.drawImage(this.itemImage, -32, -50);
        c.restore();
    }else if (this.weapon === 'bow') {
        this.itemImage.src = this.bow;
        // weapons
        c.save();
        c.translate(this.x + ((this.handX1 - (this.xVel * this.direction) * 1.6) + 49) * this.direction + (this.direction === -1 ? 42 : 0), this.y + (this.handY1 - (this.yVel / 2)) + 47)
        c.scale(this.direction, 1);
        c.rotate(this.armAngle);
        c.drawImage(this.itemImage, -32, -50);
        if (this.handX1 !== 5) { 
            c.drawImage(this.arrowImage, this.handX2 - 15, - 48);
        }
        c.restore();
    }else if (this.weapon === 'dagger') {
        this.itemImage.src = this.dagger;
        c.save();
        c.translate(this.x + ((this.handX2 - (this.xVel * this.direction) * 1.6) + 53) * this.direction + (this.direction === -1 ? 42 : 0), this.y + (this.handY2 - (this.yVel)) + 36)
        c.scale(this.direction, 1);
        c.rotate(this.armAngle2);
        c.drawImage(this.itemImage, -32, -50);
        c.restore();
    }
    
    // hand (front)
    c.save();
    c.translate(this.x + 21, this.y);
    c.scale(this.direction, 1);
    c.drawImage(this.armImage, this.handX2 - (this.xVel * this.direction) * 1, this.handY2 - (this.yVel)); // back arm
    c.restore();

    // shield
    if (this.hasShield && this.weapon === 'sword' || this.weapon === 'axe') {
        c.save();
        c.translate(this.x + 21, this.y);
        c.scale(this.direction, 1);
        c.drawImage(this.shield, this.handX2 - (this.xVel * this.direction) * 1, this.handY2 - (this.yVel)); // back arm
        c.restore();
    }
};

players.add = function(x, y, w, h, t) {
    this.push(new Player(x, y, w, h, t));
};
players.create = function() {
    for (var i = 0; i < this.length; i ++) {
        this[i].update();
        this[i].draw();
    }
};