var inherits = require('util').inherits;

exports.LispError = function(message) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);

    this.name = 'LispError';
    this.message = message;
};

inherits(exports.LispError, Error);

exports.LispTypeError = function(message) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);

    this.name = 'LispTypeError';
    this.message = message;
};

inherits(exports.LispTypeError, Error);
