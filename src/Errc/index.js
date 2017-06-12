/**
 *
 * @param {object} opts
 * @param {number|string} opts.code
 * @returns {Errc}
 * @constructor
 */
const Errc = function (opts) {
  const self = this;
  
  self.name    = 'Errc';
  self.message = 'Errc';
  self.stack   = (new Error()).stack;
  
  for (const prop in opts) {
    if (opts.hasOwnProperty(prop)) {
      self[prop] = opts[prop];
    }
  }
  
  Error.captureStackTrace(self, Errc);
  
  return self;
};

// prototypically inherit from the Error constructor
Errc.prototype             = Object.create(Error.prototype);
Errc.prototype.constructor = Errc;

// add logger
require('../logger')(Errc);

module.exports = Errc;