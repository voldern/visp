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

test('or', function(t) {
    t.plan(4);

    t.equals(interpret.string('(or #f #f)', env), '#f');
    t.equals(interpret.string('(or #t #f)', env), '#t');
    t.equals(interpret.string('(or #f #t)', env), '#t');
    t.equals(interpret.string('(or #t #t)', env), '#t');
});
