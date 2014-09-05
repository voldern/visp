var ast = require('./ast'),
    unparse = require('./unparse'),
    LispError = require('./error').LispError,
    LispTypeError = require('./error').LispTypeError;

exports.minExpLength = function(ast, length) {
    if (ast.length < length) {
        throw new LispError('Malformed ' + ast[0] + ', too few arguments: ' + unparse(ast));
    }
};

exports.maxExpLength = function(ast, length) {
    if (ast.length > length) {
        throw new LispError('Malformed ' + ast[0] + ', too many arguments: ' + unparse(ast));
    }
};

exports.expLength = function(ast, length) {
    exports.minExpLength(ast, length);
    exports.maxExpLength(ast, length);
};

exports.expLengthBetween = function(ast, min, max) {
    exports.minExpLength(ast, min);
    exports.maxExpLength(ast, max);
};

exports.integer = function(p, exp) {
    var msg;

    if (!ast.isInteger(p)) {
        msg = "Integer required, got '" + unparse(p) + "'. ";

        if (typeof exp !== 'undefined') {
            msg += 'Offending expression: ' + unparse(exp);
        }

        throw new LispTypeError(msg);
    }
};

exports.string = function(p, exp) {
    var msg;

    if (!ast.isString(p)) {
        msg = "String required, got '" + unparse(p) + "'. ";

        if (typeof exp !== 'undefined') {
            msg += 'Offending expression: ' + unparse(exp);
        }

        throw new LispTypeError(msg);
    }
};

exports.list = function(p, exp) {
    var msg;

    if (!ast.isList(p)) {
        msg = "List required, got '" + unparse(p) + "'. ";

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

exports.validDefinition = function(d) {
    if (d.length !== 2) {
        throw new LispError('Wrong number of arguments for variable definition: ' + unparse(d));
    } else if (!ast.isSymbol(d[0])) {
        throw new LispError('Attempted to define non-symbol as variable ' + unparse(d));
    }
};
