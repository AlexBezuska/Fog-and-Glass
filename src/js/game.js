// Longshot

var game = {};
game.objects = new Array();

var log = require('./log');
log.startup();

var getObjectsBy = require("./get-objects-by");
var create = require('./create');
var applyVelocity = require('./apply-velocity');
var keepInside = require('./keep-inside');
var random = require("./some-random-module");
var keyboard = require("./keyboard");
var setupRenderer = require('./setup-renderer');

var Stats = require('./vendor/stats');
var stats = new Stats();
stats.setMode(0);
document.body.appendChild(stats.domElement);

var PIXI = require("pixi.js");

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST
var app = new PIXI.Application(800, 800, {
  backgroundColor : 0xefbe94,
antialias: false
});
document.body.appendChild(app.view);


var alwaysThere = [
  { zindex: 0, image: "/img/ld38-terrarium_0010_bubble-back.png"},
  { zindex: 1, image: "/img/ld38-terrarium_0009_dirt.png"},
  { zindex: 2, image: "/img/ld38-terrarium_0007_rocks.png"},
  { zindex: 3, image: "/img/ld38-terrarium_0004_bubble.png"},
  { zindex: 100, image: "/img/ld38-terrarium_0002_bubble-shadows.png"},
  { zindex: 101, image: "/img/ld38-terrarium_0003_bubble-highlights.png"},
  { zindex: 102, image: "/img/ld38-terrarium_0001_bubble-dark-shadows.png"},
  { zindex: 103, image: "/img/ld38-terrarium_0000_bubble-bright-highlights.png"}
];

for(var i = 0; i < alwaysThere.length; i++) {
  addElement(alwaysThere[i]);
}

var peakMultiplier = 15;

var moss = {};
moss.frame = 0;
moss.timer = 10;
moss.images = [
  { zindex: 10, image: "/img/_0000_moss.png"  },
  { zindex: 10, image: "/img/_0001_moss2.png" },
  { zindex: 10, image: "/img/_0002_moss3.png" },
  { zindex: 10, image: "/img/_0003_moss4.png" },
  { zindex: 10, image: "/img/_0004_moss5.png" },
  { zindex: 10, image: "/img/_0005_moss6.png" },
  { zindex: 10, image: "/img/_0006_moss7.png" },
  { zindex: 10, image: "/img/_0007_moss8.png", peak: true},
  { zindex: 10, image: "/img/_0008_moss9.png" },
  { zindex: 10, image: "/img/_0009_moss10.png" },
  { zindex: 10, image: "/img/_0010_moss11.png" },
  { zindex: 10, image: "/img/_0011_moss12.png" },
  { zindex: 10, image: "/img/_0012_moss13.png" },
  { zindex: 10, image: "/img/_0013_moss14.png" },
  { zindex: 10, image: "/img/_0014_moss15.png" },
  { zindex: 10, image: "/img/_0015_moss16.png", peak: true  }
];
moss.lasSprite = "";


var mushroom = {};
mushroom.frame = 0;
mushroom.timer = 10;
mushroom.images = [
  { zindex: 20, image: "/img/_0000_mushroom.png"  },
  { zindex: 20, image: "/img/_0001_mushroom2.png" },
  { zindex: 20, image: "/img/_0002_mushroom3.png" },
  { zindex: 20, image: "/img/_0003_mushroom4.png" },
  { zindex: 20, image: "/img/_0004_mushroom5.png" },
  { zindex: 20, image: "/img/_0005_mushroom6.png" },
  { zindex: 20, image: "/img/_0006_mushroom7.png" },
  { zindex: 20, image: "/img/_0007_mushroom8.png" },
  { zindex: 20, image: "/img/_0008_mushroom9.png", peak: true },
  { zindex: 20, image: "/img/_0009_mushroom10.png"},
  { zindex: 20, image: "/img/_0010_mushroom11.png" },
  { zindex: 20, image: "/img/_0011_mushroom12.png" },
  { zindex: 20, image: "/img/_0012_mushroom13.png", peak: true  }
];
mushroom.lasSprite = "";


var fern = {};
fern.frame = 0;
fern.timer = 10;
fern.images = [
{ zindex: 5, image: "/img/ld38-terrarium_0000s_0000_fern-01.png	" },
{ zindex: 5, image: "/img/ld38-terrarium_0000s_0001_fern-02.png	" },
{ zindex: 5, image: "/img/ld38-terrarium_0000s_0002_fern-03.png	" },
{ zindex: 5, image: "/img/ld38-terrarium_0000s_0003_fern-04.png	" },
{ zindex: 5, image: "/img/ld38-terrarium_0000s_0004_fern-05.png	" },
{ zindex: 5, image: "/img/ld38-terrarium_0000s_0005_fern-06.png	" },
{ zindex: 5, image: "/img/ld38-terrarium_0000s_0006_fern-07.png	" },
{ zindex: 5, image: "/img/ld38-terrarium_0000s_0007_fern-08.png" },
{ zindex: 5, image: "/img/ld38-terrarium_0000s_0008_fern-09.png" },
{ zindex: 5, image: "/img/ld38-terrarium_0000s_0009_fern-10.png", peak: true },
{ zindex: 5, image: "/img/ld38-terrarium_0000s_0010_fern-11.png" },
{ zindex: 5, image: "/img/ld38-terrarium_0000s_0011_fern-12.png" },
{ zindex: 5, image: "/img/ld38-terrarium_0000s_0012_fern-13.png" },
{ zindex: 5, image: "/img/ld38-terrarium_0000s_0013_fern-14.png" },
{ zindex: 5, image: "/img/ld38-terrarium_0000s_0014_fern-15.png", peak: true  }
];
fern.lasSprite = "";


var playerSpeed = 7;

var player = addElement({
  width: 128,
  height: 128,
  zindex: 1000,
  image: "/img/farae-single.png"
});

function drawCircle(x, y, radius) {
  var circle = new PIXI.Graphics();
  circle.lineStyle(4, 0xBF00FE, 1);
  circle.drawCircle(0, 0, radius);
  circle.radius = radius;
  circle.x = x || app.renderer.width / 2;
  circle.y = y || app.renderer.height / 2;
  app.stage.addChild(circle);
  return circle;
}

var boundary = drawCircle("", "", 256);
var playerCircle = drawCircle(player.x, player.y, player.width/4);

setupControls(player, playerSpeed);

app.ticker.add(function(delta) {
  addOverTime(fern, delta);
  addOverTime(moss, delta);
  addOverTime(mushroom, delta);


  player.x += player.vx;
  player.y += player.vy;


  playerCircle.x = player.x;
  playerCircle.y = player.y;
  insideCircle(playerCircle, boundary);

  stats.update();
});




function insideCircle(circle1, circle2) {

var dx = circle1.x - circle2.x;
var dy = circle1.y - circle2.y;
var distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > circle2.radius - circle1.radius) {
    console.log("Left the circle!");
  }
}










function addOverTime(element, delta){
  //console.log(element.timer);
  if (element.frame > (element.images.length - 1)){
    element.frame = 0;
  }
  element.timer -= delta;
  if(element.timer <= 0) {
    //console.log("FRAME:", element.frame);

    element.timer = random.inRange(5 * peakMultiplier, 20 * peakMultiplier);
    if (element.lastSprite) {
      app.stage.removeChild(element.lastSprite);
    }
    element.lastSprite = addElement(element.images[element.frame]);
    element.frame++;
  }
}

function addElement(options){
  var newElement = PIXI.Sprite.fromImage(options.image);
  newElement.anchor.set(0.5);
  newElement.zIndex = options.zindex;
  newElement.width = options.width || 512;
  newElement.height = options.height || 512;
  newElement.x = options.x || app.renderer.width / 2;
  newElement.y = options.y || app.renderer.height / 2;
  newElement.vx = options.vx || 0;
  newElement.vy = options.vy || 0;
  app.stage.addChild(newElement);
  return newElement;
}


function setupControls(player, speed) {
  var left = keyboard(37),
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40);
  left.press = function() {
  //  console.log("left press");
    player.vx = -speed;
    player.vy = 0;
  };
  left.release = function() {
    if (!right.isDown && player.vy === 0) {
      player.vx = 0;
    }
  };
  up.press = function() {
    player.vy = -speed;
    player.vx = 0;
  };
  up.release = function() {
    if (!down.isDown && player.vx === 0) {
      player.vy = 0;
    }
  };

  right.press = function() {
    player.vx = speed;
    player.vy = 0;
  };
  right.release = function() {
    if (!left.isDown && player.vy === 0) {
      player.vx = 0;
    }
  };
  down.press = function() {
    player.vy = speed;
    player.vx = 0;
  };
  down.release = function() {
    if (!up.isDown && player.vx === 0) {
      player.vy = 0;
    }
  };
}
