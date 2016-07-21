var extend           = require('extend');
var errorCodeMessage = require('./errorCodeMessage').errorCodeMessage;

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
    messages       : [self._defaults.message],
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
  self.name    = 'Erry Error';
  self.message = '';
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
 * Private: Applies message to self.message, self._payload.messages of
 * the error IF they are still default
 * @param {string} message
 * @returns {Erry}
 * @private
 */
Erry.prototype._applyMessage = function (message) {
  var self = this;
  
  if (typeof message !== 'string') {
    self._payload.instance_errors.push(`._applyMessage: Received message of type ${typeof message}`);
    return self;
  }
  
  if (message.length === 0) {
    self._payload.instance_errors.push(`._applyMessage: Received message of length 0`);
    return self;
  }
  
  if (!self.message) {
    self.message = message;
  }
  
  // change iff not default
  if (message !== self._defaults.message) {
    
    // ignore if last is equal to message
    if (self._payload.messages[self._payload.messages.length - 1] !== message) {
      self._payload.messages.push(message);
    }
  }
  
  return self;
};

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
 * @param {boolean} [status=true]
 * @param {string} [type] - [info|warning|error]
 * @param {string} [msg] - Notification message. This msg is applied to self.message, self._payload.message (If they are not changed)
 * @returns {Erry}
 */
Erry.prototype.notify = function (status = true, type = 'info', msg) {
  var self = this;
  
  // check status
  if (typeof type !== 'boolean') {
    self._payload.instance_errors.push(`.notify: Received status of type ${typeof status}`);
    
    // default to true
    status = true;
  }
  
  self._payload.notification.status = status;
  
  // check type
  if (type) {
    if (typeof type !== 'string') {
      self._payload.instance_errors.push(`.notify: Received type of type ${typeof msg}`);
      type = '';
    }
    
    if (type.length === 0) {
      self._payload.instance_errors.push(`.notify: Received type of length 0`);
      type = '';
    }
    
    if (['error', 'warning', 'info'].indexOf(type) === -1) {
      self._payload.instance_errors.push(`.notify: Unknown error type ${type}`);
      type = '';
    }
    
    // check again after changes
    if (type) {
      self._payload.notification.type = type;
    }
  }
  
  // check msg
  if (msg) {
    if (typeof msg !== 'string') {
      self._payload.instance_errors.push(`.notify: Received msg of type ${typeof msg}`);
      msg = '';
    }
    
    if (msg.length === 0) {
      self._payload.instance_errors.push(`.notify: Received msg of length 0`);
      msg = '';
    }
    
    // check again after changes
    if (msg) {
      self._payload.notification.msg = msg;
      self._applyMessage(msg);
    }
  }
  
  return self;
};

/**
 *
 * @param {string} [message]
 * @returns {Erry}
 */
Erry.prototype.systemError = function (message) {
  var self = this;
  
  // incur system error code
  self._payload.code = 500;
  
  // add fatal flag
  self._payload.fatal = true;
  
  // check message
  if (message) {
    if (typeof message !== 'string') {
      self._payload.instance_errors.push(`.systemError: Received message of type ${typeof message}`);
      message = '';
    }
    
    if (message.length === 0) {
      self._payload.instance_errors.push(`.notify: Received msg of length 0`);
      message = '';
    }
    
    self._applyMessage(message);
  }
  
  if (!self._payload.notification.status) {
    self._payload.notification.status = true;
  }
  
  // override
  self._payload.notification.type = 'error';
  
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
  
  var code_msg = errorCodeMessage(code, self._defaults.message);
  
  // apply message only but don't switch notification.status ->true
  // notification.status is explicitly set by self.notify
  if (code_msg) {
    self._payload.notification.msg = code_msg;
    self._applyMessage(code_msg);
  }
  
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
    name = '';
  }
  
  if (name.length === 0) {
    self._payload.instance_errors.push(`.name: Received name of length 0`);
    name = '';
  }
  
  if (name) {
    self._payload.name = name;
    self.name          = name;
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
    message = '';
  }
  
  if (message.length === 0) {
    self._payload.instance_errors.push(`.message: Received message of length 0`);
    message = '';
  }
  
  if (message) {
    self._applyMessage(message);
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