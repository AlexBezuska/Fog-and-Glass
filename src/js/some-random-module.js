console.log("random system loaded");
module.exports = {
  inRange: function(min, max) {
    return min + Math.random() * (max - min);
  },
  intInRange: function(min, max) {
    return Math.round(this.inRange(min, max));
  },
  from: function(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
};
