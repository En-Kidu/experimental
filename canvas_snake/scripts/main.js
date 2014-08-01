$(document).ready(function() {

    var WIDTH = 600;
    var HEIGHT = WIDTH * 9 / 16;

    var c = document.createElement('canvas');
    c.id = 'screen';
    c.width = WIDTH;
    c.height = HEIGHT;
    c.style.position = 'relative';
    c.style.left = (window.innerWidth / 2).toString() + 'px';
    c.style.margin = '0px 0px 0px -' + (WIDTH / 2).toString() + 'px';
    c.style.border = '1px solid black';
    c.style.backgroundColor = '#000000';
    document.body.appendChild(c);

    var ctx = c.getContext('2d');
    ctx.lineWidth = "1";

    //==========================================================================

    function Snake(x, y, r, speed) {

        this.x = x || Math.random() * WIDTH;
        this.y = y || Math.random() * HEIGHT;
        this.r = r || Math.random() * 8 + 2;

        this.angle = Math.random() * 360;
        this.speed = speed || Math.random() * this.r / 2 + 1;

        this.rx = Math.cos(this.angle / 180 * Math.PI);
        this.ry = Math.sin(this.angle / 180 * Math.PI);

        this.vx = this.speed * this.rx;
        this.vy = this.speed * this.ry;

        this.rgb = x && y && r && speed ? "#00FF00" : "rgb(" + ((Math.random() * 200 + 55) >> 0) + ", 0, 0)";

        this.left = false;
        this.right = false;

        this.wiggling = 0;
        this.wiggleAngle = 10;
        this.wiggleFreq = 8;

    }

    Snake.prototype.wiggle = function() {
        this.angle += this.wiggling < this.wiggleFreq / 2 ? this.wiggleAngle : -this.wiggleAngle;
        this.wiggling = (this.wiggling + 1) % this.wiggleFreq;
    }

    Snake.prototype.turn = function(angle) {
        this.angle = (this.angle + angle) % 360;
    }

    Snake.prototype.move = function() {
        this.rx = Math.cos(this.angle / 180 * Math.PI);
        this.ry = Math.sin(this.angle / 180 * Math.PI);
        this.vx = this.speed * this.rx;
        this.vy = this.speed * this.ry;
        this.x += this.vx;
        this.y += this.vy;
    }

    Snake.prototype.checkBounds = function() {
        this.x = this.x > WIDTH ? 0 : this.x < 0 ? WIDTH : this.x;
        this.y = this.y > HEIGHT ? 0 : this.y < 0 ? HEIGHT : this.y;
    }

    Snake.prototype.update = function() {
        this.checkBounds();
        this.wiggle();
        if (this.left) this.turn(18);
        if (this.right) this.turn(-18);

        this.move();
    }

    Snake.prototype.draw = function() {
        ctx.fillStyle = this.rgb;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    }

    var SPEED = 5;
    var snakeAmount = 500;

    var snake = new Snake(WIDTH / 2, HEIGHT / 2, 10, SPEED);
    var snakes = [snakeAmount];

    for (var i = 0; i < snakeAmount; i++) {
        snakes[i] = new Snake();
    }
    window.addEventListener("keydown", doKeyDown, false);
    window.addEventListener("keyup", doKeyUp, false);

    function doKeyDown(e) {
        if (e.keyCode === 65 || e.keyCode === 37) {
            snake.left = true;
        }
        if (e.keyCode === 68 || e.keyCode === 39) {
            snake.right = true;
        }
    }

    function doKeyUp(e) {
        if (e.keyCode === 65 || e.keyCode === 37) {
            snake.left = false;
        }
        if (e.keyCode === 68 || e.keyCode === 39) {
            snake.right = false;
        }
    }

    //===================================================

    var fps = 60;

    function render() {
        setTimeout(function() {
            window.requestAnimationFrame(render);

            ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
            ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

            for (var i = 0; i < snakes.length; i++) {
                snakes[i].update();
                snakes[i].draw();
            }

            snake.update();
            snake.draw();

        }, 1000 / fps);
    }
    render();
});
