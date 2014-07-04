var test = require('tape'),
    path = require('path'),
    parse = require('../src/parser').parse,
    interpret = require('../src/interpret'),
    Environment = require('../src/environment');

var env = new Environment();

interpret.file(path.join(__dirname, '../stdlib.visp'), env);

test('not', function(t) {
    t.plan(2);

    t.equals(interpret.string('(not #f)', env), '#t');
    t.equals(interpret.string('(not #t)', env), '#f');
});
