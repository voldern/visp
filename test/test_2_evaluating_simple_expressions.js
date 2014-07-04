var test = require('tape'),
    evaluate = require('../src/evaluate');

// We will start by implementing evaluation of simple expressions.

test('evaluating boolean', function(t) {
    // Booleans should evaluate to themselves
    t.plan(2);

    t.equal(evaluate(true), true);
    t.equal(evaluate(false), false);
});

test('evaluating integer', function(t) {
    // ...and so should integers.
    t.plan(1);

    t.equal(evaluate(42), 42);
});
