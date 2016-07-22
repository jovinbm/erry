var colors = require('colors');
var extend = require('extend');

module.exports = function (d) {
  d.prototype.log = function () {
    var self = this;
    
    var e = {};
    extend(true, e, self);
    
    if (e._payload) {
      if (e._payload.fatal) {
        console.error(colors.red(self.stack));
        delete e.stack;
        console.error(colors.red(JSON.stringify(e, null, 4)));
      }
      else {
        console.error(colors.yellow(self.stack));
        delete e.stack;
        console.error(colors.yellow(JSON.stringify(e, null, 4)));
      }
    }
    else {
      console.error(colors.red(self.stack));
      delete e.stack;
      console.error(colors.red(JSON.stringify(e, null, 4)));
    }
  };
};