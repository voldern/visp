/*jshint multistr: true*/
var test = require('tape'),
    parse = require('../src/parse'),
    evaluate = require('../src/evaluate');

test('calling global javascript function', function(t) {
    t.plan(1);

    t.equals(evaluate(parse('(js/parseInt "f" 16)')), 15);
});

test('calling properties on objects', function(t) {
    t.plan(1);

    t.equals(evaluate(parse('(js/.length "foo")')), 3);
});

test('calling methods on objects', function(t) {
    t.plan(1);

    t.equals(evaluate(parse('(js/.substr "foo" 0 1)')), 'f');
});
