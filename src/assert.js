var ast = require('./ast'),
    unparse = require('./parser').unparse,
    LispError = require('./error').LispError,
    LispTypeError = require('./error').LispTypeError;

exports.expLength = function(ast, length) {
    if (ast.length > length) {
        throw new LispError('Malformed ' + ast[0] + ', too many arguments: ' + unparse(ast));
    } else if (ast.length < length) {
        throw new LispError('Malformed ' + ast[0] + ', too few arguments: ' + unparse(ast));
    }
};

exports.integer = function(p, exp) {
    var msg;

    if (!ast.is_integer(p)) {
        msg = "Integer required, got '" + unparse(p) + "'. ";

        if (typeof exp !== 'undefined') {
            msg += 'Offending expression: ' + unparse(exp);
        }

        throw new LispTypeError(msg);
    }
};

exports.validMathOperation = function(args, sexp) {
    exports.expLength(args, 2);

    args.forEach(function(arg) {
        exports.integer(arg, sexp);
    });
};
