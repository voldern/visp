var test = require('tape'),
    parse = require('../src/parser').parse,
    evaluate = require('../src/evaluate'),
    Environment = require('../src/environment');

// We need some basic functions for working with strings

test('joining strings', function(t) {
    t.plan(8);

    // Join should return a string of all elements in supplied list
    t.equals(evaluate(parse('(join \'("Foo" "Bar"))')), 'FooBar');

    // It should also support a seperator
    t.equals(evaluate(parse('(join "-" \'("Foo" "Bar"))')), 'Foo-Bar');

    // It should convert ints
    t.equals(evaluate(parse('(join "-" \'(1 2 3))')), '1-2-3');

    t.throws(function() {
        evaluate(parse('(join 5)'));
    }, /List required/);

    t.throws(function() {
        evaluate(parse('(join "-" 5)'));
    }, /List required/);

    t.throws(function() {
        evaluate(parse('(join 5 \'(5))'));
    }, /String required/);

    t.throws(function() {
        evaluate(parse('(join)'));
    }, /too few arguments/);

    t.throws(function() {
        evaluate(parse('(join 5 \'(5) \'(6))'));
    }, /too many arguments/);
});

test('substr', function(t) {
    // Use (substr str start [length]) to get a substring of a string
    t.plan(7);

    t.equals(evaluate(parse('(substr "Foo" 0 1)')), 'F');
    t.equals(evaluate(parse('(substr "Foo" 1)')), 'oo');

    t.throws(function() {
        evaluate(parse('(substr 5 0 1)'));
    }, /String required/);

    t.throws(function() {
        evaluate(parse('(substr "Foo" "Bar")'));
    }, /Integer required/);

    t.throws(function() {
        evaluate(parse('(substr "Foo" 5 "Bar")'));
    }, /Integer required/);

    t.throws(function() {
        evaluate(parse('(substr "Foo")'));
    }, /too few arguments/);

    t.throws(function() {
        evaluate(parse('(substr "Foo" 1 2 3)'));
    }, /too many arguments/);
});

test('upper', function(t) {
    // Use (upper str) to uppercase a string
    t.plan(4);

    t.equals(evaluate(parse('(upper "fOo")')), 'FOO');

    t.throws(function() {
        evaluate(parse('(upper)'));
    }, /too few arguments/);

    t.throws(function() {
        evaluate(parse('(upper 1 2)'));
    }, /too many arguments/);

    t.throws(function() {
        evaluate(parse('(upper 1)'));
    }, /String required/);
});

test('lower', function(t) {
    // Use (upper str) to uppercase a string
    t.plan(4);

    t.equals(evaluate(parse('(lower "FoO")')), 'foo');

    t.throws(function() {
        evaluate(parse('(lower)'));
    }, /too few arguments/);

    t.throws(function() {
        evaluate(parse('(lower 1 2)'));
    }, /too many arguments/);

    t.throws(function() {
        evaluate(parse('(lower 1)'));
    }, /String required/);
});
