var halfHeight = parseInt($('#wrapper').css('height')) / 2;
var halfWidth = parseInt($('#wrapper').css('width')) / 2;
var parallaxFactor = 0.03;
var layerHWidths = [];
var layerHHeights = [];
var stars = [];
var starsAmountPerLayer = 100;

function Star(layer, id) {
    this.size = (Math.random() * 3 + 1) << 0;
    this.layer = layer;
    this.id = this.layer + '' + id;
    this.x = Math.random() * (2 * halfWidth + parallaxFactor * (this.layer * this.layer + 1) * 2 * halfWidth) - (2 * halfWidth + parallaxFactor * (this.layer * this.layer + 1) * 2 * halfWidth) / 2;
    this.y = Math.random() * (2 * halfHeight + parallaxFactor * (this.layer * this.layer + 1) * 2 * halfHeight) - (2 * halfHeight + parallaxFactor * (this.layer * this.layer + 1) * 2 * halfHeight) / 2;
    this.color = (Math.random() * 255 + 1) << 0;

}
// populate the star array
// each column represents a layer, each row a single star in the layer
for (var f = 0; f < $('.layered').length; f++) {
    stars[f] = []
    for (var e = 0; e < starsAmountPerLayer; e++) {
        stars[f][e] = new Star(f, e);
    }
}

$('#wrapper').children().each(function(i, layer) {
    $(layer).css('z-index', 88 - i); // reverse z-order for convinience 
    layerHWidths[i] = parseInt($(layer).css('width')) / 2;
    layerHHeights[i] = parseInt($(layer).css('height')) / 2;
    // assign each star to its designated layer
    for (var k = 0; k < stars[i].length; k++) {
        $(layer).append('<div class="star" id="' + stars[i][k].id + '"></div>');
        $('#' + i + k)
            .css('top', stars[i][k].y)
            .css('left', stars[i][k].x)
            .css('width', stars[i][k].size)
            .css('height', stars[i][k].size)
            .css('background-color',
                'rgb(' +
                (255 - ($('.layered').length - i) * 18) +
                ',' + (255 - ($('.layered').length - i) * 18) +
                ',' + (255 - ($('.layered').length - i) * 18) +
                ')'
        );
    }
});

//================= Begin mouseCTRL ======================= comment autoCTRL if activated!

$(document).mousemove(function(e) {
    $('#wrapper').children().each(function(i, layer) {
        $(layer)
            .css('top', halfHeight - layerHHeights[i] + parallaxFactor * (i * i + 1) * (halfHeight - e.clientY))
            .css('left', halfWidth - layerHWidths[i] + parallaxFactor * (i * i + 1) * (halfWidth - e.clientX)); // layerHeight & -Width for true centering
    });
});

//================== END mouseCTRL ========================


//=============== BEGIN autoCTRL ========================== comment mouseCTRL if activated!
/*
var viewPoint = {
    x: 0,
    y: 0
};
var velocity = 2;
var heading = {
    x: Math.random()* velocity*2 - velocity,
    y: Math.random()* velocity*2 - velocity
};

function updateViewPoint() {
    if (viewPoint.x > halfWidth*2 - 1 || viewPoint.x < -halfWidth*2 + 1) {
        changeHeadingX(velocity);
        viewPoint.x > halfWidth*2 -1 ? viewPoint.x =  halfWidth*2-1 : viewPoint.x = -halfWidth*2 + 1;
    }
    if (viewPoint.y > halfHeight*2 - 1 || viewPoint.y < -halfHeight*2 + 1) {
        changeHeadingY(velocity);
        viewPoint.y > halfHeight*2 -1 ? viewPoint.y =  halfHeight*2-1 : viewPoint.y = -halfHeight*2 + 1;
    }
    viewPoint.x += heading.x;
    viewPoint.y += heading.y;
}

function changeHeadingX(velocity) {
    var tmp = heading.x > 0 ? -1 : 1;
    heading.x = Math.random()* velocity * tmp;
}

function changeHeadingY(velocity) {
    var tmp = heading.y >= 0 ? -1 : 1;
    heading.y = Math.random()* velocity * tmp;
}

function loop() {
    updateViewPoint();
    $('#wrapper').children().each(function(i, layer) {
        $(layer)
            .css('top', halfHeight - layerHHeights[i] + parallaxFactor * (i * i + 1) * (halfHeight - viewPoint.y))
            .css('left', halfWidth - layerHWidths[i] + parallaxFactor * (i * i + 1) * (halfWidth - viewPoint.x)); // layerHeight & -Width for true centering
    });
    window.requestAnimationFrame(loop);
}
loop();
*/
//================= END autoCTRL =========================
