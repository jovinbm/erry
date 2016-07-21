var extend = require('extend');

/**
 *
 * @param {Error|Erry} [error]
 * @returns {Erry}
 * @constructor
 */
function Erry(error) {
  var self = this;
  
  self._defaults = {
    name   : 'Error',
    message: 'Something went wrong while performing that request'
  };
  
  self._payload = {
    fatal          : false,
    notification   : {
      status: false,
      type  : 'info',
      msg   : self._defaults.message
    },
    code           : 500,
    name           : self._defaults.name,
    message        : self._defaults.message,
    handled        : false,
    logout         : false,
    request        : null,
    redirect       : {
      status: false, // whether to redirect
      url   : ''     // url/path
    },
    error_data     : [], // data to include in the error e.g. ajv errors
    instance_errors: [],
  };
  
  // emulate norma error
  self.name    = self._defaults.name;
  self.message = self._defaults.message;
  self.stack   = (new Error()).stack;
  
  if (error && typeof error === 'object') {
    
    if (error instanceof Erry) {
      self._payload = extend(self._payload, error._payload);
    }
    
    if (error instanceof Error) {
      
      // also includes instances of Erry
      
      self.name    = error.name;
      self.message = error.message;
      self.stack   = error.stack;
    }
    
    // copy remaining error properties:
    
    for (var prop in error) {
      if (error.hasOwnProperty(prop) && !self.hasOwnProperty(prop)) {
        self[prop] = error[prop];
      }
    }
    
  }
  
  return self;
}

// prototypically inherit from the Error constructor
Erry.prototype             = Object.create(Error.prototype);
Erry.prototype.constructor = Erry;

/**
 *
 * @param {*} data
 * @returns {Erry}
 */
Erry.prototype.data = function (data) {
  var self = this;
  self._payload.error_data.push(data);
  return self;
};

/**
 *
 * @returns {Erry}
 */
Erry.prototype.fatal = function () {
  var self            = this;
  self._payload.fatal = true;
  return self;
};

/**
 *
 * @returns {Erry}
 */
Erry.prototype.handled = function () {
  var self              = this;
  self._payload.handled = true;
  return self;
};

/**
 *
 * @param {string} url
 * @returns {Erry}
 */
Erry.prototype.request = function (url) {
  var self = this;
  
  if (typeof url !== 'string') {
    self._payload.instance_errors.push(`.request: Received url of type ${typeof url}`);
    return self;
  }
  
  if (url.length === 0) {
    self._payload.instance_errors.push(`.request: Received url of length 0`);
    return self;
  }
  
  self._payload.request = url;
  
  return self;
};

/**
 *
 * @param {string} type - [info|warning|error]
 * @param {string} msg
 * @returns {Erry}
 */
Erry.prototype.notify = function (type = 'info', msg) {
  var self = this;
  
  self._payload.notification.status = true;
  
  // check type
  if (typeof type !== 'string') {
    self._payload.instance_errors.push(`.notify: Received type of type ${typeof msg}`);
    type = 'info';
  }
  
  if (type.length === 0) {
    self._payload.instance_errors.push(`.notify: Received type of length 0`);
    type = 'info';
  }
  
  if (['error', 'warning', 'info'].indexOf(type) === -1) {
    self._payload.instance_errors.push(`.notify: Unknown error type ${type}`);
    type = 'info';
  }
  
  self._payload.notification.type = type;
  
  // check msg
  if (typeof msg !== 'string') {
    self._payload.instance_errors.push(`.notify: Received msg of type ${typeof msg}`);
    msg = self._defaults.message;
  }
  
  if (msg.length === 0) {
    self._payload.instance_errors.push(`.notify: Received msg of length 0`);
    msg = self._defaults.message;
  }
  
  self._payload.notification.msg = msg;
  
  if (self._payload.message === self._defaults.message) {
    self._payload.message = msg;
  }
  
  return self;
};

/**
 *
 * @param {string} message
 * @returns {Erry}
 */
Erry.prototype.systemError = function (message) {
  var self = this;
  
  // incur system error code
  self._payload.code = 500;
  
  // add fatal flag
  self._payload.fatal = true;
  
  // check message
  if (typeof message !== 'string') {
    self._payload.instance_errors.push(`.systemError: Received message of type ${typeof message}`);
    message = self._defaults.message;
  }
  
  if (message.length === 0) {
    self._payload.instance_errors.push(`.notify: Received msg of length 0`);
    message = self._defaults.message;
  }
  
  if (!self._payload.notification.status) {
    self._payload.notification.status = true;
    self._payload.notification.msg    = self._defaults.message;
  }
  
  // override
  self._payload.notification.type = 'warning';
  
  // change iff not default
  if (self._payload.message === self._defaults.message) {
    self._payload.message = message;
  }
  
  // change iff not default
  if (self.message === self._defaults.message) {
    self.message = message;
  }
  
  return self;
};

/**
 *
 * @param {number} code
 * @returns {Erry}
 */
Erry.prototype.code = function (code = 500) {
  var self = this;
  if (typeof code !== 'number') {
    self._payload.instance_errors.push(`.code: Received code of type ${typeof code}`);
    code = 500;
  }
  
  self._payload.code = code;
  
  return self;
};

/**
 *
 * @param {string} name
 * @returns {Erry}
 */
Erry.prototype.setName = function (name) {
  var self = this;
  if (typeof name !== 'string') {
    self._payload.instance_errors.push(`.name: Received name of type ${typeof name}`);
    name = self._defaults.name;
  }
  
  if (name.length === 0) {
    self._payload.instance_errors.push(`.name: Received name of length 0`);
    name = self._defaults.name;
  }
  
  self._payload.name = name;
  
  // if self.name is still default, change it
  if (self.name === self._defaults.name) {
    self.name = name;
  }
  
  return self;
};

/**
 *
 * @param {string} message
 * @returns {Erry}
 */
Erry.prototype.setMessage = function (message) {
  var self = this;
  
  if (typeof message !== 'string') {
    self._payload.instance_errors.push(`.message: Received message of type ${typeof message}`);
    message = self._defaults.message;
  }
  
  if (message.length === 0) {
    self._payload.instance_errors.push(`.message: Received message of length 0`);
    message = self._defaults.message;
  }
  
  self._payload.message = message;
  
  // if self.message is still default, change it
  if (self.message === self._defaults.message) {
    self.message = message;
  }
  
  return self;
};

/**
 *
 * @param {string} url
 * @returns {Erry}
 */
Erry.prototype.redirect = function (url) {
  var self = this;
  
  if (typeof url !== 'string') {
    self._payload.instance_errors.push(`.url: Received url of type ${typeof url}`);
    return self;
  }
  
  if (url.length === 0) {
    self._payload.instance_errors.push(`.url: Received url of length 0`);
    return self;
  }
  
  self._payload.redirect = {
    status: true,
    url   : url
  };
  
  return self;
};

/**
 *
 * @returns {Erry}
 */
Erry.prototype.logout = function () {
  var self             = this;
  self._payload.logout = true;
  return self;
};

exports.Erry = Erry;