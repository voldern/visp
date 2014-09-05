/*jshint multistr: true*/
var test = require('tape'),
    parse = require('../src/parse'),
    evaluate = require('../src/evaluate');

test('calling global javascript function', function(t) {
    t.plan(1);

    t.equal(evaluate(parse('(js/parseInt "f" 16)')), 15);
});
