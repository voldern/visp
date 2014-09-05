var test = require('tape'),
    parse = require('../src/parse'),
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

    t.looseEquals(closure.params, [new String('x'), new String('y')]);
    t.looseEquals(closure.body, [new String('+'), new String('x'),
                                 new String('y')]);
});

test('lambda arguments are list', function(t) {
    // The parameters of a `lambda` should be a list.
    t.plan(1);

    var closure = evaluate(parse('(lambda (x y) (+ x y))'));

    t.ok(Array.isArray(closure.params));
});

test('lambda number of arguments', function(t) {
    // The `lambda` form should expect exactly two arguments.
    t.plan(1);

    t.throws(function() {
        evaluate(parse('(lambda (foo) (bar) (baz))'));
    }, /Malformed foo, too many arguments/);
});

test('lambda variable nubmber of arguments', function(t) {
    t.plan(1);

    var closure = evaluate(parse('(lambda args (length args))'));

    t.ok(closure.params instanceof String);
});

test('lambda fails on invalid argument definition', function(t) {
    t.plan(1);

    t.throws(function() {
        evaluate(parse('(lambda 55 (body of fn))'));
    }, /Closure argument must be a list or symbol/);
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

// Now that we have the `lambda` form implemented, let's see if we can call
// some functions.
// When evaluating ASTs which are lists, if the first element isn't one of the
// special forms we have been working with so far, it is a function call.
// The first element of the list is the function, and the rest of the elements
// are arguments.

test('evaluating call to closure', function(t) {
    // The first case we'll handle is when the AST is a list with an actual
    // closure as the first element.
    // In this first test, we'll start with a closure with no arguments and no
    // free variables. All we need to do is to evaluate and return the function
    // body.
    t.plan(1);

    var closure = evaluate(parse('(lambda () (+ 1 2))'));

    t.equals(evaluate([closure]), 3);
});

test('evaluating call to closure with arguments', function(t) {
    // The function body must be evaluated in an environment where the
    // parameters are bound.
    // Create an environment where the function parameters (which are stored
    // in the closure) are bound to the actual argument values in the function
    // call. Use this environment when evaluating the function body.
    t.plan(1);

    var env = new Environment({});
    var closure = evaluate(parse('(lambda (a b) (+ a b))'), env);

    t.equals(evaluate([closure, 4, 5], env), 9);
});

test('evaluating call to closure with variable list of arguments', function(t) {
    t.plan(1);

    var env = new Environment();
    var closure = evaluate(parse('(lambda args (+ (head args) (head (tail args))))'), env);

    t.equals(evaluate([closure, 4, 5], env), 9);
});

test('call to function should evaluate arguments', function(t) {
    // Call to function should evaluate all arguments.
    // When a function is applied, the arguments should be evaluated before
    // being bound to the parameter names.
    t.plan(1);

    var env = new Environment();
    var closure = evaluate(parse('(lambda (a) (+ a 5))'), env);
    var ast = [closure, parse('(if #f 0 (+ 10 10))')];

    t.equals(evaluate(ast, env), 25);
});

test('evaluating call to closure with free variables', function(t) {
    // The body should be evaluated in the environment from the closure.
    // The function's free variables, i.e. those not specified as part of the
    // parameter list, should be looked up in the environment from where the
    // function was defined. This is the environment included in the closure.
    // Make sure this environment is used when evaluating the body.
    t.plan(1);

    var closure = evaluate(parse('(lambda (x) (+ x y))'),
                           new Environment({ y: 1 }));

    var ast = [closure, 0];

    t.equals(evaluate(ast, new Environment({ y: 2 })), 1);
});

// Okay, now we're able to evaluate ASTs with closures as the first element.
// But normally the closures don't just happen to be there all by themselves.
// Generally we'll find some expression, evaluate it to a closure, and then
// evaluate a new AST with the closure just like we did above.
// (some-exp arg1 arg2 ...) -> (closure arg1 arg2 ...) -> result-of-function-call

test('calling very simple function in environment', function(t) {
    // A call to a symbol corresponds to a call to its value in the environment.
    // When a symbol is the first element of the AST list, it is resolved to its
    // value in the environment (which should be a function closure). An AST
    // with the variables replaced with its value should then be
    // evaluated instead.
    t.plan(2);

    var env = new Environment();

    evaluate(parse('(define add (lambda (x y) (+ x y)))'), env);

    t.ok(env.lookup('add') instanceof Closure);

    t.equals(evaluate(parse('(add 1 2)'), env), 3);
});

test('calling lambda directly', function(t) {
    // It should be possible to define and call functions directly.
    // A lambda definition in the call position of an AST should be evaluated,
    // and then evaluated as before.
    t.plan(1);

    t.equals(evaluate(parse('((lambda (x) x) 42)'), new Environment()), 42);
});

test('calling complex expression which evaluates to function', function(t) {
    // Actually, all ASTs that are not atoms should be evaluated and then
    // called. In this test, a call is done to the if-expression. The `if`
    // should be evaluated, which will result in a `lambda` expression.
    // The lambda is evaluated, giving a closure. The result is an AST with a
    // `closure` as the first element, which we already know how to evaluate.
    t.plan(1);

    var ast = parse('((if #f\
                    wont-evaluate-this-branch\
                    (lambda (x) (+ x y)))\
                    2)');

    t.equals(evaluate(ast, new Environment({ y: 3 })), 5);
});

// Now that we have the happy cases working, let's see what should happen when
// function calls are done incorrectly.

test('calling atom raises exception', function(t) {
    // A function call to a non-function should result in an error
    t.plan(2);

    t.throws(function() {
        evaluate(parse("(#t 'foo 'bar)"), new Environment());
    }, /not a function/);

    t.throws(function() {
        evaluate(parse('(42)'), new Environment());
    }, /not a function/);
});

test('test make sure arguments to functions are evaluated', function(t) {
    // The arguments passed to functions should be evaluated
    // We should accept parameters that are produced through function
    // calls.
    t.plan(1);

    t.equals(evaluate(parse('((lambda (x) x) (+ 1 2))'), new Environment()), 3);
});

test('calling with wrong number of arguments', function(t) {
    // Functions should raise exceptions when called with wrong number of arguments.
    t.plan(1);

    var env = new Environment();

    evaluate(parse("(define fn (lambda (p1 p2) 'whatever))"), env);

    t.throws(function() {
        evaluate(parse('(fn 1 2 3)'), env);
    }, /Wrong number of arguments, expected 2 got 3/);
});

// One final test to see that recursive functions are working as expected.
// The good news: this should already be working by now :)

test('calling function recursively', function(t) {
    // Tests that a named function is included in the environment
    // where it is evaluated.
    t.plan(2);

    var env = new Environment();

    evaluate(parse("(define my-fn\n\
                   ;; A meaningless, but recursive, function\n\
                   (lambda (x)\n\
                   (if (eq x 0)\n\
                   42\n\
                   (my-fn (- x 1)))))"), env);

    t.equals(evaluate(parse('(my-fn 0)'), env), 42);
    t.equals(evaluate(parse('(my-fn 10)'), env), 42);
});
