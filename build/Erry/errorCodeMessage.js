'use strict'; /**
               *
               * @param {number} code
               * @param {string} default_error_message
               * @returns {*}
               */
var errorCodeMessage = function errorCodeMessage(code, default_error_message) {
  switch (code) {
    case 301:
      return 'You are being redirected..';
    case 302:
      return 'You are being redirected..';
    case 400:
      return 'There was a problem with your request. Please check and try again';
    case 401:
      return 'We were unable to authenticate your request. Please make sure you are signed in.';
    case 403:
      return "You don't have the permissions to access this page or feature.";
    case 404:
      return 'The page or resource you requested cannot be displayed right now. It may be temporarily unavailable, broken or expired.';
    case 500:
      return default_error_message;
    default:
      return default_error_message;}

};

exports.errorCodeMessage = errorCodeMessage;