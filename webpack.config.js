var webpack = require("webpack");
var path = require("path");

var webpackConfig = {
  entry: "./src/js/game.js",
  resolve: {
    extensions: [".js"]
  },
  output: {
    path: __dirname + "/build",
    publicPath: "/build/",
    filename: "game.js"
  }
};

module.exports = webpackConfig;
