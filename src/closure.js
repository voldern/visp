var arrToObj = require('array-to-object'),
    ast = require('./ast');

function Closure(body, params, env) {
    if (!ast.isList(params) && !ast.isSymbol(params)) {
        throw new Error('Closure argument must be a list or symbol');
    }

    this.body = body;
    this.params = params;
    this.env = env;
}

Closure.prototype.invoke = function(args, evaluateFunc) {
    if (ast.isList(this.params) && args.length !== this.params.length) {
        throw new Error('Wrong number of arguments, expected ' +
                        this.params.length + ' got ' + args.length);
    } else if (ast.isSymbol(this.params)) {
        this.params = [this.params];
        args = [args];
    }

    return evaluateFunc(this.body, this.env.extend(arrToObj(this.params, args)));
};

module.exports = Closure;
