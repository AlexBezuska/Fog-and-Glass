console.log("keepInside system loaded");
/*
  What it does:
    Keeps object(s) inside a container object
    if object(s) hits a "wall" it's velocity in the direction it hit is reversed
  Expectations:
    trapped: Object or Array of Objects
      with x, y, width, height, vx, and vy
    trapped: Object
      with x, y, width, height
  Read it like this:
    "Keep object or array of objects inside containing object"
  Example:
    Keep frederick inside a cubicle for all the live-long days
    keepInside(frederick, cubicle);
*/
module.exports = function(trapped, cage) {
if (Array.isArray(trapped)){
  for(var i = 0; i < trapped.length; i++){
    keepInside(trapped[i], cage);
  }
} else {
  keepInside(trapped, cage);
}
function keepInside(trapped, cage){
  var cageX = cage.x | 0;
  var cageY = cage.y | 0;
  if (trapped.x < cageX) {
    trapped.x = cageX;
    trapped.vx *= -1;
  }
  if ((trapped.x + trapped.width) > cage.width) {
    trapped.x = cage.width - trapped.width;
    trapped.vx *= -1;
  }
  if (trapped.y < cageY) {
    trapped.y = cageY;
    trapped.vy *= -1;
  }
  if ((trapped.y + trapped.height) > cage.height) {
    trapped.y = cage.height - trapped.height;
    trapped.vy *= -1;
  }
}

}
