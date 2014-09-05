var parse = require('./grammar/parser').parse,
    assert = require('./assert'),
    ast = require('./ast'),
    evaluate = require('./evaluate'),
    error = require('./error');

var macroTable = {};

function expandQuasiquote(args) {
    if (!ast.isList(args) || !args.length) {
        return [new String('quote'), args];
    }

    if (args[0].toString() === 'unquotesplicing') {
        throw new error.LispError('Can not splice here');
    }

    if (args[0].toString() === 'unquote') {
        assert.expLength(args, 2);

        return args[1];
    }

    if (ast.isList(args[0]) && args[0][0].toString() === 'unquotesplicing') {
        assert.expLength(args[0], 2);

        return [new String('append'), args[0][1],
                expandQuasiquote(args.slice(1))];
    }

    return [new String('cons'), expandQuasiquote(args[0]),
            expandQuasiquote(args.slice(1))];
}

var expandForms = {
    quote: function(sexp) {
        assert.expLength(sexp, 2);

        return sexp;
    },
    if: function(sexp) {
        assert.expLength(sexp, 4);

        return sexp.map(expand);
    },
    lambda: function(sexp) {
        assert.expLength(sexp, 3);

        if (!ast.isList(sexp[1]) && !ast.isSymbol(sexp[1])) {
            throw new error.LispTypeError('Closure argument must be a list or symbol');
        }

        return [new String('lambda'), sexp[1], expand(sexp[2])];
    },
    quasiquote: function(sexp) {
        assert.expLength(sexp, 2);

        return expand(expandQuasiquote(sexp[1]));
    }
};

function expand(sexp, toplevel) {
    if (!ast.isList(sexp) || !sexp.length) {
        return sexp;
    }

    if (expandForms.hasOwnProperty(sexp[0].toString())) {
        return expandForms[sexp[0]](sexp);
    }

    if (['define', 'defmacro'].indexOf(sexp[0].toString()) !== -1) {
        assert.validDefinition(sexp.slice(1));

        if (!ast.isSymbol(sexp[1])) {
            throw new error.LispTypeError('Can only define a symbol');
        }

        var exp = expand(sexp[2]);

        if (sexp[0].toString() === 'defmacro') {
            if (toplevel !== true) {
                throw new error.LispError('defmacro only allowed at top level');
            }

            var proc = evaluate(exp);

            macroTable[sexp[1]] = proc;

            return null;
        }

        return [new String('define'), sexp[1], exp];
    }

    if (ast.isSymbol(sexp[0]) && macroTable.hasOwnProperty(sexp[0])) {
        return expand(macroTable[sexp[0]].invoke(sexp.slice(1), evaluate),
                      toplevel);
    }

    return sexp.map(expand);
}

module.exports = function (sexp) {
    var result = parse(sexp);

    if (!ast.isList(result) || result.length === 1) {
        return expand(result[0], true);
    }

    return expand(result, true);
};
