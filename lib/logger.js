module.exports = function (d) {
  
  /**
   *
   * @param {function} [logger]
   */
  d.prototype.log = function (logger) {
    const self = this;
    
    logger = logger || console.error;
    
    const e = Object.assign({}, self);
    
    if (e._payload) {
      
      if (!e._payload.print) {
        return self.logMinimal(logger);
      }
      
    }
    
    if (e._payload) {
      if (e._payload.fatal) {
        logger(self.stack);
        delete e.stack;
        logger(JSON.stringify(e, null, 4));
      }
      else {
        logger(self.stack);
        delete e.stack;
        logger(JSON.stringify(e, null, 4));
      }
    }
    else {
      logger(self.stack);
      delete e.stack;
      logger(JSON.stringify(e, null, 4));
    }
  };
  
  /**
   *
   * @param {function} [logger]
   */
  d.prototype.logMinimal = function (logger) {
    const self = this;
    
    logger = logger || console.error;
    
    const e = Object.assign({}, self);
    
    if (e._payload) {
      
      const c = new Error(e.message);
      
      c.name         = e.name;
      c.code         = e._payload.code;
      c.notification = e._payload.notification;
      e.print        = e._payload.print;
      e.fatal        = e._payload.fatal;
      delete c.stack;
      
      logger(JSON.stringify(c, null, 4));
      
    }
    else {
      const c = new Error(e.message);
      
      c.name = e.name;
      delete c.stack;
      logger(JSON.stringify(c, null, 4));
    }
  };
  
};