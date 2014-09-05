var test = require('tape'),
    evaluate = require('../src/evaluate'),
    parse = require('../src/parse');

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

test('evaluating string', function(t) {
    // Strings should evaluate to native strings.
    t.plan(2);

    t.ok(typeof evaluate('Foo') === 'string');
    t.equal(evaluate('Foo'), 'Foo');
});

test('evaluating quote', function(t) {
    // When a call is done to the `quote` form, the argument should be returned
    // without being evaluated.
    // (quote foo) -> foo
    t.plan(3);

    t.equals(evaluate(['quote', 'foo']), 'foo');
    t.looseEquals(evaluate(['quote', new String('Foo')]), new String('Foo'));
    t.looseEquals(evaluate(['quote', [1, 2, false]]), [1, 2, false]);
});

test('evaluating quasiquote', function(t) {
    // When a call is done to the `quasiquote` form without any unquote
    // forms it should behave like quote
    t.plan(2);

    t.equals(evaluate(parse('(quasiquote "foo")')), 'foo');
    t.looseEquals(evaluate(parse('(quasiquote foo)')), new String('foo'));
});

test('evaluating quasiquote with unquote', function(t) {
    // Unquote forms inside quasiquote forms should evaluate the unquote forms
    t.plan(2);

    t.looseEquals(evaluate(parse('`(1 ,(+ 1 1))')), [1, 2]);
    t.looseEquals(evaluate(parse('`(1 ,(+ 1 `,(+ 1 1)))')), [1, 3]);
});

test('evaluating quasiquote with unquotesplicing', function(t) {
    // Unquote-splice forms inside quasiquote forms should splice the
    // list evaluated into the quasiquote
    t.plan(1);

    t.looseEquals(evaluate(parse('`(1 ,(head \'(1 2)) ,@(tail \'(2 3 4)) ,(+ 1 1))')), [1, 1, 3, 4, 2]);
});

test('evaluating atom function', function(t) {
    // The `atom` form is used to determine whether an expression is an atom.
    // Atoms are expressions that are not list, i.e. integers, booleans or
    // symbols. Remember that the argument to `atom` must be evaluated before
    // the check is done.
    t.plan(6);

    t.equals(evaluate(['atom', true]), true);
    t.equals(evaluate(['atom', false]), true);
    t.equals(evaluate(['atom', 42]), true);
    t.equals(evaluate(['atom', 'Foo']), true);
    t.equals(evaluate(['atom', ['quote', 'foo']]), true);
    t.equals(evaluate(['atom', ['quote', [1, 2]]]), false);
});

test('evaluating eq function', function(t) {
    // The `eq` form is used to check whether two expressions are the same atom.
    t.plan(7);

    t.equals(evaluate(['eq', 1, 1]), true);
    t.equals(evaluate(['eq', 1, 2]), false);

    // From this point, the ASTs might sometimes be too long or cummbersome to
    // write down explicitly, and we'll use `parse` to make them for us.
    // Remember, if you need to have a look at exactly what is passed to
    // `evaluate`, just add a print statement in the test (or in `evaluate`).

    t.equals(evaluate(parse("(eq 'foo 'foo)")), true);
    t.equals(evaluate(parse("(eq 'foo 'bar)")), false);

    t.equals(evaluate(parse('(eq "Foo" "Foo")')), true);
    t.equals(evaluate(parse('(eq "Foo" "Bar")')), false);

    // Lists are never equal, because lists are not atoms
    t.equals(evaluate(parse("(eq '(1 2 3) '(1 2 3))")), false);
});

test('basic math operators', function(t) {
    // To be able to do anything useful, we need some basic math operators.
    // Since we only operate with integers, `/` must represent integer division.
    // `mod` is the modulo operator.
    t.plan(10);

    t.equals(evaluate(['+', 2, 2]), 4);
    t.equals(evaluate(['-', 2, 1]), 1);
    t.equals(evaluate(['/', 6, 2]), 3);
    t.equals(evaluate(['/', 7, 2]), 3);
    t.equals(evaluate(['*', 2, 3]), 6);
    t.equals(evaluate(['mod', 7, 2]), 1);
    t.equals(evaluate(['>', 7, 2]), true);
    t.equals(evaluate(['>', 2, 7]), false);
    t.equals(evaluate(['>', 7, 7]), false);
    t.equals(evaluate(['<', 5, 7]), true);
});

test('math operators only work on numbers', function(t) {
    // The math functions should only allow numbers as arguments.
    t.plan(4);

    var error = /Integer required/;

    t.throws(function() {
        evaluate(parse("(+ 1 'foo)"));
    }, error);

    t.throws(function() {
        evaluate(parse("(- 1 'foo)"));
    }, error);

    t.throws(function() {
        evaluate(parse("(/ 1 'foo)"));
    }, error);

    t.throws(function() {
        evaluate(parse("(mod 1 'foo)"));
    }, error);
});
