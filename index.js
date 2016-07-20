function Erry() {
  var self                    = this;
  self._default_error_message = 'Something went wrong while performing that request';
  
  self._fatal        = false;
  self._notification = {
    status: false,
    type  : 'info',
    msg   : self._default_error_message
  };
  self._code         = 500;
  self._name         = 'Error';
  self._message      = self._default_error_message;
  self._handled      = false;
  self._logout       = false;
  self._request      = null;
  self._redirect     = {
    status: false, // whether to redirect
    url   : ''     // url/path
  };
  
  // errors when the error object is not instantiated correctly
  self._instance_errors = [];
  
  return self;
}

// prototypically inherit from the Error constructor
Erry.prototype             = Object.create(Error.prototype);
Erry.prototype.constructor = Erry;

/**
 *
 * @returns {Erry}
 */
Erry.prototype.fatal = function () {
  var self    = this;
  self._fatal = true;
  return self;
};

/**
 *
 * @returns {Erry}
 */
Erry.prototype.handled = function () {
  var self      = this;
  self._handled = true;
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
    self._instance_errors.push(`.request: Received url of type ${typeof url}`);
    return self;
  }
  
  if (url.length === 0) {
    self._instance_errors.push(`.request: Received url of length 0`);
    return self;
  }
  
  self._request = url;
  
  return self;
};

/**
 *
 * @param {string} type - [info|warning|error]
 * @param {string} msg
 * @returns {Erry}
 */
Erry.prototype.notify = function (type = 'info', msg = 'Something went wrong while performing that request') {
  var self = this;
  
  self._notification.status = true;
  
  // check type
  if (typeof type !== 'string') {
    self._instance_errors.push(`.notify: Received type of type ${typeof msg}`);
    type = 'info';
  }
  
  if (type.length === 0) {
    self._instance_errors.push(`.notify: Received type of length 0`);
    type = 'info';
  }
  
  if (['error', 'warning', 'info'].indexOf(type) === -1) {
    self._instance_errors.push(`.notify: Unknown error type ${type}`);
    type = 'info';
  }
  
  self._notification.type = type;
  
  // check msg
  if (typeof msg !== 'string') {
    self._instance_errors.push(`.notify: Received msg of type ${typeof msg}`);
    msg = self._default_error_message;
  }
  
  if (msg.length === 0) {
    self._instance_errors.push(`.notify: Received msg of length 0`);
    msg = self._default_error_message;
  }
  
  self._notification.msg = msg;
  
  if (self._message === self._default_error_message) {
    self._message = msg;
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
    self._instance_errors.push(`.code: Received code of type ${typeof code}`);
    code = 500;
  }
  
  self._code = code;
  
  return self;
};

/**
 *
 * @param {string} name
 * @returns {Erry}
 */
Erry.prototype.name = function (name = 'Error') {
  var self = this;
  if (typeof name !== 'string') {
    self._instance_errors.push(`.name: Received name of type ${typeof name}`);
    name = 'Error';
  }
  
  if (name.length === 0) {
    self._instance_errors.push(`.name: Received name of length 0`);
    name = 'Error';
  }
  
  self._name = name;
  
  return self;
};

/**
 *
 * @param {string} message
 * @returns {Erry}
 */
Erry.prototype.message = function (message = 'Something went wrong while performing that request') {
  var self = this;
  
  if (typeof message !== 'string') {
    self._instance_errors.push(`.message: Received message of type ${typeof message}`);
    message = 'Something went wrong while performing that request';
  }
  
  if (message.length === 0) {
    self._instance_errors.push(`.message: Received message of length 0`);
    message = 'Something went wrong while performing that request';
  }
  
  self._message = message;
  
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
    self._instance_errors.push(`.url: Received url of type ${typeof url}`);
    return self;
  }
  
  if (url.length === 0) {
    self._instance_errors.push(`.url: Received url of length 0`);
    return self;
  }
  
  self._redirect = {
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
  var self     = this;
  self._logout = true;
  return self;
};

exports.err = Erry;