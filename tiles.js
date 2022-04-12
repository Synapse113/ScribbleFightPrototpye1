var grounds = [];
var rails = [];
var ramps = [];
var itemSpawners = [];

var Ground = function(x, y, width, height, type) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.twitch = 0;
    this.life = 5;
    this.type = type;
    this.scaledSize = 3;
    this.elevatorY = 0;
    this.image = new Image();
    this.image.src = 'assets/blocks/spritesheet.png'
    this.smash = new Audio();
    this.smash.src = 'assets/audio/sfx/blockDestroyed.wav'
};  
Ground.prototype.draw = function() {
    if (hitbox) {
        c.fillStyle = 'red';
        c.fillRect(this.x, this.y, this.width, this.height)
    }
    
    if (this.life > 0) {
        c.save();
        c.translate(this.x - (this.type === 3 ? blockSize / 3 : 0), this.y - (this.type === 15 ? blockSize / 2 : 0));
        c.drawImage(this.image, this.type * 64, 0, 64, 64, this.twitch, 0, 64, 64)
        c.restore();
    }

    this.twitch *= 0.7;
};

grounds.add = function(x, y, w, h, t) {
    this.push(new Ground(x, y, w, h, t));
};
grounds.create = function() {
    for (var i = 0; i < this.length; i ++) {
        this[i].draw();
    }
};

var Rail = function(x, y, type) {
    this.x = x;
    this.y = y;
    this.width = blockSize;
    this.height = blockSize;
    this.type = type;
    this.scaledSize = 3;
    this.image = new Image();
};  
Rail.prototype.draw = function() {
    if (hitbox) {
        c.fillStyle = 'red';
        c.fillRect(this.x, this.y, this.width, this.height)
    }

    if (this.type === 'fence') {
        this.image.src = 'assets/blocks/tile_fence.png'
    }else if (this.type === 'ladder') {
        this.image.src = 'assets/blocks/tile_ladder.png'
    }
    
    c.save();
    c.translate(this.x, this.y);
    c.drawImage(this.image, 0, 0)
    c.restore();

    for (var i = 0; i < players.length; i ++) {
        if (collide(this, players[i]) && this.type === 'ladder') {
            if (players[i].keys[0].pressed) {
                players[i].yVel = -5;
            }
        }
    }
};

rails.add = function(x, y, t) {
    this.push(new Rail(x, y, t));
};
rails.create = function() {
    for (var i = 0; i < this.length; i ++) {
        this[i].draw();
    }
};

var ItemSpawner = function(x, y, width, height, type) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.scaledSize = 3;
    this.image = new Image();
    this.image.src = 'assets/blocks/tile_item.png'
    this.timer = 0;
    this.itemFrequency = 300;
};  
ItemSpawner.prototype.draw = function() {
    if (hitbox) {
        c.fillStyle = 'pink';
        c.fillRect(this.x, this.y, this.width, this.height)
    }

    this.timer++;

    if (this.timer > this.itemFrequency) {
        items.push(new Item(this.x, this.y))
        this.timer = 0;
    }
    
    c.save();
    c.translate(this.x, this.y);
    c.drawImage(this.image, 0, 0)
    c.restore();
};

itemSpawners.add = function(x, y, w, h, i) {
    this.push(new ItemSpawner(x, y, w, h, i));
};
itemSpawners.create = function() {
    for (var i = 0; i < this.length; i ++) {
        this[i].draw();
    }
};

// slope blocks
// average block
var Ramp = function(x, y, w, h, type) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.type = type;
    this.scaledSize = 3;
    this.image = new Image();
    this.image.src = 'assets/blocks/tile_slope.png'
    this.direction = this.type === 'right' ? -1 : 1;
};  
Ramp.prototype.draw = function() {
    if (hitbox) {
        c.fillStyle = 'red';
        c.fillRect(this.x, this.y, this.w, this.h)
    }
    c.save();
    c.translate(this.x, this.y);
    c.scale(this.direction, 1);
    c.drawImage(this.image, this.type === 'right' ? -blockSize - 5 : 0, 0);
    c.restore();
};

ramps.add = function(x, y, w, h, t) {
    this.push(new Ramp(x, y, w, h, t));
};
ramps.create = function() {
    for (var i = 0; i < this.length; i ++) {
        this[i].draw();
    }
};