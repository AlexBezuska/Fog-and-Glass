console.log("applyVelocity system loaded");
module.exports = function(sprites) {
  if (!sprites[0].vy) {
    return;
  } else {
    for (var i = 0; i < sprites.length; i++){
      sprites[i].y += sprites[i].vy;
    }
  }
  if (!sprites[0].vx) {
    return;
  } else {
    for (var i = 0; i < sprites.length; i++){
      sprites[i].x += sprites[i].vx;
    }
  }

}
