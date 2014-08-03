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

    /* =====================================================================================*/

    /* ======================= CONSTRUCTOR AABB ===========================*/
    function AABB(v_position, width, height) {
        this.pos = v_position;
        this.halfW = width / 2;
        this.halfH = height / 2;
        this.velocity = new Vector2(Math.random() * 10 - 5, Math.random() * 10 - 5);
        this.color = "#FFFFFF";
    }

    AABB.prototype.aabbVsaabb = function(other) {
        if ((this.pos.x + this.halfW < other.pos.x - other.halfW) ||
            (this.pos.y + this.halfH < other.pos.y - other.halfH) ||
            (this.pos.x - this.halfW > other.pos.x + other.halfW) ||
            (this.pos.y - this.halfH > other.pos.y + other.halfH)
        ) {
            return false;
        }
        return true;
    }


    AABB.prototype.draw = function() {
        ctx.fillRect(this.pos.x - this.halfW, this.pos.y - this.halfH, this.halfW * 2, this.halfH * 2);
        ctx.stroke();
    }

    AABB.prototype.move = function() {
        this.pos.addSelf(this.velocity);
    }

    AABB.prototype.checkBounds = function() {
        if (this.pos.x + this.halfW > WIDTH) {
            this.velocity.x = -this.velocity.x;
            this.pos.x = WIDTH - this.halfW;
        } else if (this.pos.x - this.halfW < 0) {
            this.velocity.x = -this.velocity.x;
            this.pos.x = this.halfW;
        }

        if (this.pos.y + this.halfH > HEIGHT) {
            this.velocity.y = -this.velocity.y;
            this.pos.y = HEIGHT - this.halfH;
        } else if (this.pos.y - this.halfH < 0) {
            this.velocity.y = -this.velocity.y;
            this.pos.y = this.halfH;
        }
    }

    /* ======================== animation setup & loop ============================================= */

    //var aabb = new AABB(new Vector2(0, 0), 100, 100)

    var aabbs = [];
    for (var i = 0; i < 60; i++) {
        aabbs[i] = new AABB(new Vector2(Math.random() * WIDTH, Math.random() * HEIGHT), Math.random() * 45 + 5, Math.random() * 45 + 5);
    }

    var fps = 30;

    function render() {
        setTimeout(function() {
            window.requestAnimationFrame(render);

            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            //update
            for (var i = 0; i < aabbs.length; i++) {
                aabbs[i].checkBounds();
                aabbs[i].move();
            }

            //render
            for (var i = 0; i < aabbs.length; i++) {
                ctx.fillStyle = aabbs[i].color;
                for (var j = 0; j < aabbs.length; j++) {
                    if ((j !== i) && aabbs[i].aabbVsaabb(aabbs[j])) {
                        ctx.fillStyle = '#FF0000';
                        //console.log(j);
                        break;
                    }

                }
                aabbs[i].draw();
            }
            /*
            aabb.checkBounds();
            aabb.move();
            aabb.draw();
            */

        }, 1000 / fps);
    }
    render();

});
