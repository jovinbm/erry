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
        try {
          logger(JSON.stringify(e, null, 4));
        }
        catch (e) {
          console.warn('Erry Logger: Failed to stringify error');
          console.log(e);
        }
      }
      else {
        logger(self.stack);
        delete e.stack;
        try {
          logger(JSON.stringify(e, null, 4));
        }
        catch (e) {
          console.warn('Erry Logger: Failed to stringify error');
          console.log(e);
        }
      }
    }
    else {
      logger(self.stack);
      delete e.stack;
      try {
        logger(JSON.stringify(e, null, 4));
      }
      catch (e) {
        console.warn('Erry Logger: Failed to stringify error');
        console.log(e);
      }
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