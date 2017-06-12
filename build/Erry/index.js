'use strict';var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};var errorCodeMessage = require('./errorCodeMessage').errorCodeMessage;
var _defaults = {
  name: 'ErryError',
  message: 'Failed to complete this action or process.' };


/**
                                                            *
                                                            * @param {Error|Erry} [error]
                                                            * @returns {Erry}
                                                            * @constructor
                                                            */
var Erry = function Erry(error) {
  var self = this;

  self._payload = {
    code: 500,
    name: _defaults.name.slice(),
    messages: [_defaults.message.slice()],
    handled: false,
    logout: false,
    reload: false,
    request: null,
    redirect: {
      status: false, // whether to redirect
      url: '', // url/path
      redirect_back: false // whether the error should indicate that the user should be redirected back to the current route
    },
    error_data: [], // data to include in the error e.g. ajv errors
    instance_errors: [],
    fatal: false,
    print: true,
    notification: {
      status: false,
      type: 'info',
      msg: _defaults.message } };



  // emulate norma error
  self.name = _defaults.name;
  self.message = _defaults.message;
  Error.captureStackTrace ? Error.captureStackTrace(self, Erry) : self.stack = new Error().stack;

  if (error && (typeof error === 'undefined' ? 'undefined' : _typeof(error)) === 'object') {

    if (error instanceof Erry) {
      // inherit
      self._payload = _extends({}, self._payload, error._payload);
    }

    if (error instanceof Error) {

      // also includes instances of Erry

      self.name = error.name;
      self.message = error.message;
      self.stack = error.stack;
    }

    // copy remaining error properties:

    for (var prop in error) {
      if (error.hasOwnProperty(prop) && !self.hasOwnProperty(prop)) {
        self[prop] = error[prop];
      }
    }

  }

  return self;
};

// prototypically inherit from the Error constructor
Erry.prototype = Object.create(Error.prototype);
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
    self._payload.instance_errors.push('._applyMessage: Received message of type ' + (typeof message === 'undefined' ? 'undefined' : _typeof(message)));

    return self;
  }

  if (message.length === 0) {
    self._payload.instance_errors.push('._applyMessage: Received message of length 0');

    return self;
  }

  self.message = message;
  self._payload.messages.push(message);

  return self;
};

/**
    *
    * @param {boolean} status
    * @returns {Erry}
    */
Erry.prototype.print = function (status) {
  var self = this;

  if (typeof status !== 'boolean') {
    self._payload.instance_errors.push('.print: Received status of type ' + (typeof status === 'undefined' ? 'undefined' : _typeof(status)) + ', wanted boolean');

    return self;
  }

  self._payload.print = status;

  return self;

};

/**
    * Copy a given payload into self
    * Useful e.g. in client side when you want to make an error out of a payload
    * @param {object} payload
    * @returns {Erry}
    */
Erry.prototype.copyPayload = function (payload) {
  var self = this;

  if (!payload) {
    return self;
  }

  if ((typeof payload === 'undefined' ? 'undefined' : _typeof(payload)) !== 'object') {
    self._payload.instance_errors.push('._copyPayload: Received payload of type ' + (typeof payload === 'undefined' ? 'undefined' : _typeof(payload)));

    return self;
  }

  for (var prop in payload) {
    if (self._payload.hasOwnProperty(prop) && payload.hasOwnProperty(prop)) {
      self._payload[prop] = payload[prop];
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
  var self = this;

  self._payload.fatal = true;

  return self;
};

/**
    *
    * @returns {Erry}
    */
Erry.prototype.reload = function () {
  var self = this;

  self._payload.reload = true;

  return self;
};

/**
    *
    * @returns {Erry}
    */
Erry.prototype.handled = function () {
  var self = this;

  self._payload.handled = true;

  return self;
};

/**
    *
    * @param {object} opts
    * @returns {Erry}
    */
Erry.prototype.request = function (opts) {
  var self = this;

  if ((typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) !== 'object') {
    self._payload.instance_errors.push('.request: Received opts of type ' + (typeof opts === 'undefined' ? 'undefined' : _typeof(opts)));

    return self;
  }

  self._payload.request = opts;

  return self;
};

/**
    *
    * @param {boolean} [status=true]
    * @param {string} [type] - [info|warning|error|success]
    * @param {string} [msg] - Notification message. This msg is applied to self.message, self._payload.message (If they are not changed)
    * @returns {Erry}
    */
Erry.prototype.notify = function () {var status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'info';var msg = arguments[2];
  var self = this;

  // check status
  if (typeof status !== 'boolean') {
    self._payload.instance_errors.push('.notify: Received status of type ' + (typeof status === 'undefined' ? 'undefined' : _typeof(status)));

    // default to true
    status = true;
  }

  self._payload.notification.status = status;

  // check type
  if (type) {
    if (typeof type !== 'string') {
      self._payload.instance_errors.push('.notify: Received type of type ' + (typeof msg === 'undefined' ? 'undefined' : _typeof(msg)));
      type = '';
    }

    if (type.length === 0) {
      self._payload.instance_errors.push('.notify: Received type of length 0');
      type = '';
    }

    if (['error', 'warning', 'info', 'success'].indexOf(type) === -1) {
      self._payload.instance_errors.push('.notify: Unknown error type ' + type);
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
      self._payload.instance_errors.push('.notify: Received msg of type ' + (typeof msg === 'undefined' ? 'undefined' : _typeof(msg)));
      msg = '';
    }

    if (msg.length === 0) {
      self._payload.instance_errors.push('.notify: Received msg of length 0');
      msg = '';
    }

    // check again after changes
    if (msg) {
      self._payload.notification.msg = msg;
      self._payload.messages.push(msg);
    }
  }

  return self;
};

/**
    *
    * @param {string} [msg] - Notification message. This msg is applied to self.message, self._payload.message (If they are not changed)
    * @returns {Erry}
    */
Erry.prototype.notifyInfo = function (msg) {
  var self = this;

  self.notify(true, 'info', msg);

  return self;
};

/**
    *
    * @param {string} msg - Notification message. This msg is applied to self.message, self._payload.message (If they are not changed)
    * @returns {Erry}
    */
Erry.prototype.notifyWarning = function (msg) {
  var self = this;

  self.notify(true, 'warning', msg);

  return self;
};

/**
    *
    * @param {string} msg - Notification message. This msg is applied to self.message, self._payload.message (If they are not changed)
    * @returns {Erry}
    */
Erry.prototype.notifyError = function (msg) {
  var self = this;

  self.notify(true, 'error', msg);

  return self;
};

/**
    *
    * @param {string} msg - Notification message. This msg is applied to self.message, self._payload.message (If they are not changed)
    * @returns {Erry}
    */
Erry.prototype.notifySuccess = function (msg) {
  var self = this;

  self.notify(true, 'success', msg);

  return self;
};

/**
    * - Does not touch self._payload.notification except it changes it's type to 'error'
    * @param {string} [message]
    * @returns {Erry}
    */
Erry.prototype.systemError = function (message) {
  var self = this;

  self._payload.code = 500;
  self._payload.fatal = true;

  if (message) {
    if (typeof message !== 'string') {
      self._payload.instance_errors.push('.systemError: Received message of type ' + (typeof message === 'undefined' ? 'undefined' : _typeof(message)));
      message = '';
    }

    if (message.length === 0) {
      self._payload.instance_errors.push('.notify: Received msg of length 0');
      message = '';
    }

    if (message) {
      self._applyMessage(message);
    }
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
Erry.prototype.code = function () {var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;
  var self = this;

  if (typeof code !== 'number') {
    self._payload.instance_errors.push('.code: Received code of type ' + (typeof code === 'undefined' ? 'undefined' : _typeof(code)));
    code = 500;
  }

  self._payload.code = code;

  var code_msg = errorCodeMessage(code, _defaults.message);

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
    self._payload.instance_errors.push('.name: Received name of type ' + (typeof name === 'undefined' ? 'undefined' : _typeof(name)));
    name = '';
  }

  if (name.length === 0) {
    self._payload.instance_errors.push('.name: Received name of length 0');
    name = '';
  }

  if (name) {
    self._payload.name = name;
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
    self._payload.instance_errors.push('.message: Received message of type ' + (typeof message === 'undefined' ? 'undefined' : _typeof(message)));
    message = '';
  }

  if (message.length === 0) {
    self._payload.instance_errors.push('.message: Received message of length 0');
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
    self._payload.instance_errors.push('.url: Received url of type ' + (typeof url === 'undefined' ? 'undefined' : _typeof(url)));

    return self;
  }

  if (url.length === 0) {
    self._payload.instance_errors.push('.url: Received url of length 0');

    return self;
  }

  self._payload.redirect = {
    status: true,
    url: url };


  return self;
};

/**
    *
    * @returns {Erry}
    */
Erry.prototype.redirectBack = function () {
  var self = this;

  self._payload.redirect.redirect_back = true;

  return self;
};

/**
    *
    * @returns {Erry}
    */
Erry.prototype.logout = function () {
  var self = this;

  self._payload.logout = true;

  return self;
};

// add logger
require('../logger')(Erry);

module.exports = Erry;