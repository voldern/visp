var test = require('tape'),
    parse = require('../src/parser').parse,
    evaluate = require('../src/evaluate'),
    Environment = require('../src/environment');

// Before we go on to evaluating programs using variables, we need to implement
// an environment to store them in.

test('simple lookup', function(t) {
    // An environment should store variables and provide lookup.
    t.plan(1);

    var env = new Environment({ var: 42 });

    t.equals(env.lookup('var'), 42);
});

test('lookup on missing raises exception', function(t) {
    /*
     When looking up an undefined symbol, an error should be raised.
     The error message should contain the relevant symbol, and inform that it has
     not been defined.
     */
    t.plan(1);

    t.throws(function() {
        var env = new Environment();
        env.lookup('my-missing-var');
    }, /not set/);
});
