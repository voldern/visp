start
  = stmt+

stmt
  = (__ v:value __) { return v; }

value
  = int
  / string
  / keyword
  / quote
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
  = '"' str:[^"\n]+ '"' { return new String(str.join('')); }

bool "Boolean"
  = '#t' { return true; }
  / '#f' { return false; }

quote
  = "'" k:value { return ['quote', k]; }

keyword "Keyword"
  = k:[0-9+\-*=\<\>\/a-z]+ { return k.join(""); }

ws "Whitespace"
  = [ \t\n\r]

__
  = (ws / comment)*

EOL
  = [\n\r]

comment "Comment"
  = ';' (!EOL .)*
