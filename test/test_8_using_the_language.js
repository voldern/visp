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

test('sum', function(t) {
    t.plan(3);

    t.equals(interpret.string("(sum '(1 1 1 1 1))", env), '5');
    t.equals(interpret.string("(sum '(1 2 3 4))", env), '10');
    t.equals(interpret.string("(sum '())", env), '0');
});

test('length', function(t) {
    t.plan(3);

    t.equals(interpret.string("(length '(1 1 1 1 1))", env), '5');
    t.equals(interpret.string("(length '(#t '(1 1 3) 'foo-bar))", env), '3');
    t.equals(interpret.string("(length '())", env), '0');
});

test('filter', function(t) {
    t.plan(1);

    interpret.string("(define even\n\
                        (lambda (x)\n\
                          (eq (mod x 2) 0)))", env);

    t.equals(interpret.string("(filter even '(1 2 3 4 5 6))", env), '(2 4 6)');
});

test('map', function(t) {
    t.plan(1);

    interpret.string("(define inc\n\
                        (lambda (x) (+ 1 x)))", env);

    t.equals(interpret.string("(map inc '(1 2 3))", env), '(2 3 4)');
});

test('reverse', function(t) {
    t.plan(2),

    t.equals(interpret.string("(reverse '(1 2 3 4))", env), '(4 3 2 1)');
    t.equals(interpret.string("(reverse '())", env), '()');
});

test('range', function(t) {
    t.plan(3);

    t.equals(interpret.string('(range 1 5)', env), '(1 2 3 4 5)');
    t.equals(interpret.string('(range 1 1)', env), '(1)');
    t.equals(interpret.string('(range 2 1)', env), '()');
});

test('sort', function(t) {
    t.plan(2);

    t.equals(interpret.string("(sort '(6 3 7 2 4 1 5))", env),
             "(1 2 3 4 5 6 7)");

    t.equals(interpret.string("(sort '())", env), '()');
});

test('capitalize', function(t) {
    t.plan(2);

    t.equals(interpret.string('(capitalize "foO")', env), 'FoO');
    t.equals(interpret.string('(capitalize "Foo")', env), 'Foo');
});
