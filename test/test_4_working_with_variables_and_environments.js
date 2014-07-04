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
