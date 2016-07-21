/**
 *
 * @param {object} opts
 * @param {number|string} opts.code
 * @returns {Errc}
 * @constructor
 */
function Errc(opts) {
  var self = this;
  
  self.name    = 'Errc';
  self.message = 'Errc';
  self.stack   = (new Error()).stack;
  
  for (var prop in opts) {
    if (opts.hasOwnProperty(prop)) {
      self[prop] = opts[prop];
    }
  }
  
  Error.captureStackTrace(self, Errc);
  return self;
}

// prototypically inherit from the Error constructor
Errc.prototype             = Object.create(Error.prototype);
Errc.prototype.constructor = Errc;

exports.Errc = Errc;