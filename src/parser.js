var parse = require('./grammar/parser').parse,
    ast = require('./ast');

exports.parse = function(sexp) {
    if (!ast.is_list(sexp) || sexp.length === 1) {
        return parse(sexp)[0];
    }

    return parse(sexp);
};

exports.unparse = function(sexp) {
    // Turns AST back into list program
    if (ast.is_boolean(sexp)) {
        return sexp === true ? '#t' : '#f';
    } else if (ast.is_list(sexp)) {
        if (sexp.length > 0 && sexp[0] === 'quote') {
            return "'" + exports.unparse(sexp[1]);
        } else {
            return '(' + sexp.map(exports.unparse).join(' ') + ')';
        }
    } else {
        return sexp.toString();
    }
};
