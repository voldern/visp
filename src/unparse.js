var ast = require('./ast');

module.exports = function unparse(sexp) {
    // Turns AST back into list program
    if (ast.isBoolean(sexp)) {
        return sexp === true ? '#t' : '#f';
    } else if (ast.isList(sexp)) {
        if (sexp.length > 0 && sexp[0].valueOf() === 'quote') {
            return "'" + unparse(sexp[1]);
        } else {
            return '(' + sexp.map(unparse).join(' ') + ')';
        }
    } else if (typeof sexp === 'undefined') {
        return 'undefined';
    } else {
        return sexp.toString();
    }
};
