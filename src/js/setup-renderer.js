module.exports = {
  fullScreen: function(app){
    app.renderer.view.style.position = "absolute";
    app.renderer.view.style.display = "block";
    app.renderer.autoResize = true;
    app.renderer.resize(window.innerWidth, window.innerHeight);
    app.renderer.backgroundColor = 0x008cc9;
    document.body.appendChild(app.view);
  }
};
