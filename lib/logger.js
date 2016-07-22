var colors = require('colors');

module.exports = function (d) {
  d.prototype.log = function () {
    var self = this;
    
    if (self._payload) {
      if (self._payload.fatal) {
        console.error(colors.red(self.stack));
        console.error(colors.red(JSON.stringify(self, null, 4)));
      }
      else {
        console.error(colors.yellow(self.stack));
        console.error(colors.yellow(JSON.stringify(self, null, 4)));
      }
    }
    else {
      console.error(colors.red(self.stack));
      console.error(colors.red(JSON.stringify(self, null, 4)));
    }
  };
};