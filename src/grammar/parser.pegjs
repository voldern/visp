start
  = stmt+

stmt
  = (__ v:value __) { return v; }

value
  = int
  / string
  / interop
  / keyword
  / quote
  / quasiquote
  / unquotesplicing
  / unquote
  / bool
  / list

list
  = '('
    values:(
      first:value
      rest:(__ v:value { return v; })*
      { return [first].concat(rest); }
    )?
    ')'
    {
      if (values === null) {
          return [];
      } else {
          return values;
      }
    }

int "Integer"
  = i:[0-9]+ { return parseInt(i.join(""), 10); }

string "String"
  = '"' str:[^"\n]+ '"' { return str.join(''); }

bool "Boolean"
  = '#t' { return true; }
  / '#f' { return false; }

quote
  = "'" k:value { return [new String('quote'), k]; }

quasiquote
  = "`" k:value { return [new String('quasiquote'), k]; }

unquote
  = ',' k:value { return [new String('unquote'), k]; }

unquotesplicing
  = ',@' k:value { return [new String('unquotesplicing'), k]; }

keyword "Keyword"
  = k:[0-9+\-*=\<\>\/a-z]+ { return new String(k.join("")); }

interop "Interop"
  = 'js/' k:[0-9\-_a-zA-Z]+ { return new String('js/' + k.join("")); }

ws "Whitespace"
  = [ \t\n\r]

__
  = (ws / comment)*

EOL
  = [\n\r]

comment "Comment"
  = ';' (!EOL .)*
