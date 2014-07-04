var extend = require('node.extend'),
    error = require('./error');


function Environment(initialVars) {
    this.vars = initialVars || {};
}

Environment.prototype.lookup = function(key) {
    if (this.vars.hasOwnProperty(key)) {
        return this.vars[key];
    } else {
        throw new error.LispError(key + ' not set');
    }
};

Environment.prototype.set = function(key, value) {
    if (this.vars.hasOwnProperty(key)) {
        throw new error.LispError(key + ' already defined');
    }

    this.vars[key] = value;

    return this;
};

Environment.prototype.extend = function(object) {
    if (typeof object !== 'object') {
        throw new error.LispTypeError('Can only extend with objects');
    }

    return new Environment(extend({}, this.vars, object));
};

module.exports = Environment;
