exports.is_boolean = function(x) {
    return typeof x === 'boolean';
};

exports.is_list = function(x) {
    return Array.isArray(x);
};
