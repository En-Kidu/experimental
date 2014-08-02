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

    /* ======================= class Vector2 ===========================*/
    function Vector2(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    Vector2.prototype = {
        negative: function() {
            return new Vector2(-this.x, -this.y);
        },
        add: function(v) {
            if (v instanceof Vector2) {
                return new Vector2(this.x + v.x, this.y + v.y);
            } else {
                return new Vector2(this.x + v, this.y + v);
            }
        },
        sub: function(v) {
            if (v instanceof Vector2) {
                return new Vector2(this.x - v.x, this.y - v.y);
            } else {
                return new Vector2(this.x - v, this.y - v);
            }
        },
        multiply: function(v) {
            if (v instanceof Vector2) {
                return new Vector2(this.x * v.x, this.y * v.y);
            } else {
                return new Vector2(this.x * v, this.y * v);
            }
        },
        divide: function(v) {
            if (v instanceof Vector2) {
                return new Vector2(this.x / v.x, this.y / v.y);
            } else {
                return new Vector2(this.x / v, this.y / v);
            }
        },
        equals: function(v) {
            return this.x == v.x && this.y == v.y;
        },
        dot: function(v) {
            return this.x * v.x + this.y * v.y;
        },
        length: function() {
            return Math.sqrt(this.dot(this));
        },
        normalize: function() {
            return this.divide(this.length());
        },
        min: function() {
            return Math.min(this.x, this.y);
        },
        max: function() {
            return Math.max(this.x, this.y);
        },
        angle: function() {
            //return Math.atan(this.x / this.y);
        },
        toArray: function(n) {
            return [this.x, this.y].slice(0, n || 2);
        },
        clone: function() {
            return new Vector2(this.x, this.y);
        },
        init: function(x, y) {
            this.x = x;
            this.y = y;
            return this;
        },

        negativeSelf: function() {
            this.x = -this.x;
            this.y = -this.y;
        },
        addSelf: function(v) {
            if (v instanceof Vector2) {
                this.x += v.x;
                this.y += v.y;
            } else {
                this.x += v;
                this.y += v;
            }
        },
        subSelf: function(v) {
            if (v instanceof Vector2) {
                this.x -= v.x;
                this.y -= v.y;
            } else {
                this.x -= v;
                this.y -= v;
            }
        },
        multiplySelf: function(v) {
            if (v instanceof Vector2) {
                this.x *= v.x;
                this.y *= v.y;
            } else {
                this.x *= v;
                this.y *= v;
            }
        },
        divideSelf: function(v) {
            if (v instanceof Vector2) {
                this.x /= v.x;
                this.y /= v.y;
            } else {
                this.x /= v;
                this.y /= v;
            }
        },
        normalizeSelf: function() {
            return this.divideSelf(this.length());
        }
    };

    /* ======================= CONTROL circle vs circle collision detection ===========================*/
    function cVsc(a, b) {
        var r = a.r + b.r;
        r *= r;
        return r > (Math.pow(a.pos.x - b.pos.x, 2) + Math.pow(a.pos.y - b.pos.y, 2));
    }

    /* ======================= CONSTRUCTOR circle ===========================*/
    function Circle(r, pos) {
        this.r = r;
        this.pos = pos;
        this.velocity = new Vector2(Math.random() * 10 - 5, Math.random() * 10 - 5);
        this.color = "#FFFFFF";
    }

    Circle.prototype.checkBounds = function() {
        if ((this.pos.x > (WIDTH - this.r)) || (this.pos.x - this.r < 0)) {
            this.velocity.x = -this.velocity.x;
            this.pos.x = this.pos.x - this.r < 0 ? 0 + this.r : WIDTH - this.r;
        }
        if ((this.pos.y > (HEIGHT - this.r)) || (this.pos.y - this.r < 0)) {
            this.velocity.y = -this.velocity.y;
            this.pos.y = this.pos.y - this.r < 0 ? 0 + this.r : HEIGHT - this.r;
        }

        this.pos.addSelf(this.velocity);
    }

    /* ======================== animation setup & loop ============================================= */

    var circles = [];
    for (var i = 0; i < 120; i++) {
        circles[i] = new Circle(Math.floor(Math.random() * 10 + 5), new Vector2(Math.random() * WIDTH, Math.random() * HEIGHT));
    }

    var fps = 30;

    function render() {
        setTimeout(function() {
            window.requestAnimationFrame(render);

            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            //update
            for (var i = 0; i < circles.length; i++) {
                circles[i].checkBounds();
            }

            //render
            for (var i = 0; i < circles.length; i++) {
                ctx.fillStyle = circles[i].color;
                for (var j = 0; j < circles.length; j++) {
                    if ((j !== i) && cVsc(circles[i], circles[j])) {
                        ctx.fillStyle = '#FF0000';
                    }
                }
                ctx.beginPath();
                ctx.arc(circles[i].pos.x, circles[i].pos.y, circles[i].r, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.stroke();
            }
        }, 1000 / fps);
    }
    render();

});
