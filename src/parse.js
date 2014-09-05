var parse = require('./grammar/parser').parse,
    ast = require('./ast');

module.exports = function (sexp) {
    var result = parse(sexp);

    if (!ast.isList(result) || result.length === 1) {
        return result[0];
    }

    return result;
};
