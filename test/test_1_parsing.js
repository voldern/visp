var test = require('tape'),
    parse = require('../src/parser').parse,
    unparse = require('../src/parser').unparse;

test('parse single symbol', function(t) {
    // Parsing a single symbol.
    // Symbols are represented by text strings. Parsing a single atom should
    // result in an AST consisting of only that symbol.
    t.plan(1);

    t.equals(parse('foo'), 'foo');
});

test('parse boolean', function(t) {
    // Parsing single booleans.
    // Booleans are the special symbols #t and #f. In the ASTs they are
    // represented by true and false, respectively.
    t.plan(2);

    t.equals(parse('#t'), true);
    t.equals(parse('#f'), false);
});

test('parse integer', function(t) {
    // Parsing single integer.
    // Integers are represented in the ASTs as ints.
    t.plan(2);

    t.equals(parse('42'), 42);
    t.equals(parse('1337'), 1337);
});

test('parse string', function(t) {
    // Parse string. Strings are represented in the ASTs as instances of String
    // objects.
    t.plan(3);

    t.ok(parse('"Foo"') instanceof String);
    t.equals(parse('"Foo bar"').valueOf(), 'Foo bar');

    t.throws(function() {
        parse('"Foo');
    }, /Expected.*but "\\"" found/);
});

test('parse list of symbols', function(t) {
    // Parsing list of only symbols.
    // A list is represented by a number of elements surrounded by parens.
    // Arrays are used to represent lists as ASTs.
    t.plan(2);

    t.looseEquals(parse('(foo bar baz)'), ['foo', 'bar', 'baz']);
    t.looseEquals(parse('()'), []);
});

test('parse list of mixed types', function(t) {
    // Parsing a list containing different types.
    // When parsing lists, make sure each of the sub-expressions are also parsed
    // properly.
    t.plan(1);

    t.looseEquals(parse('(foo #t 123 "Test")'), ['foo', true, 123,
                                                 new String('Test')]);
});

test('parse on nested list', function(t) {
    // Parsing should also handle nested lists properly.
    t.plan(1);

    t.looseEquals(parse('(foo (bar ((#t)) x) (baz y))'),
                  ['foo',
                   ['bar', [[true]], 'x'],
                   ['baz', 'y']]);
});

test('parse exception missing paren', function(t) {
    // The proper exception should be raised if the expresions is incomplete.
    t.plan(1);

    t.throws(function() {
        parse('(foo (bar x y)');
    }, /Expected.*but end of input/);
});

test('parse exception extra paren', function(t) {
    // Another exception is raised if the expression is too large.
    // The parse function expects to receive only one single expression.
    // Anything more than this, should result in the proper exception.
    t.plan(1);

    t.throws(function() {
        parse('(foo (bar x y)))');
    }, /Expected.*end of input/);
});

test('parse with extra whitespace', function(t) {
    // Excess whitespace should be removed.
    t.plan(1);

    t.looseEquals(parse("\n\n   (program   with much   whitespace)\n  "),
                  ['program', 'with', 'much', 'whitespace']);
});

test('parse comments', function(t) {
    // All comments should be stripped away as part of the parsing.
    t.plan(1);

    var program = ";; this first line is a comment\n\
    (define variable\n\
    ; here is another comment\n\
    (if #t\n\
    42 ; inline comment!\n\
    (something else)))";

    t.looseEquals(parse(program), ['define', 'variable',
                                   ['if', true,
                                    42,
                                    ['something', 'else']]]);
});

test('parse larger example', function(t) {
    // Test a larger example to check that everything works as expected
    t.plan(1);

    var program = "(define fact\n\
    ;; Factorial function\n\
    (lambda (n)\n\
    (if (<= n 1)\n\
    1 ; Factorial of 0 is 1, and we deny\n\
    ; the existence of negative numbers\n\
    (* n (fact (- n 1))))))";

    t.looseEquals(parse(program),
                  ['define', 'fact',
                   ['lambda', ['n'],
                    ['if', ['<=', 'n', 1],
                     1,
                     ['*', 'n', ['fact', ['-', 'n', 1]]]]]]);
});

test('expand single quoted symbol', function(t) {
    // Quoting is a shorthand syntax for calling the `quote` form.
    // Examples:
    // 'foo -> (quote foo)
    // '(foo bar) -> (quote (foo bar))
    t.plan(2);

    t.looseEquals(parse("(foo 'nil)"), ['foo', ['quote', 'nil']]);

    t.looseEquals(parse("(foo '(bar baz))"),
                  ['foo', ['quote', ['bar', 'baz']]]);
});

test('nested quotes', function(t) {
    t.plan(1);

    t.looseEquals(parse("''''foo"),
                  ["quote", ["quote", ["quote", ["quote", "foo"]]]]);
});

test('expand crazy quote combo', function(t) {
    // One final test to see that quote expansion works.
    t.plan(1);

    var source = "'(this ''''(makes ''no) 'sense)";

    t.equals(unparse(parse(source)), source);
});
