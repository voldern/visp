var error = require('./error');

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

module.exports = Environment;
