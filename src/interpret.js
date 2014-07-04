var fs = require('fs'),
    parser = require('./parser'),
    evaluate = require('./evaluate'),
    Environment = require('./environment');

exports.string = function(source, env) {
    if (typeof env === 'undefined') {
        env = (new Environment()).initializeGlobals();
    }

    var sexps = parser.parse(source);
    var result;

    if (Array.isArray(sexps[0])) {
        result = sexps.map(function(sexp) {
            return evaluate(sexp, env);
        }).pop();
    } else {
        result = evaluate(sexps, env);
    }

    return parser.unparse(result);
};

exports.file = function(file, env) {
    return exports.string(fs.readFileSync(file, 'UTF-8'), env);
};
