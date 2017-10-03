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
        if (command == "go") {
          PPong.controllers.getActive().onResume();
        }
      }
    };
    this.API.onErrorCallback = function(error) {
      if (error == "not-allowed") {
        PPong.controllers.onError(
          "Critical error: SpeechAPI not allowed in your browser"
        );
      }
    };
    this.API.settings.interimResults = true;
    this.API.settings.continuous = true;
    this.API.init();
    if (this.API.active) {
      this.API.onStopRecognition = function() {};
      this.API.onStartRecognition();
      this.underRecognize = true;
    } else {
      PPong.controllers.onError("Critical error: " + this.API.error);
    }
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
  API: SpeechAPI,
  resumeCallback: null,
  onResume: function() {
    if (typeof this.resumeCallback == "function") {
      this.resumeCallback();
    }
  }
};
