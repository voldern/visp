var arrToObj = require('array-to-object');

function Closure(body, params, env) {
    if (!Array.isArray(params)) {
        throw new Error('Closure argument must be a list');
    }

    this.body = body;
    this.params = params;
    this.env = env;
}

Closure.prototype.invoke = function(args, evaluateFunc) {
    return evaluateFunc(this.body, this.env.extend(arrToObj(this.params, args)));
};

module.exports = Closure;
