function Environment(initialVars) {
    this.vars = initialVars || {};
}

Environment.prototype.lookup = function(key) {
    return this.vars[key];
};

module.exports = Environment;
