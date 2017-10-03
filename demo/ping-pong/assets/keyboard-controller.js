var KeyboardController = {
  direction: "none",
  construct: function() {
    SVG.on(document, "keydown", function(e) {
      // UP and DOWN pressing
      PPong.controllers
        .getActive()
        .setDirection(
          e.keyCode == 40 ? "down" : e.keyCode == 38 ? "up" : "none"
        );
      e.preventDefault();
    });
    SVG.on(document, "keyup", function(e) {
      // key released
      PPong.controllers.getActive().setDirection("none");
      if (e.keyCode == 32) {
        PPong.controllers.getActive().onResume();
      }
      e.preventDefault();
    });
  },
  destruct: function() {
    SVG.off(document, "keydown");
    SVG.off(document, "keyup");
  },
  setDirection: function(name) {
    this.direction = name;
  },
  resumeCallback: null,
  onResume: function() {
    console.log("onResume", this.resumeCallback);
    if (typeof this.resumeCallback == "function") {
      this.resumeCallback();
    }
  }
};
