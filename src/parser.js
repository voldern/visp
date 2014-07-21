var parse = require('./grammar/parser').parse,
    ast = require('./ast');

exports.parse = function(sexp) {
    var result = parse(sexp);

    if (!ast.isList(result) || result.length === 1) {
        return result[0];
    }

    return result;
};

exports.unparse = function(sexp) {
    // Turns AST back into list program
    if (ast.isBoolean(sexp)) {
        return sexp === true ? '#t' : '#f';
    } else if (ast.isList(sexp)) {
        if (sexp.length > 0 && sexp[0].valueOf() === 'quote') {
            return "'" + exports.unparse(sexp[1]);
        } else {
            return '(' + sexp.map(exports.unparse).join(' ') + ')';
        }
    } else if (typeof sexp === 'undefined') {
        return 'undefined';
    } else {
        return sexp.toString();
    }
};
