module.exports = function (d) {
  
  d.prototype.log = function () {
    const self = this;
    
    const e = Object.assign({}, self);
    
    if (e._payload) {
      if (e._payload.fatal) {
        console.error(self.stack);
        delete e.stack;
        console.error(JSON.stringify(e, null, 4));
      }
      else {
        console.error(self.stack);
        delete e.stack;
        console.error(JSON.stringify(e, null, 4));
      }
    }
    else {
      console.error(self.stack);
      delete e.stack;
      console.error(JSON.stringify(e, null, 4));
    }
  };
  
};