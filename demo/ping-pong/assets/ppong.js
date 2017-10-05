var PPong = {
  telemetry: Telemetry,
  controllers: {
    keyboard: KeyboardController,
    voice: VoiceController,
    activeName: "keyboard",
    init: function() {},
    getActive: function() {
      if (this.activeName) {
        return this[this.activeName];
      } else throw Error("No active controller");
    },
    setActive: function(name) {
      this.keyboard.destruct();
      this.voice.destruct();
      if (typeof this[name] !== undefined) {
        this.activeName = name;
        this.getActive().construct();
        this.onChange(name);
      }
    },
    onChange: function(name) {},
    onError: function(error) {
      alert(error);
    }
  },
  navigation: NavBar,
  init: function(config) {
    // Init navigation bar buttons
    this.navigation.init([
      {
        id: "playBtn",
        callback: PPong.actions.onStartBtnClick
      },
      {
        id: "voiceSetupBtn",
        callback: PPong.actions.onSetupMicBtnClick
      },
      {
        id: "voiceBtn",
        callback: PPong.actions.onMicBtnClick
      }
    ]);
    // Init telemetry
    this.telemetry.init("telemetry", [
      "t-difficulty",
      "t-speed",
      "t-vx",
      "t-vy",
      "t-cmd",
      "t-mode",
      "t-controller",
      "t-frames"
    ]);
    // init default controller - keyboard
    this.controllers.onChange = function(name) {
      PPong.telemetry.send("t-controller", name);
    };
    this.controllers.setActive("keyboard");
    // init game logic
    Game.init();
  },
  actions: {
    onStartBtnClick: function() {
      if (Game.started) {
        Game.stop();
        PPong.navigation
          .getBtn("playBtn")
          .querySelector("i.material-icons").innerHTML =
          "play_arrow";
        PPong.navigation.getBtn("playBtn").className = "";
      } else {
        Game.start();
        PPong.navigation
          .getBtn("playBtn")
          .querySelector("i.material-icons").innerHTML =
          "pause_circle_outline";
        PPong.navigation.getBtn("playBtn").className = "red";
      }
    },
    onSetupMicBtnClick: function() {},
    onMicBtnClick: function() {
      if (PPong.controllers.activeName == "keyboard") {
        PPong.controllers.onError = function(errorMsg) {
          PPong.controllers.setActive("keyboard");
          PPong.navigation.getBtn("voiceBtn").className = "";
          alert(errorMsg);
        };
        PPong.controllers.setActive("voice");
        PPong.navigation.getBtn("voiceBtn").className = "red";
      } else {
        PPong.controllers.setActive("keyboard");
        PPong.navigation.getBtn("voiceBtn").className = "";
      }
    }
  }
};
var Render = {
  construct: function() {
    this.optimize();
    this.drawArea();
    this.onFrame();
  },
  destruct: function() {
    gameObjs.lastTime = null;
    cancelAnimationFrame(gameObjs.animFrame);
  },
  optimize: function() {
    gameObjs.area.width = this.getAreaObj().offsetWidth;
    gameObjs.area.height = this.getAreaObj().offsetHeight;
    gameObjs.padWidth = this.getAreaObj().offsetWidth / 200;
    gameObjs.padHeight = this.getAreaObj().offsetHeight / 5;
  },
  randomizeOnStart: function() {
    gameObjs.ball.vx = Math.random() * 500 - 150;
    PPong.telemetry.send("t-vx", gameObjs.ball.vx);
    gameObjs.ball.vy = Math.random() * 500 - 150;
    PPong.telemetry.send("t-vy", gameObjs.ball.vy);
    Game.difficulty = Math.round(Math.random() * 5);
    PPong.telemetry.send("t-difficulty", Game.difficulty);
  },
  drawArea: function() {
    var background = this.getSVG()
      .rect(gameObjs.area.width, gameObjs.area.height)
      .fill(gameObjs.area.bgColor);
    // draw line
    var line = this.getSVG().line(
      gameObjs.area.width / 2,
      0,
      gameObjs.area.width / 2,
      gameObjs.area.height
    );
    line.stroke({
      width: gameObjs.area.lineWidth,
      color: gameObjs.area.lineColor,
      dasharray: "5,5"
    });
    // create and position left paddle
    gameObjs.left.pad = this.getSVG().rect(
      gameObjs.padWidth,
      gameObjs.padHeight
    );
    gameObjs.left.pad
      .x(0)
      .cy(gameObjs.area.height / 2)
      .fill(gameObjs.left.color);
    // create and position right paddle
    gameObjs.right.pad = gameObjs.left.pad.clone();
    gameObjs.right.pad
      .x(gameObjs.area.width - gameObjs.padWidth)
      .fill(gameObjs.right.color);
    // create ball
    gameObjs.ball.obj = this.getSVG().circle(gameObjs.ball.size);
    gameObjs.ball.obj
      .center(gameObjs.area.width / 2, gameObjs.area.height / 2)
      .fill(gameObjs.ball.color);
    // create text for the score, set font properties
    gameObjs.left.score.obj = this.getSVG()
      .text(gameObjs.left.score.value + "")
      .font({
        size: 16,
        family: "Menlo, sans-serif",
        anchor: "end",
        fill: "#fff"
      })
      .move(gameObjs.area.width / 2 - 10, 10);
    // cloning rocks!
    gameObjs.right.score.obj = gameObjs.left.score.obj
      .clone()
      .text(gameObjs.right.score.value + "")
      .font("anchor", "start")
      .x(gameObjs.area.width / 2 + 10);
    gameObjs.ball.colorObj = new SVG.Color(gameObjs.ball.color);
    gameObjs.ball.colorObj.morph(gameObjs.ball.color);
  },
  getAreaObj: function() {
    if (!gameObjs.area.obj) {
      gameObjs.area.obj = document.getElementById(gameObjs.area.containerId);
    }
    return gameObjs.area.obj;
  },
  getSVG: function() {
    if (!gameObjs.area.svg) {
      gameObjs.area.svg = SVG(gameObjs.area.containerId).size(
        gameObjs.area.width,
        gameObjs.area.height
      );
      gameObjs.area.svg.viewbox(
        0,
        0,
        gameObjs.area.width,
        gameObjs.area.height
      );
    }
    return gameObjs.area.svg;
  },
  drawAI: function(cy) {
    var paddleLeftCy = gameObjs.left.pad.cy();
    var dy = Math.min(Game.difficulty, Math.abs(cy - paddleLeftCy));
    paddleLeftCy += cy > paddleLeftCy ? dy : -dy;
    // constraint the move to the canvas area
    gameObjs.left.pad.cy(
      Math.max(
        gameObjs.padHeight / 2,
        Math.min(gameObjs.area.height - gameObjs.padHeight / 2, paddleLeftCy)
      )
    );
  },
  drawPositions: function(delta) {
    // move the ball by its velocity
    gameObjs.ball.obj.dmove(gameObjs.ball.vx * delta, gameObjs.ball.vy * delta);
    // get position of ball
    var cx = gameObjs.ball.obj.cx(),
      cy = gameObjs.ball.obj.cy();
    // move left paddle to the ball
    this.drawAI(cy);
    // check if we hit top/bottom borders
    if (
      (gameObjs.ball.vy < 0 && cy <= 0) ||
      (gameObjs.ball.vy > 0 && cy >= gameObjs.area.height)
    ) {
      gameObjs.ball.vy = -gameObjs.ball.vy;
      PPong.telemetry.send("t-vy", gameObjs.ball.vy);
    }
    var paddleLeftY = gameObjs.left.pad.y(),
      paddleRightY = gameObjs.right.pad.y();
    // check if we hit the paddle
    if (
      (gameObjs.ball.vx < 0 &&
        cx <= gameObjs.padWidth &&
        cy > paddleLeftY &&
        cy < paddleLeftY + gameObjs.padHeight) ||
      (gameObjs.ball.vx > 0 &&
        cx >= gameObjs.area.width - gameObjs.padWidth &&
        cy > paddleRightY &&
        cy < paddleRightY + gameObjs.padHeight)
    ) {
      // depending on where the ball hit we adjust y velocity
      // for more realistic control we would need a bit more math here
      // just keep it simple
      gameObjs.ball.vy =
        (cy -
          ((gameObjs.ball.vx < 0 ? paddleLeftY : paddleRightY) +
            gameObjs.padHeight / 2)) *
        7; // magic factor
      // make the ball faster on hit
      gameObjs.ball.vx = -gameObjs.ball.vx * 1.05;
      PPong.telemetry.send("t-vx", gameObjs.ball.vx);
    } else if (
      (gameObjs.ball.vx < 0 && cx <= 0) ||
      (gameObjs.ball.vx > 0 && cx >= gameObjs.area.width)
    ) {
      // check if we hit left/right borders
      // when x-velocity is negative, it's a point for player 2, otherwise player 1
      if (gameObjs.ball.vx < 0) {
        Game.goal("right");
        this.drawScore("right", Game.scores.right);
      } else {
        Game.goal("left");
        this.drawScore("left", Game.scores.left);
      }
      this.drawBoom();
      this.reset();
    }

    // calculate direction
    if (!this.direction.activeFrame) {
      // pad not moves
      if (PPong.controllers.getActive().direction != "none") {
        Game.padDirection =
          PPong.controllers.getActive().direction == "up" ? -1 : 1;
        this.direction.activeFrame++;
        PPong.telemetry.send("t-cmd", PPong.controllers.getActive().direction);
      } else {
        Game.padDirection = 0;
      }
    } else {
      this.direction.activeFrame++;
      if (this.direction.activeFrame > this.direction.timing) {
        Game.padDirection = 0;
        this.direction.activeFrame = 0;
      }
    }

    // move player paddle
    var playerPaddleY = gameObjs.right.pad.y();
    if (playerPaddleY <= 0 && Game.padDirection == -1) {
      gameObjs.right.pad.cy(gameObjs.padHeight / 2);
    } else if (
      playerPaddleY >= gameObjs.area.height - gameObjs.padHeight &&
      Game.padDirection == 1
    ) {
      gameObjs.right.pad.y(gameObjs.area.height - gameObjs.padHeight);
    } else {
      gameObjs.right.pad.dy(Game.padDirection * Game.padSpeed);
    }
    // update ball color based on position
    gameObjs.ball.obj.fill(
      gameObjs.ball.colorObj.at(1 / gameObjs.area.width * gameObjs.ball.obj.x())
    );
  },
  framesCnt: 0,
  direction: {
    activeFrame: 0,
    timing: 10
  },
  onFrame: function(ms) {
    // we get passed a timestamp in milliseconds
    // we use it to determine how much time has passed since the last call
    if (gameObjs.lastTime) {
      Render.drawPositions((ms - gameObjs.lastTime) / 1000); // call update and pass delta time in seconds
    }
    gameObjs.lastTime = ms;
    gameObjs.animFrame = requestAnimationFrame(Render.onFrame);
    Render.framesCnt++;
    PPong.telemetry.send("t-frames", Render.framesCnt + "");
  },
  drawScore: function(objName, value) {
    gameObjs.get(objName).score.obj.text(value + "");
  },
  drawBoom: function() {
    // detect winning player
    var paddle =
      gameObjs.ball.obj.cx() > gameObjs.area.width / 2
        ? gameObjs.left.pad
        : gameObjs.right.pad;
    // create the gradient
    var gradient = gameObjs.area.svg.gradient("radial", function(stop) {
      stop.at(0, paddle.attr("fill"), 1);
      stop.at(1, paddle.attr("fill"), 0);
    });
    // create circle to carry the gradient
    var blast = gameObjs.area.svg.circle(300);
    blast.center(gameObjs.ball.obj.cx(), gameObjs.ball.obj.cy()).fill(gradient);
    // animate to invisibility
    blast
      .animate(1000, ">")
      .opacity(0)
      .after(function() {
        blast.remove();
      });
  },
  reset: function() {
    gameObjs.ball.vx = 0;
    gameObjs.ball.vy = 0;
    // position the ball back in the middle
    gameObjs.ball.obj
      .animate(100)
      .center(gameObjs.area.width / 2, gameObjs.area.height / 2);
    // reset the position of the paddles
    gameObjs.left.pad.animate(100).cy(gameObjs.area.height / 2);
    gameObjs.right.pad.animate(100).cy(gameObjs.area.height / 2);
  },
  resume: function() {
    if (Game.paused) {
      Render.randomizeOnStart();
    }
  }
};
var gameObjs = {
  lastTime: null,
  animFrame: null,
  padWidth: 15,
  padHeight: 80,
  get: function(name) {
    return this[name];
  },
  left: {
    pad: null,
    color: "#008dd3",
    score: {
      obj: null,
      value: 0
    }
  },
  right: {
    pad: null,
    color: "#ffc200",
    score: {
      obj: null,
      value: 0
    }
  },
  ball: {
    obj: null,
    color: "#fff",
    size: 10,
    x: null,
    y: null,
    vx: 0,
    vy: 0,
    colorObj: null
  },
  area: {
    obj: null,
    svg: null,
    containerId: "content",
    bgColor: "#003d02",
    lineColor: "#777777",
    lineWidth: 2,
    width: 450,
    height: 300
  }
};
