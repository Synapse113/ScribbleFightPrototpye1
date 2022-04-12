var effects = [];

// FX
var Fx = function(type, x, y, direction, line) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.index = 0;
    this.dead = false;
    this.dustImg1 = new Image();
    this.dustImg1.src = 'assets/dustFX.png';
    this.imgWidth = 0;
    this.imgHeight = 0;
    this.index = 0;
    this.line = line;
    this.scaledSize = 3;
    this.direction = direction;
};
Fx.prototype.draw = function() {
    switch(this.type) {
        case 'horizontalDust':
            this.imgWidth = 7;
            this.imgHeight = 7;
            c.save();
            c.translate(this.x, this.y);
            c.scale(this.direction, 1)
            c.drawImage(this.dustImg1, this.index * this.imgWidth, this.line * this.imgHeight, this.imgWidth, this.imgHeight, 0, 0, this.imgWidth * this.scaledSize, this.imgHeight * this.scaledSize);
            c.restore();

            if (frameCount % 4 === 0) {
                this.index = (this.index + 1);
            }
            this.x += 2 * this.direction;
            this.y -= 1;

            if (this.index === 5) {
                this.dead = true;
            }
            break;
        case 'landingDust':
            this.imgWidth = 7;
            this.imgHeight = 6;
            c.save();
            c.translate(this.x, this.y);
            c.scale(-this.direction, 1)
            c.drawImage(this.dustImg1, this.index * this.imgWidth, this.line * this.imgHeight, this.imgWidth, this.imgHeight, 0, 0, this.imgWidth * this.scaledSize, this.imgHeight * this.scaledSize);
            c.restore();

            if (frameCount % 4 === 0) {
                this.index = (this.index + 1);
            }
            this.x += 1 * this.direction;
            this.y -= 2;

            if (this.index === 5) {
                this.dead = true;
            }
            break;
    }
};

function Brick(x, y) {
    this.x = x;
    this.y = y;
    this.yVel = -12 + Math.random() * 5;
    this.xVel = Math.random() * -12 + 6;
    this.image = new Image();
    this.image.src = 'assets/items/brick.png';
}
Brick.prototype.draw = function() {
    c.save();
    c.translate(this.x, this.y);
    c.drawImage(this.image, 0, 0);
    c.restore();

    this.yVel += 0.5;
    this.y += this.yVel;
    this.xVel *= 0.95;
    this.x += this.xVel;
}