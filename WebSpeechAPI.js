var SpeechAPI = {
  active: null,
  error: null,
  ifaces: {
    recognition: null,
    grammar: null,
    event: null
  },
  objects: {
    recognition: null,
    grammar: null
  },
  settings: {
    commands: ["start", "stop", "up", "down"],
    grammar: "#JSGF V1.0; grammar effus; public <command> = ",
    language: "en-US",
    maxAlternatives: 1,
    interimResults: false,
    continuous: false
  },
  init: function(andStart) {
    try {
      if (typeof SpeechRecognition != undefined) {
        console.log("Detected: SpeechRecognition");
        SpeechAPI.ifaces.recognition = SpeechRecognition;
        SpeechAPI.ifaces.grammar = SpeechGrammarList;
        SpeechAPI.ifaces.event = SpeechRecognitionEvent;
      } else if (typeof webkitSpeechRecognition != undefined) {
        console.log("Detected: webkitSpeechRecognition");
        SpeechAPI.ifaces.recognition = webkitSpeechRecognition;
        SpeechAPI.ifaces.grammar = webkitSpeechGrammarList;
        SpeechAPI.ifaces.event = webkitSpeechRecognitionEvent;
      } else {
        console.log("SpeechAPI interface not supported in current browser");
        throw Error("SpeechAPI interface not supported in current browser");
      }
      SpeechAPI.objects.recognition = new SpeechAPI.ifaces.recognition();
      SpeechAPI.objects.grammar = new SpeechAPI.ifaces.grammar();
      SpeechAPI.settings.grammar +=
        "( " + SpeechAPI.settings.commands.join(" | ") + " );";
      SpeechAPI.objects.grammar.addFromString(SpeechAPI.settings.grammar, 1);
      SpeechAPI.objects.recognition.grammars = SpeechAPI.objects.grammar;
      SpeechAPI.objects.recognition.lang = SpeechAPI.settings.language;
      SpeechAPI.objects.recognition.interimResults =
        SpeechAPI.settings.interimResults;
      SpeechAPI.objects.recognition.continuous = SpeechAPI.settings.continuous;
      SpeechAPI.objects.recognition.maxAlternatives =
        SpeechAPI.settings.maxAlternatives;
      SpeechAPI.objects.recognition.onresult = function() {
        SpeechAPI.afterRecognition(event.results);
      };
      SpeechAPI.objects.recognition.onspeechend = function() {
        SpeechAPI.onSpeechEnd();
      };
      SpeechAPI.objects.recognition.onnomatch = function(event) {
        console.log("onnomatch");
        SpeechAPI.lastDetectedCommand = "";
        SpeechAPI.afterRecognition();
      };
      SpeechAPI.objects.recognition.onerror = function(event) {
        console.log("Error occurred in recognition: " + event.error);
        SpeechAPI.error = event.error;
      };
      if (andStart) {
        SpeechAPI.onStartRecognition();
      }
      SpeechAPI.active = true;
      SpeechAPI.error = null;
    } catch (e) {
      SpeechAPI.active = false;
      SpeechAPI.error = e.message;
    }
  },
  onStartRecognition: function() {
    console.log("onStartRecognition");
    SpeechAPI.objects.recognition.start();
  },
  onStopRecognition: function() {
    console.log("onStopRecognition");
    SpeechAPI.objects.recognition.stop();
  },
  onSpeechEnd: function() {
    console.log("onSpeechEnd");
    SpeechAPI.onStopRecognition();
    if (typeof SpeechAPI.speechEndCallback == "function") {
      SpeechAPI.speechEndCallback();
    }
  },
  afterRecognition: function(results) {
    var command = "";
    if (results) {
      var last = results.length - 1;
      command = results[last][0].transcript;
    }
    command = command.toLowerCase;
    SpeechAPI.lastDetectedCommand = command;
    if (typeof SpeechAPI.recognitionCallback == "function") {
      SpeechAPI.recognitionCallback(command);
    }
  },
  deactivate: function(callback) {
    SpeechAPI.active = false;
    SpeechAPI.error = null;
    SpeechAPI.objects.recognition.stop();
    if (typeof callback == "function") {
      callback();
    }
  },
  speechEndCallback: null,
  recognitionCallback: null,
  lastDetectedCommand: ""
};
