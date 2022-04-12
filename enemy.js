var enemys = [];

var Enemy = function(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.xVel = 0;
    this.yVel = 0;
    this.acceleration = 0.4;
    this.moveToLeft = true;
    this.direction = -1;
    this.gravity = 0.5;
    this.life = 3;
    this.dead = false;
    this.maxSpeed = 3;
    this.index = 0;
    this.loopSpeed = 4;
    this.img = new Image();
    this.img.src = 'assets/fox.png'
    this.imgWidth = 13;
    this.imgHeight = 16;
    this.scaledSize = 3;
};
Enemy.prototype.update = function() {
    if (!this.dead) {
        if (this.moveToLeft) {
            this.direction = -1;
            this.xVel -= this.acceleration;
        }else if (!this.moveToLeft) {
            this.direction = 1;
            this.xVel += this.acceleration;
        }
        if (frameCount % this.loopSpeed === 0) {
            this.index = (this.index + 1) % 4;
        }

        if (this.xVel > this.maxSpeed) {
            this.xVel = this.maxSpeed;
        }else if (this.xVel < -this.maxSpeed) {
            this.xVel = -this.maxSpeed;
        }

        this.x += this.xVel; // update x by x velocity
        this.collide(grounds, this.xVel, 0); // x collision with solid objects

        // check for collision with player[s]
        for (var i = 0; i < players.length; i ++) {
            if (collide(this, players[i]) && !players[i].dead) {    
                if (!players[i].attacking) {
                    players[i].yVel = -7;
                }
                if (players[i].attacking) {
                    if (players[i].index === 2) {
                        this.life --;
                    }
                }
            }
        }
    }
    if (this.life <= 0) {
        this.dead = true;
    }
    this.y += this.yVel; // update y by y velocity
    this.yVel += this.gravity; // update y velocity by gravity
    this.collide(grounds, 0, this.yVel);
};
Enemy.prototype.collide = function(obj, xVel, yVel) {
    for (var i = 0; i < obj.length; i ++) {
        if (collide(this, obj[i]) && this.dead === false) {
            if (xVel < 0) {
                this.xVel = 0;
                this.x = obj[i].x + obj[i].width;
                this.moveToLeft = false;
                this.yVel = -3;
            }
            if (xVel > 0) {
                this.xVel = 0;
                this.x = obj[i].x - this.width;
                this.moveToLeft = true;
                this.yVel = -3;
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
};
Enemy.prototype.draw = function() {
    c.fillStyle = 'pink';
    c.fillRect(this.x, this.y, this.width, this.height);
};

enemys.add = function(x, y, w, h) {
    this.push(new Enemy(x, y, w, h));
};
enemys.create = function() {
    for (var i = 0; i < this.length; i ++) {
        this[i].update();
        this[i].draw();
    }
};