var KeyboardController = {
    init: function() {
        Render.getSVG().on(document, 'keydown', function(e) {
            Game.padDirection = e.keyCode == 40 ? 1 : e.keyCode == 38 ? -1 : 0;
            e.preventDefault()
        })
        Render.getSVG().on(document, 'keyup', function(e) {
            Game.padDirection = 0;
            e.preventDefault();
        })
    }
}