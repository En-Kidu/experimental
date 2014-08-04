var WIDTH;
var HEIGHT;

function Turtle(canvasID) {
    'use strict';

    this.pos = {
        x: 0,
        y: 0,
        angleR: 0
    };
    this.penDown = false;
    this.color = '#555555';
    this.lineWidth = 2;
    this.memory = [];
    this.ctx = document.getElementById(canvasID).getContext('2d');

    this.save = function() {
        this.memory.push({
            x: this.pos.x,
            y: this.pos.y,
            angleR: this.pos.angleR
        });
    };

    this.load = function() {
        this.pos = this.memory.pop();
    };

    //====== LOG TURTLE STATUS =====================================================================
    this.logStatus = function() {
        console.log('x=' + this.pos.x + '; y=' + this.pos.y + '; angleDeg = ' + this.angleDeg() + '; penDown = ' + this.penDown);
    };
    //====== MOVE FORWARD ==========================================================================
    this.move = function(length) {
        var x0 = this.pos.x,
            y0 = this.pos.y;
        this.pos.x += length * Math.sin(this.pos.angleR);
        this.pos.y += length * Math.cos(this.pos.angleR);
        if (this.ctx) {
            if (this.penDown) {
                this.ctx.beginPath();
                this.ctx.lineWidth = this.lineWidth;
                this.ctx.strokeStyle = this.color;
                this.ctx.moveTo(x0, y0);
                this.ctx.lineTo(this.pos.x, this.pos.y);
                this.ctx.stroke();
            }
        } else {
            this.ctx.moveTo(this.pos.x, this.pos.y);
        }
        return this;
    };
    //====== MOVE BACKWARDS ========================================================================
    this.moveNeg = function(length) {
        this.move(-length);
        return this;
    };
    //====== TURN LEFT =============================================================================
    this.left = function(angleInDegrees) {
        this.pos.angleR += angleInDegrees * Math.PI / 180.0;
        return this;
    };
    //====== TURN RIGHT ============================================================================
    this.right = function(angleInDegrees) {
        this.left(-angleInDegrees);
        return this;
    };

    //====== PEN DOWN ==============================================================================
    this.down = function() {
        this.penDown = true;
    };

    //====== PEN UP ================================================================================
    this.up = function() {
        this.penDown = false;
    };

    //====== RADIANS TO DEGREES ====================================================================
    this.angleDeg = function() {
        return this.pos.angleR * 180.0 / Math.PI;
    };

}



$(document).ready(function() {
    'use strict';

    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight - 4; //*9/16;
    $('#wall').width(WIDTH).height(HEIGHT).attr('width', WIDTH).attr('height', HEIGHT);

    var color = {
        black: '#ffffff',
        red: '#ff0000',
        green: '#00ff00',
        blue: '#0000ff',
        yellow: '#ffff00',
        fuchsia: '#ff00ff',
        aqua: '#00ffff'
    };

    var pen = new Turtle('wall');
    pen.color = color.red;
    pen.down();
    pen.pos.x = WIDTH / 2;
    pen.pos.y = HEIGHT / 2;

    var stepsOrigin = 5;
    var angleOrigin = 120;

    var steps = 0;
    var angle = 0;

    /*for (var i = 0; i < 200; i++) {
        pen.move(steps);
        pen.left(angle);
        steps += 5;
    }*/

    var fps = 60;
    var iterator = 0;

    function render() {
        setTimeout(function() {
            window.requestAnimationFrame(render);


            pen.ctx.fillStyle = "rgba(0,0,0,0.1)";
            pen.ctx.fillRect(0, 0, WIDTH, HEIGHT);

            pen.save();
            steps = stepsOrigin;
            for (var i = 0; i < 200; i++) {
                pen.move(steps);
                pen.left(angle);
                steps += 8;
            }
            pen.load();


            //angle = angle + 0.1 % 360;

            //angle = (angle + 0.0000550 * Math.pow(iterator++-180, 2)) % 360;


            angle = (angle + 0.000009 * Math.pow(iterator - 180, 2)) % 360;
            iterator = (iterator + 1) % 360;


        }, 1000 / fps);
    }
    render();

});
