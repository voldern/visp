var test = require('tape'),
    parse = require('../src/parser').parse,
    evaluate = require('../src/evaluate'),
    Environment = require('../src/environment');

// We need some basic functions for working with strings

test('joining strings', function(t) {
    // Join should return a string of all elements in supplied list
    t.plan(5);

    t.equals(evaluate(parse('(join \'("Foo" "Bar"))')), 'FooBar');

    // It should also support a seperator
    t.equals(evaluate(parse('(join "-" \'("Foo" "Bar"))')), 'Foo-Bar');

    t.throws(function() {
        evaluate(parse('(join 5)'));
    }, /List required/);

    t.throws(function() {
        evaluate(parse('(join "-" 5)'));
    }, /List required/);

    t.throws(function() {
        evaluate(parse('(join 5 \'(5))'));
    }, /String required/);
});
