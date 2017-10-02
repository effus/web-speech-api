var VoiceController = {
  direction: "none",
  construct: function() {
    this.API.recognitionCallback = function(command) {
      if (command == "up") {
        PPong.controllers.getActive().setDirection("up");
      } else if (command == "down") {
        PPong.controllers.getActive().setDirection("down");
      } else {
        PPong.controllers.getActive().setDirection("none");
      }
    };
    this.API.settings.interimResults = true;
    this.API.settings.continuous = true;
    this.API.init();
    if (this.API.active) {
      this.API.onStopRecognition = function() {};
      this.API.onStartRecognition();
      this.underRecognize = true;
    } else throw Error("Critical error: " + this.API.error);
  },
  destruct: function() {
    if (this.underRecognize) {
      this.API.deactivate();
    }
  },
  setDirection: function(name) {
    this.direction = name;
  },
  underRecognize: false,
  API: SpeechAPI
};
