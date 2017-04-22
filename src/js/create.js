console.log("create system loaded");
var random = require('./some-random-module');

module.exports = {
  sprite: function(pool, options) {
    if (!options.quantity) {
      options.quantity = 1;
    }
    for(var i = 0; i < options.quantity; i++){
      createSprite(pool, options);
    }
    function createSprite(pool, options) {
      var sprite = new PIXI.Sprite(options.sprite.texture);
      sprite.y = options.x;
      sprite.x = options.y;
      if (options.vxMin){
        sprite.vx = random.inRange(options.vxMin, options.vxMax);
        sprite.vy = random.inRange(options.vyMin, options.vyMax)
      } else if (options.velocity){
        sprite.vx = options.vx | 0;
        sprite.vy = options.vy | 0;
      }
      sprite.scale.width = options.width | 64;
      sprite.scale.height = options.height | 64;
      sprite.id = options.id | idGen(pool);
      sprite.name = options.name | "noname";
      pool.push(sprite);
      if(options.container) {
        options.container.addChild(sprite);
      }
    }
  }
}

function idGen(pool){
  return pool.length + 1;
}
