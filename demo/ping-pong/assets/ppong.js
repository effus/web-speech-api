var PPong = {
    telemetry: Telemetry,
    controllers: {
        keyboard: KeyboardController,
        voice: VoiceController,
        activeName: 'keyboard',
        init: function() {},
        getActive: function() {
            if (this.activeName) {
                return this[this.activeName];
            } else
                throw Error('No active controller');
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
            callback: PPong.actions.onStartBtnClick
        }, {
            id: 'voiceSetupBtn',
            callback: PPong.actions.onSetupMicBtnClick
        }, {
            id: 'voiceBtn',
            callback: PPong.actions.onMicBtnClick
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
        Game.init();
    },
    actions: {
        onStartBtnClick: function() {
            if (Game.started) {
                Game.stop();
            } else {
                Game.start();
            }
        },
        onSetupMicBtnClick: function() {

        },
        onMicBtnClick: function() {

        }
    }
}
var Game = {
    started: false,
    difficulty: 2,
    padDirection: 0,
    padSpeed: 5,
    init: function() {
        console.log('game inited');
    },
    start: function() {
        Render.construct();
    },
    stop: function() {
        Render.destruct();
    }
};
var Render = {
    construct: function() {
        this.optimize();
        this.drawArea();
        this.onFrame();
    },
    destruct: function() {

    },
    optimize: function() {
        gameObjs.area.width = this.getAreaObj().offsetWidth;
        gameObjs.area.height = this.getAreaObj().offsetHeight;
        gameObjs.padWidth = this.getAreaObj().offsetWidth / 200;
        gameObjs.padHeight = this.getAreaObj().offsetHeight / 5;
    },
    drawArea: function() {
        var background = this.getSVG().rect(gameObjs.area.width, gameObjs.area.height).fill(gameObjs.area.bgColor)
            // draw line
        var line = this.getSVG().line(gameObjs.area.width / 2, 0, gameObjs.area.width / 2, gameObjs.area.height)
        line.stroke({ width: gameObjs.area.lineWidth, color: gameObjs.area.lineColor, dasharray: '5,5' })
            // create and position left paddle
        gameObjs.left.pad = this.getSVG().rect(gameObjs.padWidth, gameObjs.padHeight)
        gameObjs.left.pad.x(0).cy(gameObjs.area.height / 2).fill(gameObjs.left.color)
            // create and position right paddle
        gameObjs.right.pad = gameObjs.left.pad.clone()
        gameObjs.right.pad.x(gameObjs.area.width - gameObjs.padWidth).fill(gameObjs.right.color)
            // create ball
        gameObjs.ball.obj = this.getSVG().circle(gameObjs.ball.size)
        gameObjs.ball.obj.center(gameObjs.area.width / 2, gameObjs.area.height / 2).fill(gameObjs.ball.color)
            // create text for the score, set font properties
        gameObjs.left.score.obj = this.getSVG().text(gameObjs.left.score.value + '').font({
                size: 16,
                family: 'Menlo, sans-serif',
                anchor: 'end',
                fill: '#fff'
            }).move(gameObjs.area.width / 2 - 10, 10)
            // cloning rocks!
        gameObjs.right.score.obj = gameObjs.left.score.obj.clone()
            .text(gameObjs.right.score.value + '')
            .font('anchor', 'start')
            .x(gameObjs.area.width / 2 + 10)
            //PPong.callback()
            //gameObjs.right.initControls();
            //gameObjs.ball.colorObj = new SVG.Color(gameObjs.ball.color)
            //gameObjs.ball.colorObj.morph(gameObjs.ball.color)
        gameObjs.ball.colorObj = new SVG.Color(gameObjs.ball.color)
        gameObjs.ball.colorObj.morph(gameObjs.ball.color)
    },
    getAreaObj: function() {
        if (!gameObjs.area.obj) {
            gameObjs.area.obj = document.getElementById(gameObjs.area.containerId);
        }
        return gameObjs.area.obj;
    },
    getSVG: function() {
        if (!gameObjs.area.svg) {
            gameObjs.area.svg = SVG(gameObjs.area.containerId).size(gameObjs.area.width, gameObjs.area.height);
            gameObjs.area.svg.viewbox(0, 0, gameObjs.area.width, gameObjs.area.height);
        }
        return gameObjs.area.svg;
    },
    drawPositions: function(delta) {

    },
    onFrame: function(ms) {
        // we get passed a timestamp in milliseconds
        // we use it to determine how much time has passed since the last call
        if (gameObjs.lastTime) {
            Render.drawPositions((ms - gameObjs.lastTime) / 1000) // call update and pass delta time in seconds
        }
        gameObjs.lastTime = ms;
        gameObjs.animFrame = requestAnimationFrame(Render.onFrame);
    }
}

var gameObjs = {
    lastTime: null,
    animFrame: null,
    padWidth: 15,
    padHeight: 80,
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
        svg: null,
        containerId: 'content',
        bgColor: '#003d02',
        lineColor: '#777777',
        lineWidth: 2,
        width: 450,
        height: 300
    }
};