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
    document.body.appendChild(c);

    var ctx = c.getContext('2d');
    ctx.lineWidth = "1";

    function Point(x, y, vx, vy) {
        this.x = x || 0;
        this.y = y || 0;
        this.vx = vx || 0;
        this.vy = vy || 0;
        this.rgba = [Math.random() * 255 >> 0, Math.random() * 255 >> 0, Math.random() * 255 >> 0, 255];
    }

    function Voronoi(size) {
        this.imgData = ctx.createImageData(WIDTH, HEIGHT);
        this.points = new Array(size || 10);
        this.bitmap = new Array(WIDTH * HEIGHT);
        for (var i = 0; i < this.points.length; i++) {
            this.points[i] = new Point(
                Math.random() * WIDTH + 1,
                Math.random() * HEIGHT + 1,
                Math.random() * 6 - 3,
                Math.random() * 6 - 3
            );
        }
    }

    Voronoi.prototype.update = function() {
        var p;
        for (var i = 0; i < this.points.length; i++) {
            p = this.points[i];
            this.checkBounds(p);
            this.move(p);
        }
    }

    Voronoi.prototype.checkBounds = function(p) {
        p.x = p.x > WIDTH ? p.x : p.x < 0 ? WIDTH : p.x;
        p.y = p.y > HEIGHT ? 0 : p.y < 0 ? HEIGHT : p.y;
    }

    Voronoi.prototype.move = function(p) {
        p.x += p.vx;
        p.y += p.vy;
    }

    Voronoi.prototype.draw = function() {
        var color;
        var index;

        for (var wY = 0; wY < HEIGHT; wY++) {
            for (var wX = 0; wX < WIDTH; wX++) {
                color = this.findClosest(wX, wY).rgba;
                index = (wY * WIDTH + wX) * 4;
                this.imgData.data[index + 0] = color[0];
                this.imgData.data[index + 1] = color[1];
                this.imgData.data[index + 2] = color[2];
                this.imgData.data[index + 3] = color[3];
            }
        }
        ctx.putImageData(this.imgData, 0, 0);

        /*ctx.fillStyle = "#000000";
        for (var i = 0; i < this.points.length; i++) {
            ctx.fillRect(this.points[i].x, this.points[i].y, 2, 2);
        }*/
    }

    Voronoi.prototype.findClosest = function(x, y) {
        var currentDist;
        var bestDist = Infinity;
        var closest;
        for (var i = 0; i < this.points.length; i++) {
            currentDist = Voronoi.distance({
                x: x,
                y: y
            }, this.points[i]);

            if (currentDist < bestDist) {
                bestDist = currentDist;
                closest = this.points[i];
            }
        }
        return closest;
    }

    Voronoi.distance = function(a, b) {

        // Manhatten Distance
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

        // Euclidean distance
        //return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)
    }

    var test = new Voronoi(20);
    var fps = 60;

    function render() {
        setTimeout(function() {
            window.requestAnimationFrame(render);

            test.update();
            test.draw();

        }, 1000 / fps);
    }
    render();
});
