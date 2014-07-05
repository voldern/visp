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

test('and', function(t) {
    t.plan(4);

    t.equals(interpret.string('(and #f #f)', env), '#f');
    t.equals(interpret.string('(and #t #f)', env), '#f');
    t.equals(interpret.string('(and #f #t)', env), '#f');
    t.equals(interpret.string('(and #t #t)', env), '#t');
});

test('xor', function(t) {
    t.plan(4);

    t.equals(interpret.string('(xor #f #f)', env), '#f');
    t.equals(interpret.string('(xor #t #f)', env), '#t');
    t.equals(interpret.string('(xor #f #t)', env), '#t');
    t.equals(interpret.string('(xor #t #t)', env), '#f');
});

test('greater or equal', function(t) {
    t.plan(3);

    t.equals(interpret.string('(>= 1 2)', env), '#f');
    t.equals(interpret.string('(>= 2 2)', env), '#t');
    t.equals(interpret.string('(>= 3 2)', env), '#t');
});

test('less or equal', function(t) {
    t.plan(3);

    t.equals(interpret.string('(<= 1 2)', env), '#t');
    t.equals(interpret.string('(<= 2 2)', env), '#t');
    t.equals(interpret.string('(<= 2 1)', env), '#f');
});
