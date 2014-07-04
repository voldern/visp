var ast = require('./ast');

var specialForms = {
    quote: function(args) {
        return args[0];
    }
};

function evaluate(sexp) {
    if (!ast.is_list(sexp)) {
        return sexp;
    } else {
        return specialForms[sexp[0]].call(sexp, sexp.slice(1));
    }
}

module.exports = evaluate;
