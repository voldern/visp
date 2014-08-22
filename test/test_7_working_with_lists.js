var test = require('tape'),
    parse = require('../src/parser').parse,
    evaluate = require('../src/evaluate');

test('creating lists by quoting', function(t) {
    // One way to create lists is by quoting.
    // We have already implemented `quote` so this test should already be
    //passing.
    // The reason we need to use `quote` here is that otherwise the expression
    // would be seen as a call to the first element -- `1` in this case, which
    // obviously isn't even a function.
    t.plan(1);

    t.looseEquals(evaluate(parse("'(1 2 3 #t)")), parse('(1 2 3 #t)'));
});

test('creating list with cons', function(t) {
    // The `cons` functions prepends an element to the front of a list.
    t.plan(1);

    t.looseEquals(evaluate(parse("(cons 0 '(1 2 3))")), parse('(0 1 2 3)'));
});

test('creating longer lists with only cons', function(t) {
    // `cons` needs to evaluate it's arguments.
    // Like all the other special forms and functions in our language, `cons` is
    // call-by-value. This means that the arguments must be evaluated before we
    // create the list with their values.
    t.plan(1);

    t.looseEquals(evaluate(parse("(cons 3 (cons (- 4 2) (cons 1 '())))")),
                 parse('(3 2 1)'));
});

test('getting first element from list', function(t) {
    // `head` extracts the first element of a list.
    t.plan(1);

    t.looseEquals(evaluate(parse("(head '(1 2 3 4 5))")), 1);
});

test('getting first element from empty list', function(t) {
    // If the list is empty there is no first element, and `head should raise
    // an error.
    t.plan(1);

    t.throws(function() {
        evaluate(parse('(head (quote ()))'));
    }, /Can not head empty list/);
});

test('getting tail of list', function(t) {
    // `tail` returns the tail of the list.
    // The tail is the list retained after removing the first element.
    t.plan(1);

    t.looseEquals(evaluate(parse("(tail '(1 2 3))")), [2, 3]);
});

test('checking whether list is empty', function(t) {
    // The `empty` form checks whether or not a list is empty.
    t.plan(4);

    t.equals(evaluate(parse("(empty '(1 2 3))")), false);
    t.equals(evaluate(parse("(empty '(1))")), false);

    t.equals(evaluate(parse("(empty '())")), true);
    t.equals(evaluate(parse("(empty (tail '(1)))")), true);
});

test('creating list using list', function(t) {
    // The `list` form returns a list with its arguments
    t.plan(2);

    t.looseEquals(evaluate(parse('(list #t)')), [true]);
    t.looseEquals(evaluate(parse("(list #t 1 '(1 2))")), [true, 1, [1, 2]]);
});

test('appending one list to another', function(t) {
    // The `append` form appends the content of one list to the other
    t.plan(5);

    t.looseEquals(evaluate(parse("(append '(1 2) '(3 4))")), [1, 2, 3, 4]);

    t.throws(function() {
        evaluate(parse("(append '(1))"));
    }, /too few arguments/);

    t.throws(function() {
        evaluate(parse("(append '(1) '(2) '(3))"));
    }, /too many arguments/);

    t.throws(function() {
        evaluate(parse("(append 1 '(2))"));
    }, /List required/);

    t.throws(function() {
        evaluate(parse("(append '(1) 2)"));
    }, /List required/);
});
