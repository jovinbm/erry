var extend = require('extend');

module.exports = function (d) {
  d.prototype.log = function () {
    var self = this;
    
    var e = {};
    extend(true, e, self);
    
    if (e._payload) {
      if (e._payload.fatal) {
        console.error(self.stack, "color: red");
        delete e.stack;
        console.error(JSON.stringify(e, null, 4), "color: red");
      }
      else {
        console.error(self.stack, "color: yellow");
        delete e.stack;
        console.error(JSON.stringify(e, null, 4), "color: yellow");
      }
    }
    else {
      console.error(self.stack, "color: red");
      delete e.stack;
      console.error(JSON.stringify(e, null, 4), "color: red");
    }
  };
};