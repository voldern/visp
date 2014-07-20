var Closure = require('./closure');

exports.isBoolean = function(x) {
    return typeof x === 'boolean';
};

exports.isInteger = function(x) {
    return typeof x === 'number';
};

exports.isSymbol = function(x) {
    return typeof x === 'string';
};

exports.isClosure = function(x) {
    return (typeof x === 'object' && x instanceof Closure);
};

exports.isList = function(x) {
    return Array.isArray(x);
};

exports.isAtom = function(x) {
    return exports.isSymbol(x) || exports.isInteger(x) ||
        exports.isBoolean(x) || exports.isClosure(x);
};
