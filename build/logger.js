'use strict';var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};module.exports = function (d) {

  /**
                                                                                                                                                                                                                                                                                                    *
                                                                                                                                                                                                                                                                                                    * @param {function} [logger]
                                                                                                                                                                                                                                                                                                    */
  d.prototype.log = function (logger) {
    var self = this;

    logger = logger || console.error;

    var e = _extends({}, self);

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
          console.log(JSON.stringify(e, null, 4));
        }
      } else
      {
        logger(self.stack);
        delete e.stack;
        try {
          logger(JSON.stringify(e, null, 4));
        }
        catch (e) {
          console.warn('Erry Logger: Failed to stringify error');
          console.log(JSON.stringify(e, null, 4));
        }
      }
    } else
    {
      logger(self.stack);
      delete e.stack;
      try {
        logger(JSON.stringify(e, null, 4));
      }
      catch (e) {
        console.warn('Erry Logger: Failed to stringify error');
        console.log(JSON.stringify(e, null, 4));
      }
    }
  };

  /**
      *
      * @param {function} [logger]
      */
  d.prototype.logMinimal = function (logger) {
    var self = this;

    logger = logger || console.error;

    var e = _extends({}, self);

    if (e._payload) {

      var c = new Error(e.message);

      c.name = e.name;
      c.code = e._payload.code;
      c.notification = e._payload.notification;
      e.print = e._payload.print;
      e.fatal = e._payload.fatal;
      delete c.stack;

      logger(JSON.stringify(c, null, 4));

    } else
    {
      var _c = new Error(e.message);

      _c.name = e.name;
      delete _c.stack;
      logger(JSON.stringify(_c, null, 4));
    }
  };

};