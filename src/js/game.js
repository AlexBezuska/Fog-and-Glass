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

var moss = {};
moss.frame = 0;
moss.timer = 50;
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
  { zindex: 10, image: "/img/_0015_moss16.png" }
];
moss.lasSprite = "";


var mushroom = {};
mushroom.frame = 0;
mushroom.timer = 50;
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
  { zindex: 20, image: "/img/_0012_mushroom13.png" }
];
mushroom.lasSprite = "";


function addOverTime(element, delta){
  //console.log(element.timer);
  if (element.frame > (element.images.length - 1)){
    element.frame = 0;
  }
  element.timer -= delta;
  if(element.timer <= 0) {
    //console.log("FRAME:", element.frame);
    var multiplier = 1;
    if (element.images[element.frame].peak){
      multiplier = 10;
      console.log("PEAK!!!!");
    }
    element.timer = random.inRange(5 * multiplier, 100 * multiplier);
    if (element.lastSprite) {
      app.stage.removeChild(element.lastSprite);
    }
    element.lastSprite = addElement(element.images[element.frame]);
    element.frame++;

  }


}


var player = addElement({
width: 128,
height: 128,
zindex: 1000,
image: "/img/farae-single.png"
});
player.vx = 0;
  player.vy = 0;




var playerSpeed = 7;
//Capture the keyboard arrow keys
  var left = keyboard(37),
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40);

  //Left arrow key `press` method
  left.press = function() {
    console.log("left press");
    player.vx = -playerSpeed;
    player.vy = 0;
  };

  //Left arrow key `release` method
  left.release = function() {
    if (!right.isDown && player.vy === 0) {
      player.vx = 0;
    }
  };

  //Up
  up.press = function() {
    player.vy = -playerSpeed;
    player.vx = 0;
  };
  up.release = function() {
    if (!down.isDown && player.vx === 0) {
      player.vy = 0;
    }
  };

  //Right
  right.press = function() {
    player.vx = playerSpeed;
    player.vy = 0;
  };
  right.release = function() {
    if (!left.isDown && player.vy === 0) {
      player.vx = 0;
    }
  };

  //Down
  down.press = function() {
    player.vy = playerSpeed;
    player.vx = 0;
  };
  down.release = function() {
    if (!up.isDown && player.vx === 0) {
      player.vy = 0;
    }
  };



app.ticker.add(function(delta) {
addOverTime(moss, delta);
addOverTime(mushroom, delta);
  // if (element < timedElements.length){
  //   time += 5;
  //   console.log(time, " waiting for ", timedElements[element].timestamp);
  //   waitForNext(time, timedElements[element].timestamp);
  // }
  console.log(player.vx, player.vy);
  player.x += player.vx;
  player.y += player.vy;
  stats.update();
});




function addElement(options){
  var newElement = PIXI.Sprite.fromImage(options.image);
  newElement.anchor.set(0.5);
  newElement.zIndex = options.zindex;
  newElement.width = options.width || 512;
  newElement.height = options.height || 512;
  newElement.x = options.x || app.renderer.width / 2;
  newElement.y = options.y || app.renderer.height / 2;
  app.stage.addChild(newElement);
  return newElement;
}
