// ************************* SETUP *************************
const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight; 

// ************************* GLOBALS *************************
var frameCount = 0;
var blockSize = 60; // size of all general tiles
var level = 0;
var loadTime = 0;

const hitbox = false; // show collision boxes?

// camera positions
var camX;
var camY;

var meelee;

// used to store level data
var levels;

var objects = [players, grounds, ramps, enemys, items, rails];

function maping(value, istart, istop, ostart, ostop) {
    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}

function lerp(val1, val2, amt) {
    return ((val2 - val1) * amt) + val1;
}

function toDegree(value) {
    return (value * Math.PI) / 180;
}

// used to detect collision betwen two objects
function collide(obj1, obj2) {
    return obj1.x - obj2.x < obj2.width && obj2.x - obj1.x < obj1.width && obj1.y - obj2.y < obj2.height && obj2.y - obj1.y < obj1.height;
}

// angular collision
function beamCollide(r, x1, y1, x2, y2) {
    // rectangle center
    var rc = {
        x: r.x + r.w / 2, 
        y: r.y + r.h / 2
    };
    // beam center  
    var lc = {
        x: (x2 - x1) / 2, 
        y: (y2 - y1) / 2
    };
    var slope = (y2 - y1) / (x2 - x1);

    if (rc.y > maping(rc.x, x1, x2, y1, y2)) {
        // colliding corner
        var cc = {
            y: r.y
        }
        cc.x = (slope > 0) ? (r.x + r.w) : (r.x);
        if (cc.y < maping(cc.x, x1, x2, y1, y2)) {
            return maping(cc.x, x1, x2, y1, y2);
        }
    }else {
        // colliding corner
        var cc = {
            y: r.y + r.h
        };
        cc.x = (slope > 0) ? (r.x) : (r.x + r.w);

        if (cc.y > maping(cc.x, x1, x2, y1, y2)) {
            return maping(cc.x, x1, x2, y1, y2) - r.h;
        }
    }

    return false;
};

// store key presses
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
    up: {
        pressed: false
    },
    down: {
        pressed: false
    },
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },
    i: {
        pressed: false
    },
    j: {
        pressed: false
    },
    k: {
        pressed: false
    },
    l: {
        pressed: false
    },
    t: {
        pressed: false
    },
    f: {
        pressed: false
    },
    h: {
        pressed: false
    },
    g: {
        pressed: false
    },
}

function Item(x, y) {
    this.x = x;
    this.y = y;
    this.width = blockSize / 2.8;
    this.height = blockSize;
    this.yVel = -12 - Math.ceil(Math.random() * 10);
    this.shieldType = Math.floor(Math.random() * 2 + 1);
    this.helmetType = Math.floor(Math.random() * 3 + 1);
    this.rotate = 1;
    this.rotationSpeed = 0.05;
    this.xVel = Math.random() * -15 + 7.5;
    this.type = Math.round(Math.random() * 7 + 1);
    this.image = new Image();
    this.sword = 'assets/items/item_sword.png';
    this.spear = 'assets/items/item_spear.png'
    this.bow = 'assets/items/item_bow.png'
    this.shield = 'assets/items/item_shield.png'
    this.shieldRound = 'assets/items/item_shieldRound.png'
    this.helmetKnight = 'assets/items/item_helmet.png';
    this.helmetViking = 'assets/items/item_helmet2.png';
    this.helmetTrojan = 'assets/items/item_helmet3.png';
    this.axe = 'assets/items/item_axe_double.png';
    this.hammer = 'assets/items/item_hammer.png'
    this.dagger = 'assets/items/item_dagger.png'
}
Item.prototype.draw = function() {
    if (hitbox) {
        c.fillStyle = 'blue'
        c.fillRect(this.x, this.y, this.width, this.height)
    }

    switch(this.type) {
        case 1:
            this.image.src = this.sword;
            break;
        case 2:
            this.height = blockSize * 2;
            this.image.src = this.spear;
            break;
        case 3:
            this.image.src = this.bow;
            break;
        case 4:
            if (this.shieldType === 2) { 
                this.image.src = this.shield;
            }else if (this.shieldType === 1) { 
                this.image.src = this.shieldRound;
            }
            break;
        case 5:
            if (this.helmetType === 1) { 
                this.image.src = this.helmetKnight;
            }else if (this.helmetType === 2) { 
                this.image.src = this.helmetViking;
            }else if (this.helmetType === 3) { 
                this.image.src = this.helmetTrojan;
            }
            break;
        case 6:
            this.height = blockSize * 1.5;
            this.image.src = this.hammer;
            break;
        case 7:
            this.image.src = this.axe;
            break;
        case 8:
            this.height = blockSize - 6;
            this.image.src = this.dagger;
            break;
    }
    
    // draw the image
    c.save();
    c.translate(this.x + this.width / 2, this.y)
    c.scale(this.rotate, 1)
    c.drawImage(this.image, - 32, 0);
    c.restore();

    // update position and velocity
    this.yVel += 0.5;
    this.y += this.yVel;
    this.x += this.xVel;

    this.collide(grounds, 0, this.yVel); // y collisions
    this.collide(grounds, this.xVel, 0); // x collision with solid objects
};
Item.prototype.collide = function(obj, xVel, yVel) {
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
                this.xVel = 0;
                this.y = obj[i].y + obj[i].height;
            }
            
            if (yVel > 0) {
                this.yVel = 0;
                this.xVel = 0;
                this.y = obj[i].y - this.height;
                // this.rotate = Math.cos(frameCount * this.rotationSpeed) * 1;
            }
        }
    }
}

function Arrow(x, y, direction) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 10;
    this.angle = 0;
    this.xVel = 20;
    this.yVel = -2;
    this.life = 200;
    this.dead = false;
    this.angleVel = 0;
    this.canCollide = true;
    this.direction = direction;
    this.image = new Image();
    this.image.src = 'assets/items/item_arrow.png'
    this.canHurt = true;
}
Arrow.prototype.draw = function() {
    if (hitbox) {
        c.fillStyle = 'yellow';
        c.fillRect(this.x, this.y, this.width, this.height)
    }

    c.save();
    c.translate(this.x + 16, this.y + 5);
    c.scale(this.direction, 1)
    c.rotate(toDegree(this.angle));
    c.drawImage(this.image, -32, -32);
    c.restore();

    if (this.xVel > 0) {
        this.xVel -= 0.05;
    }
    if (this.canCollide) {
        this.yVel += 0.2;
    }else {
        this.yVel += 0.7;
    }
    this.x += this.xVel * this.direction;
    this.y += this.yVel;

    // collision with player
    for (var i = 0; i < players.length; i ++) {
        let p = players[i];
        if (this.canHurt) {
            if (collide(this, p)) {
                this.xVel = this.direction === 1 ? -2 : -4;
                this.yVel = -2;
                this.canHurt = false;
                this.canCollide = false;
                if (p.hasHelmet || p.hasShield) {
                    p.arrowHitArmor.play();
                }else {
                    p.hit.play();
                }
                if (this.canCollide) {
                    p.takeDamage(10, 5, 5);
                }else {
                    p.takeDamage(17, 3, 5);
                }
                p.xVel = 2 * this.direction;
            }else {
                this.canHurt = true; 
                this.angle = ((this.yVel - this.xVel) * 3) + 60 + this.direction;
            }
        }
    }

    this.collide(grounds, this.xVel, 0);
    this.collide(grounds, 0, this.yVel);

    // update life
    this.life --;
    if (this.life <= 0) {
        this.dead = true;
    }
};
Arrow.prototype.collide = function(obj, xVel, yVel) {
    for (var i = 0; i < obj.length; i ++) {
        if (collide(this, obj[i]) && this.canCollide && obj[i].type !== 24 && obj[i].type !== 2 && obj[i].type !== 4) {
            if (xVel < 0) {
                this.xVel = -3;
            }
            if (xVel > 0) {
                this.xVel = -3;
            }

            if (yVel < 0) {
                this.yVel = 5;
            }
            
            if (yVel >= 0) {
                this.yVel = -8;
            }
            this.canCollide = false;
        }
    }
}

var arrows = [];

var items = [];

// ************************* OBJECTS *************************

// apply keys to objects and define them + image selection algorithim
var loadLevels = function() {
    for (var i = 0; i < levels[level].length; i ++) {
        for (var j = 0; j < levels[level][i].length; j ++) {
            switch(levels[level][i][j]) {
                case '1':
                    players.add(j * blockSize, i * blockSize, blockSize - 21, blockSize, 1);
                    break;
                case '2':
                    players.add(j * blockSize, i * blockSize, blockSize - 21, blockSize, 2);
                    break;
                case '3':
                    players.add(j * blockSize, i * blockSize, blockSize - 21, blockSize, 3);
                    break;
                case '4':
                    players.add(j * blockSize, i * blockSize, blockSize - 21, blockSize, 4);
                    break;
                case 'e':
                    enemys.add(j * blockSize, i * blockSize, blockSize, blockSize);
                    break;
                case '-':
                    grounds.add(j * blockSize, i * blockSize, blockSize, blockSize, 1);
                    break;
                case '^':
                    grounds.add(j * blockSize, i * blockSize, blockSize, blockSize, 5);
                    break;
                case '|':
                    grounds.add(j * blockSize + blockSize / 3, i * blockSize, blockSize / 3, blockSize, 3);
                    break;
                case '_':
                    grounds.add(j * blockSize, i * blockSize, blockSize, blockSize, 12);
                    break;
                case '=':
                    grounds.add(j * blockSize, i * blockSize, blockSize, blockSize, 27);
                    break;
                case ',':
                    rails.add(j * blockSize, i * blockSize, 'fence');
                    break;
                case 'l':
                    rails.add(j * blockSize, i * blockSize, 'ladder');
                    break;
                case 'm':
                    grounds.add(j * blockSize, i * blockSize, blockSize, blockSize, 4);
                    break;
                case 'M':
                    grounds.add(j * blockSize, i * blockSize, blockSize, blockSize, 2);
                    break;
                case 'W':
                    grounds.add(j * blockSize, i * blockSize + blockSize / 2, blockSize, blockSize / 3, 15);
                    break;
                case '!':
                    itemSpawners.add(j * blockSize, i * blockSize, blockSize, blockSize, 1);
                    break;
                case ']':
                    ramps.add(j * blockSize, i * blockSize, blockSize, blockSize, 'left');
                    break;
                case '[':
                    ramps.add(j * blockSize, i * blockSize, blockSize, blockSize, 'right');
                    break;  
            }
        }
    }
};

// create all game objects
function createObjects() {
    rails.create();
    // draw items
    for (var i = 0; i < items.length; i ++ ) {
        items[i].draw();
    }
    enemys.create();
    itemSpawners.create();
    players.create();
    ramps.create();
    grounds.create();
};

// used to delete all objects on maping
objects.delete = function() {
    for (var i = 0; i < objects.length; i ++) {
        for (var j = 0; j < objects[i].length; j ++) {
            objects[i].splice(j, objects[i].length);
        }
    }
};

function meelee(x, y, width, height, damage, kickBackX, kickBackY, isHammer) {
    if (hitbox) {
        c.fillStyle = 'blue';
        c.fillRect(x, y, width, height);
    }

    // collision with player
    for (var i = 0; i < players.length; i++) {
        let p = players[i];
        if (p.x + p.width > x && p.x < x + width && p.y + p.height > y && p.y < y + height) {
            p.takeDamage(damage, kickBackX, -kickBackY)
            if (p.hasShield || p.hasHelmet) {
                p.swordHitArmor.play();
            }else {
                p.hit.play();
            }
        }
    }

    // collision with blocks
    for (var i = 0; i < grounds.length; i++) {
        if (x + width > grounds[i].x && x < grounds[i].x + grounds[i].width && y + height > grounds[i].y && y < grounds[i].y + grounds[i].height) {
            // struckSound.play();
        }
    }
}

// ************************* ANIMATION LOOP *************************
function draw() {
    c.clearRect(0, 0, canvas.width, canvas.height)
    loadTime ++;

    if (loadTime === 1) {
        loadLevels();
    }

    // remove dead enemies
    for (var i = 0; i < enemys.length; i ++) {
        if (enemys.dead) {
            enemys.splice(i, 1);
        }
    }

    c.save(); // save current canvas matrix
    

    // assign camX and camY
    for (var i = 0; i < players.length; i ++) {
        var player = players[i]; // save variable that selects first player spawned
        let camPosX = Math.floor(-(players[i].x + players[(i + 1) % players.length].x + players[(i + 2) % players.length].x + players[(i + 3) % players.length].x) / 3.5); // take the rough average of all player x positions
        let camPosY = Math.floor(-(players[i].y + players[(i + 1) % players.length].y + players[(i + 2) % players.length].y + players[(i + 3) % players.length].y) / 3.5); // take the rough average of all player y positions

        camX = Math.floor(camPosX + canvas.width / 2); // set camera x
        camY = Math.floor(camPosY + canvas.height / 2 + 100); // set camera y
    }

    // CONSTRAIN CAMERA

    // left side
    if ((camX * -1) < 0) {
        camX = 0;
    }
    
    // right side
    for (var i = 0; i < levels[level].length; i ++) {
        if ((camX * -1) > (levels[level][i].length - 1) * blockSize + blockSize - canvas.width) {
            camX = ((levels[level][i].length - 1) * blockSize + blockSize - canvas.width) * -1;
        }
    }

    // top
    if ((camY * -1) + blockSize < 0) {
        camY = 0 + blockSize;
    }
    
    // bottom
    if ((camY * -1) > (levels[level].length - 1) * blockSize - canvas.height) {
        camY = ((levels[level].length - 1) * blockSize - canvas.height) * -1;
    }

    // keep player in screen
    // // left side
    // if (player.x < 0) {
    //     player.x = 0;
    // }
    // // right side
    // for (var i = 0; i < levels[level].length - 2; i ++) {
    //     if (player.x > (levels[level][i].length - 2) * blockSize + blockSize) {
    //         player.x = ((levels[level][i].length - 2) * blockSize + blockSize);
    //     }
    // }

    c.translate(Math.floor(camX), Math.floor(camY)); // translate tile maping by camera positions
    var camSize = 1;
    c.scale(camSize, camSize);

    createObjects(); // call create obj's function

    // draw and remove fx particles
    for (var i = 0; i < effects.length; i ++) {
        effects[i].draw();
        if (effects[i].dead || effects[i].y > levels[level].length * blockSize) {
            effects.splice(i, 1);
        }
    }

    // remove players uppon death
    for (var i = 0; i < players.length; i ++) {
        if (players[i].dead || players[i].y > levels[level].length * blockSize * 1.5) {
            players[i].deathSound.play();
            players.splice(i, 1);
        }
    }

    // remove blocks uppon destruction
    for (var i = 0; i < grounds.length; i ++) {
        if (grounds[i].life <= 0) {
            grounds[i].smash.play();
            effects.push(new Brick(grounds[i].x, grounds[i].y))
            effects.push(new Brick(grounds[i].x, grounds[i].y))
            effects.push(new Brick(grounds[i].x, grounds[i].y))
            effects.push(new Brick(grounds[i].x, grounds[i].y))
            effects.push(new Brick(grounds[i].x, grounds[i].y))
            grounds.splice(i, 1);
        }
    }

    // draw && remove dead arrows
    for (var i = 0; i < arrows.length; i ++) {
        let a = arrows[i];
        a.draw();
        if (a.dead) {
            arrows.splice(i, 1);
        }
    }

    c.restore(); // reset saved canvas matrix

    // fake frame rate        
    frameCount = (frameCount + 1) % 60;

    requestAnimationFrame(draw);
}
 
draw();