var test = require('tape'),
    evaluate = require('../src/evaluate'),
    parse = require('../src/parser').parse;

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

test('evaluating quote', function(t) {
    // When a call is done to the `quote` form, the argument should be returned
    // without being evaluated.
    // (quote foo) -> foo
    t.plan(2);

    t.equals(evaluate(['quote', 'foo']), 'foo');
    t.looseEquals(evaluate(['quote', [1, 2, false]]), [1, 2, false]);
});

test('evaluating atom function', function(t) {
    // The `atom` form is used to determine whether an expression is an atom.
    // Atoms are expressions that are not list, i.e. integers, booleans or
    // symbols. Remember that the argument to `atom` must be evaluated before
    // the check is done.
    t.plan(5);

    t.equals(evaluate(['atom', true]), true);
    t.equals(evaluate(['atom', false]), true);
    t.equals(evaluate(['atom', 42]), true);
    t.equals(evaluate(['atom', ['quote', 'foo']]), true);
    t.equals(evaluate(['atom', ['quote', [1, 2]]]), false);
});

test('evaluating eq function', function(t) {
    // The `eq` form is used to check whether two expressions are the same atom.
    t.plan(5);

    t.equals(evaluate(['eq', 1, 1]), true);
    t.equals(evaluate(['eq', 1, 2]), false);

    // From this point, the ASTs might sometimes be too long or cummbersome to
    // write down explicitly, and we'll use `parse` to make them for us.
    // Remember, if you need to have a look at exactly what is passed to
    // `evaluate`, just add a print statement in the test (or in `evaluate`).

    t.equals(evaluate(parse("(eq 'foo 'foo)")), true);
    t.equals(evaluate(parse("(eq 'foo 'bar)")), false);

    // Lists are never equal, because lists are not atoms
    t.equals(evaluate(parse("(eq '(1 2 3) '(1 2 3))")), false);
});
