/*jshint multistr: true*/
var test = require('tape'),
    parse = require('../src/parse'),
    evaluate = require('../src/evaluate');

test('defining and evaluating simple macro', function(t) {
    // The defmacro special form should expand its body. When defined without a special
    // body it should just behave like a regular lambda
    t.plan(1);

    evaluate(parse('(defmacro foo (lambda ()\n\
                  (+ 1 1)))'));

    t.equals(evaluate(parse('(foo)')), 2);
});

test('defining and evaluating simple expanding macro', function(t) {
    t.plan(1);

    evaluate(parse('(defmacro inc (lambda (num)\n\
                   `(+ 1 ,num)))'));

    t.equals(evaluate(parse('(inc (+ 1 1))')), 3);
});

test('defining and evaluating unquotesplicing macro', function(t) {
    t.plan(1);

    evaluate(parse('(defmacro foo (lambda strs\n\
                   `(join ,(head strs) \',(tail strs))))'));

    t.equals(evaluate(parse('(foo "-" "f" "o" "o")')), "f-o-o");
});

test('defining macro outside of top level should fail', function(t) {
    t.plan(1);

    t.throws(function() {
        parse('(define foo (defmacro inc (lambda (num) (+ 1 num))))');
    }, /defmacro only allowed at top level/);
});
