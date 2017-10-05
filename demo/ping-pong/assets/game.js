var Game = {
  started: false,
  paused: false,
  difficulty: 2,
  padDirection: 0,
  padSpeed: 5,
  init: function() {
    PPong.controllers.getActive().resumeCallback = function() {
      if (Game.started) {
        Render.resume();
        Game.paused = false;
      }
    };
  },
  start: function() {
    if (!this.started) {
      Render.construct();
      Render.randomizeOnStart();
      this.started = true;
      this.paused = false;
    }
  },
  stop: function() {
    if (this.started) {
      Render.destruct();
      this.started = false;
      this.paused = false;
    }
  },
  scores: {
    left: 0,
    right: 0
  },
  goal: function(winnerSide) {
    Game.scores[winnerSide]++;
    Game.paused = true;
  }
};
