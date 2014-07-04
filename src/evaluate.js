var ast = require('./ast'),
    assert = require('./assert');

var specialForms = {
    quote: function(args) {
        return args[0];
    },
    if: function(args) {
        if (evaluate(args[0]) === true) {
            return evaluate(args[1]);
        } else {
            return evaluate(args[2]);
        }
    }
};

var forms = {
    atom: function(args) {
        return ast.is_atom(args[0]);
    },
    eq: function(args) {
        return args[0] == args[1];
    },
    '+': function(args) {
        assert.assert_valid_math_operation(args, this);

        return args[0] + args[1];
    },
    '-': function(args) {
        assert.assert_valid_math_operation(args, this);

        return args[0] - args[1];
    },
    '/': function(args) {
        assert.assert_valid_math_operation(args, this);

        return parseInt(args[0] / args[1], 10);
    },
    '*': function(args) {
        assert.assert_valid_math_operation(args, this);

        return args[0] * args[1];
    },
    mod: function(args) {
        assert.assert_valid_math_operation(args, this);

        return args[0] % args[1];
    },
    '>': function(args) {
        assert.assert_valid_math_operation(args, this);

        return args[0] > args[1];
    },
    '<': function(args) {
        assert.assert_valid_math_operation(args, this);

        return args[0] < args[1];
    }
};

function evaluate(sexp) {
    if (!ast.is_list(sexp)) {
        return sexp;
    } else if (specialForms.hasOwnProperty(sexp[0])) {
        return specialForms[sexp[0]].call(sexp, sexp.slice(1));
    } else {
        var params = sexp.slice(1).map(function(param) {
            return evaluate(param);
        });

        return forms[sexp[0]].call(sexp, params);
    }
}

module.exports = evaluate;
