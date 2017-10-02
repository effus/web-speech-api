var Telemetry = {
  monitor: null,
  targets: [],
  init: function(monitorId, targets) {
    this.targets = targets;
    this.monitor = document.getElementById(monitorId);
    if (this.monitor) {
      this.monitor.style.display = 'block';
    } else
      console.log('Monitor object with ID [' + monitorId + '] not found');
    if (this.targets) {
      for (var i in this.targets) {
        this.send(this.targets[i], 0);
      }
    }
  },
  send: function(targetId, value) {
    document.getElementById(targetId).innerHTML = value;
  }
}
