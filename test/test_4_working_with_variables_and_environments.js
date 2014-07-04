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
    // When looking up an undefined symbol, an error should be raised.
    // The error message should contain the relevant symbol, and inform that it
    // has not been defined.
    t.plan(1);

    t.throws(function() {
        var env = new Environment();
        env.lookup('my-missing-var');
    }, /not set/);
});

test('lookup from inner env', function(t) {
    // The `extend` function returns a new environment extended with more
    // bindings.
    t.plan(3);

    var env = new Environment({ foo: 42 });
    env = env.extend({ bar: true });

    t.equals(env.lookup('foo'), 42);
    t.equals(env.lookup('bar'), true);

    t.throws(function(t) {
        env.extend(42);
    }, /Can only extend with objects/);
});

test('lookup deeply nested var', function(t) {
    // Extending overwrites old bindings to the same variable name.
    t.plan(1);

    var env = new Environment({ a: 1 }).extend({ b: 2 }).extend({ c: 3 })
            .extend({ foo: 100 });

    t.equals(env.lookup('foo'), 100);
});

test('extend returns new environment', function(t) {
    // The extend method should create a new environment, leaving the old one
    // unchanged.
    t.plan(2);

    var env = new Environment({ foo: 1 });
    var extended = new Environment({ foo: 2 });

    t.equals(env.lookup('foo'), 1);
    t.equals(extended.lookup('foo'), 2);
});


test('set changes environment in place', function(t) {
    // The extend method should create a new environment, leaving the old one
    // unchanged.
    t.plan(1);

    var env = new Environment();
    env.set('foo', 2);

    t.equals(env.lookup('foo'), 2);
});

test('redefined variables illegal', function(t) {
    // Variables can only be defined once.
    // Setting a variable in an environment where it is already defined should
    // result in an appropriate error.
    t.plan(1);

    var env = new Environment({ foo: 1 });

    t.throws(function() {
        env.set('foo', 2);
    }, /already defined/);
});

// With the `Environment` working, it's time to implement evaluation of
// expressions with variables.

test('evaluating symbol', function(t) {
    // Symbols (other than #t and #f) are treated as variable references.
    // When evaluating a symbol, the corresponding value should be looked up in
    // the environment.
    t.plan(1);

    var env = new Environment({ foo: 42 });

    t.equals(evaluate('foo', env), 42);
});

test('lookup missing variable', function(t) {
    // Referencing undefined variables should raise an appropriate exception.
    // This test should already be working if you implemented the environment
    // correctly.
    t.plan(1);

    t.throws(function() {
        evaluate('my-var', new Environment());
    }, /my-var not set/);
});
