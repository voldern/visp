var test = require('tape'),
    parse = require('../src/parser').parse,
    evaluate = require('../src/evaluate'),
    Environment = require('../src/environment'),
    Closure = require('../src/closure');

// This part is all about defining and using functions.
// We'll start by implementing the `lambda` form which is used to create
// function closures.

test('lambda evaluates to lambda', function(t) {
    // The lambda form should evaluate to a Closure
    t.plan(1);

    var ast = ['lambda', [], 42];

    t.ok(evaluate(ast) instanceof Closure);
});

test('lambda closure keeps defining env', function(t) {
    // The closure should keep a copy of the environment where it was defined.
    // Once we start calling functions later, we'll need access to the
    // environment from when the function was created in order to resolve all
    // free variables.
    t.plan(1);

    var env = new Environment({ foo: 1, bar: 2 });
    var ast = ['lambda', [], 42];

    t.equals(evaluate(ast, env).env, env);
});

test('lambda closure holds function', function(t) {
    // The closure contains the parameter list and function body too.
    t.plan(2);

    var closure = evaluate(parse('(lambda (x y) (+ x y))'));

    t.looseEquals(closure.params, ['x', 'y']);
    t.looseEquals(closure.body, ['+', 'x', 'y']);
});

test('lambda arguments are list', function(t) {
    // The parameters of a `lambda` should be a list.
    t.plan(2);

    var closure = evaluate(parse('(lambda (x y) (+ x y))'));

    t.ok(Array.isArray(closure.params));

    t.throws(function() {
        evaluate(parse('(lambda not-a-list (body of fn))'));
    }, /Closure argument must be a list/);
});

test('lambda number of arguments', function(t) {
    // The `lambda` form should expect exactly two arguments.
    t.plan(1);

    t.throws(function() {
        evaluate(parse('(lambda (foo) (bar) (baz))'));
    }, /Malformed foo, too many arguments/);
});

test('defining lambda with error in body', function(t) {
    // The function body should not be evaluated when the lambda is defined.
    // The call to `lambda` should return a function closure holding, among
    // other things the function body. The body should not be evaluated before
    // the function is called.
    t.plan(1);

    var ast = parse('(lambda (x y) (function body ((that would never) work)))');

    t.ok(evaluate(ast) instanceof Closure);
});
