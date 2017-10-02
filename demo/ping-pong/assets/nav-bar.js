var NavBar = {
  init: function(buttons) {
    for (var i in buttons) {
      document
        .getElementById(buttons[i].id)
        .addEventListener("click", buttons[i].callback);
    }
  },
  getBtn: function(btnId) {
    return document.getElementById(btnId);
  }
};
