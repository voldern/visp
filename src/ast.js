exports.is_boolean = function(x) {
    return typeof x === 'boolean';
};

exports.is_integer = function(x) {
    return typeof x === 'number';
};

exports.is_symbol = function(x) {
    return typeof x === 'string';
};

exports.is_list = function(x) {
    return Array.isArray(x);
};

exports.is_atom = function(x) {
    return exports.is_symbol(x) || exports.is_integer(x) ||
        exports.is_boolean(x);
};
