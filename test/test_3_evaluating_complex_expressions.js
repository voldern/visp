var test = require('tape'),
    parse = require('../src/parser').parse,
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
