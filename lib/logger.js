var colors = require('colors');
var extend = require('extend');

module.exports = function (d) {
  d.prototype.log = function () {
    var e = extend({}, e, true);
    
    if (e._payload) {
      if (e._payload.fatal) {
        console.error(colors.red(e.stack));
        delete e.stack;
        console.error(colors.red(JSON.stringify(e, null, 4)));
      }
      else {
        console.error(colors.yellow(e.stack));
        delete e.stack;
        console.error(colors.yellow(JSON.stringify(e, null, 4)));
      }
    }
    else {
      console.error(colors.red(e.stack));
      delete e.stack;
      console.error(colors.red(JSON.stringify(e, null, 4)));
    }
  };
};