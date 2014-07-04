var ast = require('./ast');

var specialForms = {
    quote: function(args) {
        return args[0];
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
        return args[0] + args[1];
    },
    '-': function(args) {
        return args[0] - args[1];
    },
    '/': function(args) {
        return parseInt(args[0] / args[1], 10);
    },
    '*': function(args) {
        return args[0] * args[1];
    },
    mod: function(args) {
        return args[0] % args[1];
    },
    '>': function(args) {
        return args[0] > args[1];
    },
    '<': function(args) {
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
