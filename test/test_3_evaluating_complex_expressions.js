var test = require('tape'),
    parse = require('../src/parse'),
    evaluate = require('../src/evaluate');

test('nested expressions', function(t) {
    // Remember, functions should evaluate their arguments.
    // (Except `quote` and `if`, that is, which aren't really functions...) Thus,
    // nested expressions should work just fine without any further work at this
    // point.
    //
    // If this test is failing, make sure that `+`, `>` and so on is evaluating
    // their arguments before operating on them.
    t.plan(2);

    t.equals(evaluate(parse("(- 3 (+ 1 1))")), 1);

    t.equals(evaluate(parse("(eq #f (> (- (+ 1 3) (* 2 (mod 7 4))) 4))")),
             true);
});

test('basic if statement', function(t) {
    // If statements are the basic control structures.
    // The `if` should first evaluate its first argument. If this evaluates to
    // true, then the second argument is evaluated and returned.
    // Otherwise the third and last argument is evaluated and returned instead.
    t.plan(3);

    t.equals(evaluate(parse("(if #t 42 1000)")), 42);
    t.equals(evaluate(parse("(if #f 42 1000)")), 1000);
    t.equals(evaluate(parse("(if #t #t #f)")), true);
});

test('that only correct branch is evaluated', function(t) {
    // The branch of the if statement that is discarded should never
    // be evaluated.
    t.plan(1);

    t.equals(evaluate(parse("(if #f (this should not be evaluated) 42)")), 42);
});

test('if with sub expressions', function(t) {
    // A final test with a more complex if expression.
    // This test should already be passing if the above ones are.
    t.plan(1);

    var expression = parse("\n\
                           (if (> 2 1)\
                           (+ 40 (- 3 1))\
                           (- 1000 1))\
                           ");

    t.equals(evaluate(expression), 42);
});
