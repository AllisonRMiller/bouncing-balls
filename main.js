// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;


// function to generate random number

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min)) + min;
    return num;
}

// define Ball constructor

function Shape(x, y, velX, velY, exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
}
function Ball(x, y, velX, velY, exists, color, size) {
    Shape.call(this, x, y, velX, velY, exists);

    this.color = color;
    this.size = size;
}

function evilCircle(x, y, exists, color, size) {
    Shape.call(this, x, y, 20, 20, exists);

    this.color = "rgb(255,255,255)";
    this.size = 10;
}


Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

evilCircle.prototype = Object.create(Shape.prototype);
evilCircle.prototype.constructor = evilCircle;

// define ball draw method

Ball.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
};
// bounces balls off "walls"
Ball.prototype.update = function () {
    if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
    }

    if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
    }

    if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
}

//define evilCircle draw method
evilCircle.prototype.draw = function () {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();;
};

//checks evilCircle position re:"walls"
evilCircle.prototype.checkBounds = function () {
    if ((this.x + this.size) >= width) {
        this.X = -(this.size);
    }

    if ((this.x - this.size) <= 0) {
        this.X = -(this.size);
    }

    if ((this.y + this.size) >= height) {
        this.Y = -(this.size);
    }

    if ((this.y - this.size) <= 0) {
        this.Y = -(this.size);
    }

}


//Control/interface
evilCircle.prototype.setControls = function () {
    let _this = this;
    window.onkeydown = function (e) {
        if (e.key === 'a') {
            _this.x -= _this.velX;
        } else if (e.key === 'd') {
            _this.x += _this.velX;
        } else if (e.key === 'w') {
            _this.y -= _this.velY;
        } else if (e.key === 's') {
            _this.y += _this.velY;
        }
    }
}

//collision detection
Ball.prototype.collisionDetect = function () {
    for (let j = 0; j < balls.length; j++) {
        if (!(this === balls[j])) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
            }
        }
    }
}

//collision detection
evilCircle.prototype.collisionDetect = function () {
    for (let j = 0; j < balls.length; j++) {
        if (balls[j].exists) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].exists = this.exists = false;
                ballCount--;
            }
        }
    }
}

let balls = [];



function score (){
    document.getElementById("score").innerHTML="Ball count:" + ballCount;

}

while (balls.length < 25) {
    let size = random(10, 20);
    let ball = new Ball(
        // ball position always drawn at least one ball width
        // away from the edge of the canvas, to avoid drawing errors
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-7, 7),
        random(-7, 7),
        true,
        'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
        size
    );

    balls.push(ball);
}
var ballCount = balls.length;
let evilPlayer = new evilCircle(
    random(0,width), 
    random(0,height), 
    true);
evilPlayer.setControls();

var ballCount = balls.length;

function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < balls.length; i++) {
        if (balls[i].exists) {
            balls[i].draw();
            balls[i].update();
            balls[i].collisionDetect();
        }

    }
    score();
    evilPlayer.draw();
    evilPlayer.checkBounds();
    evilPlayer.collisionDetect();

    requestAnimationFrame(loop);
}

loop();


