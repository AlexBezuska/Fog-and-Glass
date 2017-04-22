console.log("getObjectsBy system loaded");
/*
  Use:
    getObjectsFrom(array, property, value)
  Read it like this:
    "Get object from the array who has a specific
    property which matches this specific value"
  Example:
    Get object with 'name' equal to 'Susan'
    var susan = getObjectsFrom(game.objects, 'name', 'Susan');
*/
module.exports = function(array, property, value){
  var result = game.pool.filter(function( object ) {
    return object[property] === value;
  });
  if (result.length === 1){
    return result[0];
  }
  return result;
}
