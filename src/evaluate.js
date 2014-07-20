var ast = require('./ast'),
    assert = require('./assert'),
    error = require('./error'),
    Closure = require('./closure'),
    Environment = require('./environment');

var specialForms = {
    quote: function(args) {
        return args[0];
    },
    if: function(args, env) {
        if (evaluate(args[0], env) === true) {
            return evaluate(args[1], env);
        } else {
            return evaluate(args[2], env);
        }
    },
    define: function(args, env) {
        assert.validDefinition(args);

        var value = evaluate(args[1], env);

        env.set(args[0], value);

        return value;
    },
    lambda: function(args, env) {
        assert.expLength(args, 2);

        return new Closure(args[1], args[0], env);
    }
};

var forms = {
    atom: function(args) {
        return ast.isAtom(args[0]);
    },
    eq: function(args) {
        return args[0] == args[1];
    },
    cons: function(args) {
        return [args[0]].concat(args[1]);
    },
    head: function(args) {
        if (args[0].length === 0) {
            throw new error.LispError('Can not head empty list');
        }

        return args[0].slice(0, 1)[0];
    },
    tail: function(args) {
        return args[0].slice(1);
    },
    empty: function(args) {
        return args[0].length === 0;
    },
    '+': function(args) {
        assert.validMathOperation(args, this);

        return args[0] + args[1];
    },
    '-': function(args) {
        assert.validMathOperation(args, this);

        return args[0] - args[1];
    },
    '/': function(args) {
        assert.validMathOperation(args, this);

        return parseInt(args[0] / args[1], 10);
    },
    '*': function(args) {
        assert.validMathOperation(args, this);

        return args[0] * args[1];
    },
    mod: function(args) {
        assert.validMathOperation(args, this);

        return args[0] % args[1];
    },
    '>': function(args) {
        assert.validMathOperation(args, this);

        return args[0] > args[1];
    },
    '<': function(args) {
        assert.validMathOperation(args, this);

        return args[0] < args[1];
    }
};

function evaluateList(sexp, env) {
    return sexp.map(function(param) {
        return evaluate(param, env);
    });
}

function evaluate(sexp, env) {
    if (typeof env === 'undefined') {
        env = new Environment();
    }

    if (ast.isSymbol(sexp)) {
        return env.lookup(sexp);
    } else if (!ast.isList(sexp)) {
        return sexp;
    } else if (specialForms.hasOwnProperty(sexp[0])) {
        return specialForms[sexp[0]].call(sexp, sexp.slice(1), env);
    } else if (forms.hasOwnProperty(sexp[0])) {
        return forms[sexp[0]].call(sexp, evaluateList(sexp.slice(1), env));
    } else if (ast.isClosure(sexp[0])) {
        return sexp[0].invoke(evaluateList(sexp.slice(1), env), evaluate);
    } else {
        // Does the first element in the list evaluate to a closure?
        var func = evaluate(sexp[0], env);

        if (ast.isClosure(func)) {
            return evaluate([func].concat(sexp.slice(1)), env);
        } else {
            throw new error.LispError(sexp[0] + ' not a function');
        }
    }
}

module.exports = evaluate;
