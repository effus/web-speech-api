var PPong = {
  props: {
    padWidth: 15,
    padHeight: 80,
    difficulty: 2,
    lastTime: null,
    animFrame: null,
    padDirection: 0,
    padSpeed: 5
  },
  objs: {
    left: {
      pad: null,
      color: '#008dd3',
      score: {
        obj: null,
        value: 0
      }
    },
    right: {
      pad: null,
      color: '#ffc200',
      score: {
        obj: null,
        value: 0
      }
    },
    ball: {
      obj: null,
      color: '#fff',
      size: 10,
      x: null,
      y: null,
      vx: 0,
      vy: 0,
      colorObj: null
    },
    area: {
      obj: null,
      container: 'content',
      bgColor: '#003d02',
      lineColor: '#777777',
      lineWidth: 2,
      width: 450,
      height: 300
    }
  },
  telemetry: Telemetry,
  controllers: {
    keyboard: KeyboardController,
    voice: VoiceController,
    activeName: null,
    init: function() {},
    getActive: function() {
      if (this.activeName) {
        return this[this.activeName];
      }
    },
    setActive: function(name) {
      if (typeof this[name] !== undefined) {
        this.activeName = name;
        this.onChange(name);
      }
    },
    onChange: function(name) {}
  },
  navigation: NavBar,
  init: function(config) {
    // Init Navigation buttons
    this.navigation.init([{
      id: 'playBtn',
      callback: "PPong.actions.onStartBtnClick"
    }, {
      id: 'voiceSetupBtn',
      callback: "PPong.actions.onSetupMicBtnClick"
    }, {
      id: 'voiceBtn',
      callback: "PPong.actions.onMicBtnClick"
    }]);
    // Init telemetry
    this.telemetry.init("telemetry", ["t-difficulty", "t-speed", "t-vx",
      "t-vy", "t-cmd", "t-mode", "t-controller"
    ]);
    // init default controller - keyboard
    this.controllers.onChange = function(name) {
      PPong.telemetry.send("t-controller", name);
    }
    this.controllers.setActive('keyboard');
    this.controllers.getActive().init();
  },
  actions: {
    onStartBtnClick: function() {

    },
    onSetupMicBtnClick: function() {

    },
    onMicBtnClick: function() {

    }
  }
}
var Game = {
  init: function() {

  }
};
