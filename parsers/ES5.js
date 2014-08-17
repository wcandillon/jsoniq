// This file was generated on Fri Aug 22, 2014 20:20 (UTC+02) by REx v5.30 which is Copyright (c) 1979-2014 by Gunther Rademacher <grd@gmx.net>
// REx command line: ES5Parser.ebnf -tree -javascript -ll 1 -backtrack -a jsoniq

                                                            // line 3 "ES5Parser.ebnf"
                                                            var ES5Parser = exports.ES5Parser = function ES5Parser(string, parsingEventHandler)
                                                            {
                                                              init(string, parsingEventHandler);
                                                            // line 9 "ES5Parser.js"
  var self = this;

  this.ParseException = function(b, e, s, o, x)
  {
    var
      begin = b,
      end = e,
      state = s,
      offending = o,
      expected = x;

    this.getBegin = function() {return begin;};
    this.getEnd = function() {return end;};
    this.getState = function() {return state;};
    this.getExpected = function() {return expected;};
    this.getOffending = function() {return offending;};

    this.getMessage = function()
    {
      return offending < 0 ? "lexical analysis failed" : "syntax error";
    };
  };

  function init(string, parsingEventHandler)
  {
    eventHandler = parsingEventHandler;
    input = string;
    size = string.length;
    reset(0, 0, 0);
  }

  this.getInput = function()
  {
    return input;
  };

  function reset(l, b, e)
  {
            b0 = b; e0 = b;
    l1 = l; b1 = b; e1 = e;
    end = e;
    ex = -1;
    memo = {};
    eventHandler.reset(input);
  }

  this.getOffendingToken = function(e)
  {
    var o = e.getOffending();
    return o >= 0 ? ES5Parser.TOKEN[o] : null;
  };

  this.getExpectedTokenSet = function(e)
  {
    var expected;
    if (e.getExpected() < 0)
    {
      expected = ES5Parser.getTokenSet(- e.getState());
    }
    else
    {
      expected = [ES5Parser.TOKEN[e.getExpected()]];
    }
    return expected;
  };

  this.getErrorMessage = function(e)
  {
    var tokenSet = this.getExpectedTokenSet(e);
    var found = this.getOffendingToken(e);
    var prefix = input.substring(0, e.getBegin());
    var lines = prefix.split("\n");
    var line = lines.length;
    var column = lines[line - 1].length + 1;
    var size = e.getEnd() - e.getBegin();
    return e.getMessage()
         + (found == null ? "" : ", found " + found)
         + "\nwhile expecting "
         + (tokenSet.length == 1 ? tokenSet[0] : ("[" + tokenSet.join(", ") + "]"))
         + "\n"
         + (size == 0 || found != null ? "" : "after successfully scanning " + size + " characters beginning ")
         + "at line " + line + ", column " + column + ":\n..."
         + input.substring(e.getBegin(), Math.min(input.length, e.getBegin() + 64))
         + "...";
  };

  this.parse_Program = function()
  {
    eventHandler.startNonterminal("Program", e0);
    for (;;)
    {
      lookahead1W(25);              // EOF | Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '~'
      if (l1 == 1)                  // EOF
      {
        break;
      }
      whitespace();
      parse_SourceElement();
    }
    shift(1);                       // EOF
    eventHandler.endNonterminal("Program", e0);
  };

  function parse_SourceElement()
  {
    eventHandler.startNonterminal("SourceElement", e0);
    if (l1 == 65)                   // 'function'
    {
      lk = memoized(0, e0);
      if (lk == 0)
      {
        var b0A = b0; var e0A = e0; var l1A = l1;
        var b1A = b1; var e1A = e1;
        try
        {
          try_FunctionDeclaration();
          lk = -1;
        }
        catch (p1A)
        {
          lk = -2;
        }
        b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
        b1 = b1A; e1 = e1A; end = e1A; }
        memoize(0, e0, lk);
      }
    }
    else
    {
      lk = l1;
    }
    switch (lk)
    {
    case -1:
      parse_FunctionDeclaration();
      break;
    default:
      parse_Statement();
    }
    eventHandler.endNonterminal("SourceElement", e0);
  }

  function try_SourceElement()
  {
    if (l1 == 65)                   // 'function'
    {
      lk = memoized(0, e0);
      if (lk == 0)
      {
        var b0A = b0; var e0A = e0; var l1A = l1;
        var b1A = b1; var e1A = e1;
        try
        {
          try_FunctionDeclaration();
          memoize(0, e0A, -1);
          lk = -3;
        }
        catch (p1A)
        {
          lk = -2;
          b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
          b1 = b1A; e1 = e1A; end = e1A; }
          memoize(0, e0A, -2);
        }
      }
    }
    else
    {
      lk = l1;
    }
    switch (lk)
    {
    case -1:
      try_FunctionDeclaration();
      break;
    case -3:
      break;
    default:
      try_Statement();
    }
  }

  function parse_Statement()
  {
    eventHandler.startNonterminal("Statement", e0);
    if (l1 == 2                     // Identifier
     || l1 == 82)                   // '{'
    {
      lk = memoized(1, e0);
      if (lk == 0)
      {
        var b0A = b0; var e0A = e0; var l1A = l1;
        var b1A = b1; var e1A = e1;
        try
        {
          try_Block();
          lk = -1;
        }
        catch (p1A)
        {
          try
          {
            b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
            b1 = b1A; e1 = e1A; end = e1A; }
            try_ExpressionStatement();
            lk = -4;
          }
          catch (p4A)
          {
            lk = -11;
          }
        }
        b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
        b1 = b1A; e1 = e1A; end = e1A; }
        memoize(1, e0, lk);
      }
    }
    else
    {
      lk = l1;
    }
    switch (lk)
    {
    case -1:
      parse_Block();
      break;
    case 78:                        // 'var'
      parse_VariableStatement();
      break;
    case 35:                        // ';'
      parse_EmptyStatement();
      break;
    case 67:                        // 'if'
      parse_IfStatement();
      break;
    case 61:                        // 'do'
    case 64:                        // 'for'
    case 80:                        // 'while'
      parse_IterationStatement();
      break;
    case 57:                        // 'continue'
      parse_ContinueStatement();
      break;
    case 54:                        // 'break'
      parse_BreakStatement();
      break;
    case 71:                        // 'return'
      parse_ReturnStatement();
      break;
    case 81:                        // 'with'
      parse_WithStatement();
      break;
    case -11:
      parse_LabelledStatement();
      break;
    case 73:                        // 'switch'
      parse_SwitchStatement();
      break;
    case 75:                        // 'throw'
      parse_ThrowStatement();
      break;
    case 76:                        // 'try'
      parse_TryStatement();
      break;
    case 58:                        // 'debugger'
      parse_DebuggerStatement();
      break;
    default:
      parse_ExpressionStatement();
    }
    eventHandler.endNonterminal("Statement", e0);
  }

  function try_Statement()
  {
    if (l1 == 2                     // Identifier
     || l1 == 82)                   // '{'
    {
      lk = memoized(1, e0);
      if (lk == 0)
      {
        var b0A = b0; var e0A = e0; var l1A = l1;
        var b1A = b1; var e1A = e1;
        try
        {
          try_Block();
          memoize(1, e0A, -1);
          lk = -16;
        }
        catch (p1A)
        {
          try
          {
            b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
            b1 = b1A; e1 = e1A; end = e1A; }
            try_ExpressionStatement();
            memoize(1, e0A, -4);
            lk = -16;
          }
          catch (p4A)
          {
            lk = -11;
            b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
            b1 = b1A; e1 = e1A; end = e1A; }
            memoize(1, e0A, -11);
          }
        }
      }
    }
    else
    {
      lk = l1;
    }
    switch (lk)
    {
    case -1:
      try_Block();
      break;
    case 78:                        // 'var'
      try_VariableStatement();
      break;
    case 35:                        // ';'
      try_EmptyStatement();
      break;
    case 67:                        // 'if'
      try_IfStatement();
      break;
    case 61:                        // 'do'
    case 64:                        // 'for'
    case 80:                        // 'while'
      try_IterationStatement();
      break;
    case 57:                        // 'continue'
      try_ContinueStatement();
      break;
    case 54:                        // 'break'
      try_BreakStatement();
      break;
    case 71:                        // 'return'
      try_ReturnStatement();
      break;
    case 81:                        // 'with'
      try_WithStatement();
      break;
    case -11:
      try_LabelledStatement();
      break;
    case 73:                        // 'switch'
      try_SwitchStatement();
      break;
    case 75:                        // 'throw'
      try_ThrowStatement();
      break;
    case 76:                        // 'try'
      try_TryStatement();
      break;
    case 58:                        // 'debugger'
      try_DebuggerStatement();
      break;
    case -16:
      break;
    default:
      try_ExpressionStatement();
    }
  }

  function parse_Block()
  {
    eventHandler.startNonterminal("Block", e0);
    shift(82);                      // '{'
    for (;;)
    {
      lookahead1W(26);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '}' | '~'
      if (l1 == 86)                 // '}'
      {
        break;
      }
      whitespace();
      parse_Statement();
    }
    shift(86);                      // '}'
    eventHandler.endNonterminal("Block", e0);
  }

  function try_Block()
  {
    shiftT(82);                     // '{'
    for (;;)
    {
      lookahead1W(26);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '}' | '~'
      if (l1 == 86)                 // '}'
      {
        break;
      }
      try_Statement();
    }
    shiftT(86);                     // '}'
  }

  function parse_VariableStatement()
  {
    eventHandler.startNonterminal("VariableStatement", e0);
    shift(78);                      // 'var'
    lookahead1W(0);                 // Identifier | WhiteSpace | Comment
    whitespace();
    parse_VariableDeclarationList();
    whitespace();
    parse_Semicolon();
    eventHandler.endNonterminal("VariableStatement", e0);
  }

  function try_VariableStatement()
  {
    shiftT(78);                     // 'var'
    lookahead1W(0);                 // Identifier | WhiteSpace | Comment
    try_VariableDeclarationList();
    try_Semicolon();
  }

  function parse_VariableDeclarationList()
  {
    eventHandler.startNonterminal("VariableDeclarationList", e0);
    parse_VariableDeclaration();
    for (;;)
    {
      if (l1 != 27)                 // ','
      {
        break;
      }
      shift(27);                    // ','
      lookahead1W(0);               // Identifier | WhiteSpace | Comment
      whitespace();
      parse_VariableDeclaration();
    }
    eventHandler.endNonterminal("VariableDeclarationList", e0);
  }

  function try_VariableDeclarationList()
  {
    try_VariableDeclaration();
    for (;;)
    {
      if (l1 != 27)                 // ','
      {
        break;
      }
      shiftT(27);                   // ','
      lookahead1W(0);               // Identifier | WhiteSpace | Comment
      try_VariableDeclaration();
    }
  }

  function parse_VariableDeclaration()
  {
    eventHandler.startNonterminal("VariableDeclaration", e0);
    shift(2);                       // Identifier
    lookahead1W(31);                // EOF | Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | ',' | '-' | '--' | ';' | '=' | '[' | 'break' |
                                    // 'case' | 'continue' | 'debugger' | 'default' | 'delete' | 'do' | 'else' | 'for' |
                                    // 'function' | 'if' | 'new' | 'return' | 'switch' | 'this' | 'throw' | 'try' |
                                    // 'typeof' | 'var' | 'void' | 'while' | 'with' | '{' | '}' | '~'
    if (l1 == 40)                   // '='
    {
      whitespace();
      parse_Initialiser();
    }
    eventHandler.endNonterminal("VariableDeclaration", e0);
  }

  function try_VariableDeclaration()
  {
    shiftT(2);                      // Identifier
    lookahead1W(31);                // EOF | Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | ',' | '-' | '--' | ';' | '=' | '[' | 'break' |
                                    // 'case' | 'continue' | 'debugger' | 'default' | 'delete' | 'do' | 'else' | 'for' |
                                    // 'function' | 'if' | 'new' | 'return' | 'switch' | 'this' | 'throw' | 'try' |
                                    // 'typeof' | 'var' | 'void' | 'while' | 'with' | '{' | '}' | '~'
    if (l1 == 40)                   // '='
    {
      try_Initialiser();
    }
  }

  function parse_Initialiser()
  {
    eventHandler.startNonterminal("Initialiser", e0);
    shift(40);                      // '='
    lookahead1W(20);                // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
    whitespace();
    parse_AssignmentExpression();
    eventHandler.endNonterminal("Initialiser", e0);
  }

  function try_Initialiser()
  {
    shiftT(40);                     // '='
    lookahead1W(20);                // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
    try_AssignmentExpression();
  }

  function parse_AssignmentExpression()
  {
    eventHandler.startNonterminal("AssignmentExpression", e0);
    if (l1 != 12                    // '!'
     && l1 != 24                    // '+'
     && l1 != 25                    // '++'
     && l1 != 28                    // '-'
     && l1 != 29                    // '--'
     && l1 != 60                    // 'delete'
     && l1 != 77                    // 'typeof'
     && l1 != 79                    // 'void'
     && l1 != 87)                   // '~'
    {
      lk = memoized(2, e0);
      if (lk == 0)
      {
        var b0A = b0; var e0A = e0; var l1A = l1;
        var b1A = b1; var e1A = e1;
        try
        {
          try_LeftHandSideExpression();
          try_AssignmentOperator();
          lookahead1W(20);          // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
          try_AssignmentExpression();
          lk = -1;
        }
        catch (p1A)
        {
          lk = -2;
        }
        b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
        b1 = b1A; e1 = e1A; end = e1A; }
        memoize(2, e0, lk);
      }
    }
    else
    {
      lk = l1;
    }
    switch (lk)
    {
    case -1:
      parse_LeftHandSideExpression();
      whitespace();
      parse_AssignmentOperator();
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_AssignmentExpression();
      break;
    default:
      parse_ConditionalExpression();
    }
    eventHandler.endNonterminal("AssignmentExpression", e0);
  }

  function try_AssignmentExpression()
  {
    if (l1 != 12                    // '!'
     && l1 != 24                    // '+'
     && l1 != 25                    // '++'
     && l1 != 28                    // '-'
     && l1 != 29                    // '--'
     && l1 != 60                    // 'delete'
     && l1 != 77                    // 'typeof'
     && l1 != 79                    // 'void'
     && l1 != 87)                   // '~'
    {
      lk = memoized(2, e0);
      if (lk == 0)
      {
        var b0A = b0; var e0A = e0; var l1A = l1;
        var b1A = b1; var e1A = e1;
        try
        {
          try_LeftHandSideExpression();
          try_AssignmentOperator();
          lookahead1W(20);          // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
          try_AssignmentExpression();
          memoize(2, e0A, -1);
          lk = -3;
        }
        catch (p1A)
        {
          lk = -2;
          b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
          b1 = b1A; e1 = e1A; end = e1A; }
          memoize(2, e0A, -2);
        }
      }
    }
    else
    {
      lk = l1;
    }
    switch (lk)
    {
    case -1:
      try_LeftHandSideExpression();
      try_AssignmentOperator();
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_AssignmentExpression();
      break;
    case -3:
      break;
    default:
      try_ConditionalExpression();
    }
  }

  function parse_ConditionalExpression()
  {
    eventHandler.startNonterminal("ConditionalExpression", e0);
    parse_LogicalORExpression();
    if (l1 == 49)                   // '?'
    {
      shift(49);                    // '?'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_AssignmentExpression();
      shift(34);                    // ':'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_AssignmentExpression();
    }
    eventHandler.endNonterminal("ConditionalExpression", e0);
  }

  function try_ConditionalExpression()
  {
    try_LogicalORExpression();
    if (l1 == 49)                   // '?'
    {
      shiftT(49);                   // '?'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_AssignmentExpression();
      shiftT(34);                   // ':'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_AssignmentExpression();
    }
  }

  function parse_LogicalORExpression()
  {
    eventHandler.startNonterminal("LogicalORExpression", e0);
    parse_LogicalANDExpression();
    for (;;)
    {
      if (l1 != 85)                 // '||'
      {
        break;
      }
      shift(85);                    // '||'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_LogicalANDExpression();
    }
    eventHandler.endNonterminal("LogicalORExpression", e0);
  }

  function try_LogicalORExpression()
  {
    try_LogicalANDExpression();
    for (;;)
    {
      if (l1 != 85)                 // '||'
      {
        break;
      }
      shiftT(85);                   // '||'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_LogicalANDExpression();
    }
  }

  function parse_LogicalANDExpression()
  {
    eventHandler.startNonterminal("LogicalANDExpression", e0);
    parse_BitwiseORExpression();
    for (;;)
    {
      if (l1 != 18)                 // '&&'
      {
        break;
      }
      shift(18);                    // '&&'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_BitwiseORExpression();
    }
    eventHandler.endNonterminal("LogicalANDExpression", e0);
  }

  function try_LogicalANDExpression()
  {
    try_BitwiseORExpression();
    for (;;)
    {
      if (l1 != 18)                 // '&&'
      {
        break;
      }
      shiftT(18);                   // '&&'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_BitwiseORExpression();
    }
  }

  function parse_BitwiseORExpression()
  {
    eventHandler.startNonterminal("BitwiseORExpression", e0);
    parse_BitwiseXORExpression();
    for (;;)
    {
      if (l1 != 83)                 // '|'
      {
        break;
      }
      shift(83);                    // '|'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_BitwiseXORExpression();
    }
    eventHandler.endNonterminal("BitwiseORExpression", e0);
  }

  function try_BitwiseORExpression()
  {
    try_BitwiseXORExpression();
    for (;;)
    {
      if (l1 != 83)                 // '|'
      {
        break;
      }
      shiftT(83);                   // '|'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_BitwiseXORExpression();
    }
  }

  function parse_BitwiseXORExpression()
  {
    eventHandler.startNonterminal("BitwiseXORExpression", e0);
    parse_BitwiseANDExpression();
    for (;;)
    {
      if (l1 != 52)                 // '^'
      {
        break;
      }
      shift(52);                    // '^'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_BitwiseANDExpression();
    }
    eventHandler.endNonterminal("BitwiseXORExpression", e0);
  }

  function try_BitwiseXORExpression()
  {
    try_BitwiseANDExpression();
    for (;;)
    {
      if (l1 != 52)                 // '^'
      {
        break;
      }
      shiftT(52);                   // '^'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_BitwiseANDExpression();
    }
  }

  function parse_BitwiseANDExpression()
  {
    eventHandler.startNonterminal("BitwiseANDExpression", e0);
    parse_EqualityExpression();
    for (;;)
    {
      if (l1 != 17)                 // '&'
      {
        break;
      }
      shift(17);                    // '&'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_EqualityExpression();
    }
    eventHandler.endNonterminal("BitwiseANDExpression", e0);
  }

  function try_BitwiseANDExpression()
  {
    try_EqualityExpression();
    for (;;)
    {
      if (l1 != 17)                 // '&'
      {
        break;
      }
      shiftT(17);                   // '&'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_EqualityExpression();
    }
  }

  function parse_EqualityExpression()
  {
    eventHandler.startNonterminal("EqualityExpression", e0);
    parse_RelationalExpression();
    for (;;)
    {
      if (l1 != 13                  // '!='
       && l1 != 14                  // '!=='
       && l1 != 41                  // '=='
       && l1 != 42)                 // '==='
      {
        break;
      }
      switch (l1)
      {
      case 41:                      // '=='
        shift(41);                  // '=='
        break;
      case 13:                      // '!='
        shift(13);                  // '!='
        break;
      case 42:                      // '==='
        shift(42);                  // '==='
        break;
      default:
        shift(14);                  // '!=='
      }
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_RelationalExpression();
    }
    eventHandler.endNonterminal("EqualityExpression", e0);
  }

  function try_EqualityExpression()
  {
    try_RelationalExpression();
    for (;;)
    {
      if (l1 != 13                  // '!='
       && l1 != 14                  // '!=='
       && l1 != 41                  // '=='
       && l1 != 42)                 // '==='
      {
        break;
      }
      switch (l1)
      {
      case 41:                      // '=='
        shiftT(41);                 // '=='
        break;
      case 13:                      // '!='
        shiftT(13);                 // '!='
        break;
      case 42:                      // '==='
        shiftT(42);                 // '==='
        break;
      default:
        shiftT(14);                 // '!=='
      }
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_RelationalExpression();
    }
  }

  function parse_RelationalExpression()
  {
    eventHandler.startNonterminal("RelationalExpression", e0);
    parse_ShiftExpression();
    for (;;)
    {
      if (l1 != 36                  // '<'
       && l1 != 39                  // '<='
       && l1 != 43                  // '>'
       && l1 != 44                  // '>='
       && l1 != 68                  // 'in'
       && l1 != 69)                 // 'instanceof'
      {
        break;
      }
      switch (l1)
      {
      case 36:                      // '<'
        shift(36);                  // '<'
        break;
      case 43:                      // '>'
        shift(43);                  // '>'
        break;
      case 39:                      // '<='
        shift(39);                  // '<='
        break;
      case 44:                      // '>='
        shift(44);                  // '>='
        break;
      case 69:                      // 'instanceof'
        shift(69);                  // 'instanceof'
        break;
      default:
        shift(68);                  // 'in'
      }
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_ShiftExpression();
    }
    eventHandler.endNonterminal("RelationalExpression", e0);
  }

  function try_RelationalExpression()
  {
    try_ShiftExpression();
    for (;;)
    {
      if (l1 != 36                  // '<'
       && l1 != 39                  // '<='
       && l1 != 43                  // '>'
       && l1 != 44                  // '>='
       && l1 != 68                  // 'in'
       && l1 != 69)                 // 'instanceof'
      {
        break;
      }
      switch (l1)
      {
      case 36:                      // '<'
        shiftT(36);                 // '<'
        break;
      case 43:                      // '>'
        shiftT(43);                 // '>'
        break;
      case 39:                      // '<='
        shiftT(39);                 // '<='
        break;
      case 44:                      // '>='
        shiftT(44);                 // '>='
        break;
      case 69:                      // 'instanceof'
        shiftT(69);                 // 'instanceof'
        break;
      default:
        shiftT(68);                 // 'in'
      }
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_ShiftExpression();
    }
  }

  function parse_ShiftExpression()
  {
    eventHandler.startNonterminal("ShiftExpression", e0);
    parse_AdditiveExpression();
    for (;;)
    {
      if (l1 != 37                  // '<<'
       && l1 != 45                  // '>>'
       && l1 != 47)                 // '>>>'
      {
        break;
      }
      switch (l1)
      {
      case 37:                      // '<<'
        shift(37);                  // '<<'
        break;
      case 45:                      // '>>'
        shift(45);                  // '>>'
        break;
      default:
        shift(47);                  // '>>>'
      }
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_AdditiveExpression();
    }
    eventHandler.endNonterminal("ShiftExpression", e0);
  }

  function try_ShiftExpression()
  {
    try_AdditiveExpression();
    for (;;)
    {
      if (l1 != 37                  // '<<'
       && l1 != 45                  // '>>'
       && l1 != 47)                 // '>>>'
      {
        break;
      }
      switch (l1)
      {
      case 37:                      // '<<'
        shiftT(37);                 // '<<'
        break;
      case 45:                      // '>>'
        shiftT(45);                 // '>>'
        break;
      default:
        shiftT(47);                 // '>>>'
      }
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_AdditiveExpression();
    }
  }

  function parse_AdditiveExpression()
  {
    eventHandler.startNonterminal("AdditiveExpression", e0);
    parse_MultiplicativeExpression();
    for (;;)
    {
      if (l1 == 24                  // '+'
       || l1 == 28)                 // '-'
      {
        lk = memoized(3, e0);
        if (lk == 0)
        {
          var b0A = b0; var e0A = e0; var l1A = l1;
          var b1A = b1; var e1A = e1;
          try
          {
            switch (l1)
            {
            case 24:                // '+'
              shiftT(24);           // '+'
              break;
            default:
              shiftT(28);           // '-'
            }
            lookahead1W(20);        // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
            try_MultiplicativeExpression();
            lk = -1;
          }
          catch (p1A)
          {
            lk = -2;
          }
          b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
          b1 = b1A; e1 = e1A; end = e1A; }
          memoize(3, e0, lk);
        }
      }
      else
      {
        lk = l1;
      }
      if (lk != -1)
      {
        break;
      }
      switch (l1)
      {
      case 24:                      // '+'
        shift(24);                  // '+'
        break;
      default:
        shift(28);                  // '-'
      }
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_MultiplicativeExpression();
    }
    eventHandler.endNonterminal("AdditiveExpression", e0);
  }

  function try_AdditiveExpression()
  {
    try_MultiplicativeExpression();
    for (;;)
    {
      if (l1 == 24                  // '+'
       || l1 == 28)                 // '-'
      {
        lk = memoized(3, e0);
        if (lk == 0)
        {
          var b0A = b0; var e0A = e0; var l1A = l1;
          var b1A = b1; var e1A = e1;
          try
          {
            switch (l1)
            {
            case 24:                // '+'
              shiftT(24);           // '+'
              break;
            default:
              shiftT(28);           // '-'
            }
            lookahead1W(20);        // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
            try_MultiplicativeExpression();
            memoize(3, e0A, -1);
            continue;
          }
          catch (p1A)
          {
            b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
            b1 = b1A; e1 = e1A; end = e1A; }
            memoize(3, e0A, -2);
            break;
          }
        }
      }
      else
      {
        lk = l1;
      }
      if (lk != -1)
      {
        break;
      }
      switch (l1)
      {
      case 24:                      // '+'
        shiftT(24);                 // '+'
        break;
      default:
        shiftT(28);                 // '-'
      }
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_MultiplicativeExpression();
    }
  }

  function parse_MultiplicativeExpression()
  {
    eventHandler.startNonterminal("MultiplicativeExpression", e0);
    parse_UnaryExpression();
    for (;;)
    {
      lookahead1W(32);              // EOF | Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '!=' | '!==' | '%' | '&' | '&&' | '(' | ')' | '*' | '+' | '++' |
                                    // ',' | '-' | '--' | '/' | ':' | ';' | '<' | '<<' | '<=' | '==' | '===' | '>' |
                                    // '>=' | '>>' | '>>>' | '?' | '[' | ']' | '^' | 'break' | 'case' | 'continue' |
                                    // 'debugger' | 'default' | 'delete' | 'do' | 'else' | 'for' | 'function' | 'if' |
                                    // 'in' | 'instanceof' | 'new' | 'return' | 'switch' | 'this' | 'throw' | 'try' |
                                    // 'typeof' | 'var' | 'void' | 'while' | 'with' | '{' | '|' | '||' | '}' | '~'
      if (l1 != 15                  // '%'
       && l1 != 22                  // '*'
       && l1 != 32)                 // '/'
      {
        break;
      }
      switch (l1)
      {
      case 22:                      // '*'
        shift(22);                  // '*'
        break;
      case 32:                      // '/'
        shift(32);                  // '/'
        break;
      default:
        shift(15);                  // '%'
      }
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_UnaryExpression();
    }
    eventHandler.endNonterminal("MultiplicativeExpression", e0);
  }

  function try_MultiplicativeExpression()
  {
    try_UnaryExpression();
    for (;;)
    {
      lookahead1W(32);              // EOF | Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '!=' | '!==' | '%' | '&' | '&&' | '(' | ')' | '*' | '+' | '++' |
                                    // ',' | '-' | '--' | '/' | ':' | ';' | '<' | '<<' | '<=' | '==' | '===' | '>' |
                                    // '>=' | '>>' | '>>>' | '?' | '[' | ']' | '^' | 'break' | 'case' | 'continue' |
                                    // 'debugger' | 'default' | 'delete' | 'do' | 'else' | 'for' | 'function' | 'if' |
                                    // 'in' | 'instanceof' | 'new' | 'return' | 'switch' | 'this' | 'throw' | 'try' |
                                    // 'typeof' | 'var' | 'void' | 'while' | 'with' | '{' | '|' | '||' | '}' | '~'
      if (l1 != 15                  // '%'
       && l1 != 22                  // '*'
       && l1 != 32)                 // '/'
      {
        break;
      }
      switch (l1)
      {
      case 22:                      // '*'
        shiftT(22);                 // '*'
        break;
      case 32:                      // '/'
        shiftT(32);                 // '/'
        break;
      default:
        shiftT(15);                 // '%'
      }
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_UnaryExpression();
    }
  }

  function parse_UnaryExpression()
  {
    eventHandler.startNonterminal("UnaryExpression", e0);
    switch (l1)
    {
    case 60:                        // 'delete'
      shift(60);                    // 'delete'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_UnaryExpression();
      break;
    case 79:                        // 'void'
      shift(79);                    // 'void'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_UnaryExpression();
      break;
    case 77:                        // 'typeof'
      shift(77);                    // 'typeof'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_UnaryExpression();
      break;
    case 25:                        // '++'
      shift(25);                    // '++'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_UnaryExpression();
      break;
    case 29:                        // '--'
      shift(29);                    // '--'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_UnaryExpression();
      break;
    case 24:                        // '+'
      shift(24);                    // '+'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_UnaryExpression();
      break;
    case 28:                        // '-'
      shift(28);                    // '-'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_UnaryExpression();
      break;
    case 87:                        // '~'
      shift(87);                    // '~'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_UnaryExpression();
      break;
    case 12:                        // '!'
      shift(12);                    // '!'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_UnaryExpression();
      break;
    default:
      parse_PostfixExpression();
    }
    eventHandler.endNonterminal("UnaryExpression", e0);
  }

  function try_UnaryExpression()
  {
    switch (l1)
    {
    case 60:                        // 'delete'
      shiftT(60);                   // 'delete'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_UnaryExpression();
      break;
    case 79:                        // 'void'
      shiftT(79);                   // 'void'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_UnaryExpression();
      break;
    case 77:                        // 'typeof'
      shiftT(77);                   // 'typeof'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_UnaryExpression();
      break;
    case 25:                        // '++'
      shiftT(25);                   // '++'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_UnaryExpression();
      break;
    case 29:                        // '--'
      shiftT(29);                   // '--'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_UnaryExpression();
      break;
    case 24:                        // '+'
      shiftT(24);                   // '+'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_UnaryExpression();
      break;
    case 28:                        // '-'
      shiftT(28);                   // '-'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_UnaryExpression();
      break;
    case 87:                        // '~'
      shiftT(87);                   // '~'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_UnaryExpression();
      break;
    case 12:                        // '!'
      shiftT(12);                   // '!'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_UnaryExpression();
      break;
    default:
      try_PostfixExpression();
    }
  }

  function parse_PostfixExpression()
  {
    eventHandler.startNonterminal("PostfixExpression", e0);
    parse_LeftHandSideExpression();
    if (l1 == 25                    // '++'
     || l1 == 29)                   // '--'
    {
      lk = memoized(4, e0);
      if (lk == 0)
      {
        var b0A = b0; var e0A = e0; var l1A = l1;
        var b1A = b1; var e1A = e1;
        try
        {
          switch (l1)
          {
          case 25:                  // '++'
            shiftT(25);             // '++'
            break;
          default:
            shiftT(29);             // '--'
          }
          lk = -1;
        }
        catch (p1A)
        {
          lk = -2;
        }
        b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
        b1 = b1A; e1 = e1A; end = e1A; }
        memoize(4, e0, lk);
      }
    }
    else
    {
      lk = l1;
    }
    if (lk == -1)
    {
      switch (l1)
      {
      case 25:                      // '++'
        shift(25);                  // '++'
        break;
      default:
        shift(29);                  // '--'
      }
    }
    eventHandler.endNonterminal("PostfixExpression", e0);
  }

  function try_PostfixExpression()
  {
    try_LeftHandSideExpression();
    if (l1 == 25                    // '++'
     || l1 == 29)                   // '--'
    {
      lk = memoized(4, e0);
      if (lk == 0)
      {
        var b0A = b0; var e0A = e0; var l1A = l1;
        var b1A = b1; var e1A = e1;
        try
        {
          switch (l1)
          {
          case 25:                  // '++'
            shiftT(25);             // '++'
            break;
          default:
            shiftT(29);             // '--'
          }
          memoize(4, e0A, -1);
        }
        catch (p1A)
        {
          b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
          b1 = b1A; e1 = e1A; end = e1A; }
          memoize(4, e0A, -2);
        }
        lk = -2;
      }
    }
    else
    {
      lk = l1;
    }
    if (lk == -1)
    {
      switch (l1)
      {
      case 25:                      // '++'
        shiftT(25);                 // '++'
        break;
      default:
        shiftT(29);                 // '--'
      }
    }
  }

  function parse_LeftHandSideExpression()
  {
    eventHandler.startNonterminal("LeftHandSideExpression", e0);
    lk = memoized(5, e0);
    if (lk == 0)
    {
      var b0A = b0; var e0A = e0; var l1A = l1;
      var b1A = b1; var e1A = e1;
      try
      {
        try_CallExpression();
        lk = -1;
      }
      catch (p1A)
      {
        lk = -2;
      }
      b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
      b1 = b1A; e1 = e1A; end = e1A; }
      memoize(5, e0, lk);
    }
    switch (lk)
    {
    case -1:
      parse_CallExpression();
      break;
    default:
      parse_NewExpression();
    }
    eventHandler.endNonterminal("LeftHandSideExpression", e0);
  }

  function try_LeftHandSideExpression()
  {
    lk = memoized(5, e0);
    if (lk == 0)
    {
      var b0A = b0; var e0A = e0; var l1A = l1;
      var b1A = b1; var e1A = e1;
      try
      {
        try_CallExpression();
        memoize(5, e0A, -1);
        lk = -3;
      }
      catch (p1A)
      {
        lk = -2;
        b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
        b1 = b1A; e1 = e1A; end = e1A; }
        memoize(5, e0A, -2);
      }
    }
    switch (lk)
    {
    case -1:
      try_CallExpression();
      break;
    case -3:
      break;
    default:
      try_NewExpression();
    }
  }

  function parse_NewExpression()
  {
    eventHandler.startNonterminal("NewExpression", e0);
    if (l1 == 70)                   // 'new'
    {
      lk = memoized(6, e0);
      if (lk == 0)
      {
        var b0A = b0; var e0A = e0; var l1A = l1;
        var b1A = b1; var e1A = e1;
        try
        {
          try_MemberExpression();
          lk = -1;
        }
        catch (p1A)
        {
          lk = -2;
        }
        b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
        b1 = b1A; e1 = e1A; end = e1A; }
        memoize(6, e0, lk);
      }
    }
    else
    {
      lk = l1;
    }
    switch (lk)
    {
    case -2:
      shift(70);                    // 'new'
      lookahead1W(19);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '(' | '[' | 'function' | 'new' | 'this' | '{'
      whitespace();
      parse_NewExpression();
      break;
    default:
      parse_MemberExpression();
    }
    eventHandler.endNonterminal("NewExpression", e0);
  }

  function try_NewExpression()
  {
    if (l1 == 70)                   // 'new'
    {
      lk = memoized(6, e0);
      if (lk == 0)
      {
        var b0A = b0; var e0A = e0; var l1A = l1;
        var b1A = b1; var e1A = e1;
        try
        {
          try_MemberExpression();
          memoize(6, e0A, -1);
          lk = -3;
        }
        catch (p1A)
        {
          lk = -2;
          b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
          b1 = b1A; e1 = e1A; end = e1A; }
          memoize(6, e0A, -2);
        }
      }
    }
    else
    {
      lk = l1;
    }
    switch (lk)
    {
    case -2:
      shiftT(70);                   // 'new'
      lookahead1W(19);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '(' | '[' | 'function' | 'new' | 'this' | '{'
      try_NewExpression();
      break;
    case -3:
      break;
    default:
      try_MemberExpression();
    }
  }

  function parse_MemberExpression()
  {
    eventHandler.startNonterminal("MemberExpression", e0);
    switch (l1)
    {
    case 65:                        // 'function'
      parse_FunctionExpression();
      break;
    case 70:                        // 'new'
      shift(70);                    // 'new'
      lookahead1W(19);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '(' | '[' | 'function' | 'new' | 'this' | '{'
      whitespace();
      parse_MemberExpression();
      whitespace();
      parse_Arguments();
      break;
    default:
      parse_PrimaryExpression();
    }
    for (;;)
    {
      lookahead1W(33);              // EOF | Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '!=' | '!==' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' | '*' |
                                    // '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '.' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '===' | '>' | '>=' | '>>' |
                                    // '>>=' | '>>>' | '>>>=' | '?' | '[' | ']' | '^' | '^=' | 'break' | 'case' |
                                    // 'continue' | 'debugger' | 'default' | 'delete' | 'do' | 'else' | 'for' |
                                    // 'function' | 'if' | 'in' | 'instanceof' | 'new' | 'return' | 'switch' | 'this' |
                                    // 'throw' | 'try' | 'typeof' | 'var' | 'void' | 'while' | 'with' | '{' | '|' |
                                    // '|=' | '||' | '}' | '~'
      if (l1 == 50)                 // '['
      {
        lk = memoized(7, e0);
        if (lk == 0)
        {
          var b0A = b0; var e0A = e0; var l1A = l1;
          var b1A = b1; var e1A = e1;
          try
          {
            switch (l1)
            {
            case 50:                // '['
              shiftT(50);           // '['
              lookahead1W(20);      // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
              try_Expression();
              shiftT(51);           // ']'
              break;
            default:
              shiftT(31);           // '.'
              lookahead1W(1);       // IdentifierName | WhiteSpace | Comment
              shiftT(5);            // IdentifierName
            }
            lk = -1;
          }
          catch (p1A)
          {
            lk = -2;
          }
          b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
          b1 = b1A; e1 = e1A; end = e1A; }
          memoize(7, e0, lk);
        }
      }
      else
      {
        lk = l1;
      }
      if (lk != -1
       && lk != 31)                 // '.'
      {
        break;
      }
      switch (l1)
      {
      case 50:                      // '['
        shift(50);                  // '['
        lookahead1W(20);            // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
        whitespace();
        parse_Expression();
        shift(51);                  // ']'
        break;
      default:
        shift(31);                  // '.'
        lookahead1W(1);             // IdentifierName | WhiteSpace | Comment
        shift(5);                   // IdentifierName
      }
    }
    eventHandler.endNonterminal("MemberExpression", e0);
  }

  function try_MemberExpression()
  {
    switch (l1)
    {
    case 65:                        // 'function'
      try_FunctionExpression();
      break;
    case 70:                        // 'new'
      shiftT(70);                   // 'new'
      lookahead1W(19);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '(' | '[' | 'function' | 'new' | 'this' | '{'
      try_MemberExpression();
      try_Arguments();
      break;
    default:
      try_PrimaryExpression();
    }
    for (;;)
    {
      lookahead1W(33);              // EOF | Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '!=' | '!==' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' | '*' |
                                    // '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '.' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '===' | '>' | '>=' | '>>' |
                                    // '>>=' | '>>>' | '>>>=' | '?' | '[' | ']' | '^' | '^=' | 'break' | 'case' |
                                    // 'continue' | 'debugger' | 'default' | 'delete' | 'do' | 'else' | 'for' |
                                    // 'function' | 'if' | 'in' | 'instanceof' | 'new' | 'return' | 'switch' | 'this' |
                                    // 'throw' | 'try' | 'typeof' | 'var' | 'void' | 'while' | 'with' | '{' | '|' |
                                    // '|=' | '||' | '}' | '~'
      if (l1 == 50)                 // '['
      {
        lk = memoized(7, e0);
        if (lk == 0)
        {
          var b0A = b0; var e0A = e0; var l1A = l1;
          var b1A = b1; var e1A = e1;
          try
          {
            switch (l1)
            {
            case 50:                // '['
              shiftT(50);           // '['
              lookahead1W(20);      // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
              try_Expression();
              shiftT(51);           // ']'
              break;
            default:
              shiftT(31);           // '.'
              lookahead1W(1);       // IdentifierName | WhiteSpace | Comment
              shiftT(5);            // IdentifierName
            }
            memoize(7, e0A, -1);
            continue;
          }
          catch (p1A)
          {
            b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
            b1 = b1A; e1 = e1A; end = e1A; }
            memoize(7, e0A, -2);
            break;
          }
        }
      }
      else
      {
        lk = l1;
      }
      if (lk != -1
       && lk != 31)                 // '.'
      {
        break;
      }
      switch (l1)
      {
      case 50:                      // '['
        shiftT(50);                 // '['
        lookahead1W(20);            // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
        try_Expression();
        shiftT(51);                 // ']'
        break;
      default:
        shiftT(31);                 // '.'
        lookahead1W(1);             // IdentifierName | WhiteSpace | Comment
        shiftT(5);                  // IdentifierName
      }
    }
  }

  function parse_PrimaryExpression()
  {
    eventHandler.startNonterminal("PrimaryExpression", e0);
    switch (l1)
    {
    case 74:                        // 'this'
      shift(74);                    // 'this'
      break;
    case 2:                         // Identifier
      shift(2);                     // Identifier
      break;
    case 50:                        // '['
      parse_ArrayLiteral();
      break;
    case 82:                        // '{'
      parse_ObjectLiteral();
      break;
    case 20:                        // '('
      shift(20);                    // '('
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_Expression();
      shift(21);                    // ')'
      break;
    default:
      parse_Literal();
    }
    eventHandler.endNonterminal("PrimaryExpression", e0);
  }

  function try_PrimaryExpression()
  {
    switch (l1)
    {
    case 74:                        // 'this'
      shiftT(74);                   // 'this'
      break;
    case 2:                         // Identifier
      shiftT(2);                    // Identifier
      break;
    case 50:                        // '['
      try_ArrayLiteral();
      break;
    case 82:                        // '{'
      try_ObjectLiteral();
      break;
    case 20:                        // '('
      shiftT(20);                   // '('
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_Expression();
      shiftT(21);                   // ')'
      break;
    default:
      try_Literal();
    }
  }

  function parse_Literal()
  {
    eventHandler.startNonterminal("Literal", e0);
    switch (l1)
    {
    case 3:                         // NullLiteral
      shift(3);                     // NullLiteral
      break;
    case 4:                         // BooleanLiteral
      shift(4);                     // BooleanLiteral
      break;
    case 6:                         // StringLiteral
      shift(6);                     // StringLiteral
      break;
    case 7:                         // RegularExpressionLiteral
      shift(7);                     // RegularExpressionLiteral
      break;
    default:
      parse_NumericLiteral();
    }
    eventHandler.endNonterminal("Literal", e0);
  }

  function try_Literal()
  {
    switch (l1)
    {
    case 3:                         // NullLiteral
      shiftT(3);                    // NullLiteral
      break;
    case 4:                         // BooleanLiteral
      shiftT(4);                    // BooleanLiteral
      break;
    case 6:                         // StringLiteral
      shiftT(6);                    // StringLiteral
      break;
    case 7:                         // RegularExpressionLiteral
      shiftT(7);                    // RegularExpressionLiteral
      break;
    default:
      try_NumericLiteral();
    }
  }

  function parse_NumericLiteral()
  {
    eventHandler.startNonterminal("NumericLiteral", e0);
    switch (l1)
    {
    case 8:                         // DecimalLiteral
      shift(8);                     // DecimalLiteral
      break;
    default:
      shift(9);                     // HexIntegerLiteral
    }
    eventHandler.endNonterminal("NumericLiteral", e0);
  }

  function try_NumericLiteral()
  {
    switch (l1)
    {
    case 8:                         // DecimalLiteral
      shiftT(8);                    // DecimalLiteral
      break;
    default:
      shiftT(9);                    // HexIntegerLiteral
    }
  }

  function parse_ArrayLiteral()
  {
    eventHandler.startNonterminal("ArrayLiteral", e0);
    shift(50);                      // '['
    lookahead1W(23);                // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | ',' | '-' | '--' | '[' | ']' | 'delete' |
                                    // 'function' | 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
    if (l1 != 27                    // ','
     && l1 != 51)                   // ']'
    {
      whitespace();
      parse_AssignmentExpression();
    }
    for (;;)
    {
      if (l1 != 27)                 // ','
      {
        break;
      }
      shift(27);                    // ','
      lookahead1W(23);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | ',' | '-' | '--' | '[' | ']' | 'delete' |
                                    // 'function' | 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      if (l1 != 27                  // ','
       && l1 != 51)                 // ']'
      {
        whitespace();
        parse_AssignmentExpression();
      }
    }
    shift(51);                      // ']'
    eventHandler.endNonterminal("ArrayLiteral", e0);
  }

  function try_ArrayLiteral()
  {
    shiftT(50);                     // '['
    lookahead1W(23);                // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | ',' | '-' | '--' | '[' | ']' | 'delete' |
                                    // 'function' | 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
    if (l1 != 27                    // ','
     && l1 != 51)                   // ']'
    {
      try_AssignmentExpression();
    }
    for (;;)
    {
      if (l1 != 27)                 // ','
      {
        break;
      }
      shiftT(27);                   // ','
      lookahead1W(23);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | ',' | '-' | '--' | '[' | ']' | 'delete' |
                                    // 'function' | 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      if (l1 != 27                  // ','
       && l1 != 51)                 // ']'
      {
        try_AssignmentExpression();
      }
    }
    shiftT(51);                     // ']'
  }

  function parse_ObjectLiteral()
  {
    eventHandler.startNonterminal("ObjectLiteral", e0);
    shift(82);                      // '{'
    lookahead1W(18);                // IdentifierName | StringLiteral | DecimalLiteral | HexIntegerLiteral |
                                    // WhiteSpace | Comment | 'get' | 'set' | '}'
    if (l1 != 86)                   // '}'
    {
      whitespace();
      parse_PropertyAssignment();
      for (;;)
      {
        lookahead1W(12);            // WhiteSpace | Comment | ',' | '}'
        if (l1 == 27)               // ','
        {
          lk = memoized(8, e0);
          if (lk == 0)
          {
            var b0A = b0; var e0A = e0; var l1A = l1;
            var b1A = b1; var e1A = e1;
            try
            {
              shiftT(27);           // ','
              lookahead1W(17);      // IdentifierName | StringLiteral | DecimalLiteral | HexIntegerLiteral |
                                    // WhiteSpace | Comment | 'get' | 'set'
              try_PropertyAssignment();
              lk = -1;
            }
            catch (p1A)
            {
              lk = -2;
            }
            b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
            b1 = b1A; e1 = e1A; end = e1A; }
            memoize(8, e0, lk);
          }
        }
        else
        {
          lk = l1;
        }
        if (lk != -1)
        {
          break;
        }
        shift(27);                  // ','
        lookahead1W(17);            // IdentifierName | StringLiteral | DecimalLiteral | HexIntegerLiteral |
                                    // WhiteSpace | Comment | 'get' | 'set'
        whitespace();
        parse_PropertyAssignment();
      }
      if (l1 == 27)                 // ','
      {
        shift(27);                  // ','
      }
    }
    lookahead1W(8);                 // WhiteSpace | Comment | '}'
    shift(86);                      // '}'
    eventHandler.endNonterminal("ObjectLiteral", e0);
  }

  function try_ObjectLiteral()
  {
    shiftT(82);                     // '{'
    lookahead1W(18);                // IdentifierName | StringLiteral | DecimalLiteral | HexIntegerLiteral |
                                    // WhiteSpace | Comment | 'get' | 'set' | '}'
    if (l1 != 86)                   // '}'
    {
      try_PropertyAssignment();
      for (;;)
      {
        lookahead1W(12);            // WhiteSpace | Comment | ',' | '}'
        if (l1 == 27)               // ','
        {
          lk = memoized(8, e0);
          if (lk == 0)
          {
            var b0A = b0; var e0A = e0; var l1A = l1;
            var b1A = b1; var e1A = e1;
            try
            {
              shiftT(27);           // ','
              lookahead1W(17);      // IdentifierName | StringLiteral | DecimalLiteral | HexIntegerLiteral |
                                    // WhiteSpace | Comment | 'get' | 'set'
              try_PropertyAssignment();
              memoize(8, e0A, -1);
              continue;
            }
            catch (p1A)
            {
              b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
              b1 = b1A; e1 = e1A; end = e1A; }
              memoize(8, e0A, -2);
              break;
            }
          }
        }
        else
        {
          lk = l1;
        }
        if (lk != -1)
        {
          break;
        }
        shiftT(27);                 // ','
        lookahead1W(17);            // IdentifierName | StringLiteral | DecimalLiteral | HexIntegerLiteral |
                                    // WhiteSpace | Comment | 'get' | 'set'
        try_PropertyAssignment();
      }
      if (l1 == 27)                 // ','
      {
        shiftT(27);                 // ','
      }
    }
    lookahead1W(8);                 // WhiteSpace | Comment | '}'
    shiftT(86);                     // '}'
  }

  function parse_PropertyAssignment()
  {
    eventHandler.startNonterminal("PropertyAssignment", e0);
    switch (l1)
    {
    case 66:                        // 'get'
      shift(66);                    // 'get'
      lookahead1W(15);              // IdentifierName | StringLiteral | DecimalLiteral | HexIntegerLiteral |
                                    // WhiteSpace | Comment
      whitespace();
      parse_PropertyName();
      lookahead1W(2);               // WhiteSpace | Comment | '('
      shift(20);                    // '('
      lookahead1W(3);               // WhiteSpace | Comment | ')'
      shift(21);                    // ')'
      lookahead1W(7);               // WhiteSpace | Comment | '{'
      shift(82);                    // '{'
      lookahead1W(26);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '}' | '~'
      whitespace();
      parse_FunctionBody();
      shift(86);                    // '}'
      break;
    case 72:                        // 'set'
      shift(72);                    // 'set'
      lookahead1W(15);              // IdentifierName | StringLiteral | DecimalLiteral | HexIntegerLiteral |
                                    // WhiteSpace | Comment
      whitespace();
      parse_PropertyName();
      lookahead1W(2);               // WhiteSpace | Comment | '('
      shift(20);                    // '('
      lookahead1W(0);               // Identifier | WhiteSpace | Comment
      whitespace();
      parse_PropertySetParameterList();
      lookahead1W(3);               // WhiteSpace | Comment | ')'
      shift(21);                    // ')'
      lookahead1W(7);               // WhiteSpace | Comment | '{'
      shift(82);                    // '{'
      lookahead1W(26);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '}' | '~'
      whitespace();
      parse_FunctionBody();
      shift(86);                    // '}'
      break;
    default:
      parse_PropertyName();
      lookahead1W(4);               // WhiteSpace | Comment | ':'
      shift(34);                    // ':'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_AssignmentExpression();
    }
    eventHandler.endNonterminal("PropertyAssignment", e0);
  }

  function try_PropertyAssignment()
  {
    switch (l1)
    {
    case 66:                        // 'get'
      shiftT(66);                   // 'get'
      lookahead1W(15);              // IdentifierName | StringLiteral | DecimalLiteral | HexIntegerLiteral |
                                    // WhiteSpace | Comment
      try_PropertyName();
      lookahead1W(2);               // WhiteSpace | Comment | '('
      shiftT(20);                   // '('
      lookahead1W(3);               // WhiteSpace | Comment | ')'
      shiftT(21);                   // ')'
      lookahead1W(7);               // WhiteSpace | Comment | '{'
      shiftT(82);                   // '{'
      lookahead1W(26);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '}' | '~'
      try_FunctionBody();
      shiftT(86);                   // '}'
      break;
    case 72:                        // 'set'
      shiftT(72);                   // 'set'
      lookahead1W(15);              // IdentifierName | StringLiteral | DecimalLiteral | HexIntegerLiteral |
                                    // WhiteSpace | Comment
      try_PropertyName();
      lookahead1W(2);               // WhiteSpace | Comment | '('
      shiftT(20);                   // '('
      lookahead1W(0);               // Identifier | WhiteSpace | Comment
      try_PropertySetParameterList();
      lookahead1W(3);               // WhiteSpace | Comment | ')'
      shiftT(21);                   // ')'
      lookahead1W(7);               // WhiteSpace | Comment | '{'
      shiftT(82);                   // '{'
      lookahead1W(26);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '}' | '~'
      try_FunctionBody();
      shiftT(86);                   // '}'
      break;
    default:
      try_PropertyName();
      lookahead1W(4);               // WhiteSpace | Comment | ':'
      shiftT(34);                   // ':'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_AssignmentExpression();
    }
  }

  function parse_PropertyName()
  {
    eventHandler.startNonterminal("PropertyName", e0);
    switch (l1)
    {
    case 5:                         // IdentifierName
      shift(5);                     // IdentifierName
      break;
    case 6:                         // StringLiteral
      shift(6);                     // StringLiteral
      break;
    default:
      parse_NumericLiteral();
    }
    eventHandler.endNonterminal("PropertyName", e0);
  }

  function try_PropertyName()
  {
    switch (l1)
    {
    case 5:                         // IdentifierName
      shiftT(5);                    // IdentifierName
      break;
    case 6:                         // StringLiteral
      shiftT(6);                    // StringLiteral
      break;
    default:
      try_NumericLiteral();
    }
  }

  function parse_FunctionBody()
  {
    eventHandler.startNonterminal("FunctionBody", e0);
    for (;;)
    {
      lookahead1W(26);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '}' | '~'
      if (l1 == 86)                 // '}'
      {
        break;
      }
      whitespace();
      parse_SourceElement();
    }
    eventHandler.endNonterminal("FunctionBody", e0);
  }

  function try_FunctionBody()
  {
    for (;;)
    {
      lookahead1W(26);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '}' | '~'
      if (l1 == 86)                 // '}'
      {
        break;
      }
      try_SourceElement();
    }
  }

  function parse_PropertySetParameterList()
  {
    eventHandler.startNonterminal("PropertySetParameterList", e0);
    shift(2);                       // Identifier
    eventHandler.endNonterminal("PropertySetParameterList", e0);
  }

  function try_PropertySetParameterList()
  {
    shiftT(2);                      // Identifier
  }

  function parse_Expression()
  {
    eventHandler.startNonterminal("Expression", e0);
    parse_AssignmentExpression();
    for (;;)
    {
      if (l1 != 27)                 // ','
      {
        break;
      }
      shift(27);                    // ','
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_AssignmentExpression();
    }
    eventHandler.endNonterminal("Expression", e0);
  }

  function try_Expression()
  {
    try_AssignmentExpression();
    for (;;)
    {
      if (l1 != 27)                 // ','
      {
        break;
      }
      shiftT(27);                   // ','
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_AssignmentExpression();
    }
  }

  function parse_FunctionExpression()
  {
    eventHandler.startNonterminal("FunctionExpression", e0);
    shift(65);                      // 'function'
    lookahead1W(9);                 // Identifier | WhiteSpace | Comment | '('
    if (l1 == 2)                    // Identifier
    {
      shift(2);                     // Identifier
    }
    lookahead1W(2);                 // WhiteSpace | Comment | '('
    shift(20);                      // '('
    lookahead1W(10);                // Identifier | WhiteSpace | Comment | ')'
    if (l1 == 2)                    // Identifier
    {
      whitespace();
      parse_FormalParameterList();
    }
    shift(21);                      // ')'
    lookahead1W(7);                 // WhiteSpace | Comment | '{'
    shift(82);                      // '{'
    lookahead1W(26);                // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '}' | '~'
    whitespace();
    parse_FunctionBody();
    shift(86);                      // '}'
    eventHandler.endNonterminal("FunctionExpression", e0);
  }

  function try_FunctionExpression()
  {
    shiftT(65);                     // 'function'
    lookahead1W(9);                 // Identifier | WhiteSpace | Comment | '('
    if (l1 == 2)                    // Identifier
    {
      shiftT(2);                    // Identifier
    }
    lookahead1W(2);                 // WhiteSpace | Comment | '('
    shiftT(20);                     // '('
    lookahead1W(10);                // Identifier | WhiteSpace | Comment | ')'
    if (l1 == 2)                    // Identifier
    {
      try_FormalParameterList();
    }
    shiftT(21);                     // ')'
    lookahead1W(7);                 // WhiteSpace | Comment | '{'
    shiftT(82);                     // '{'
    lookahead1W(26);                // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '}' | '~'
    try_FunctionBody();
    shiftT(86);                     // '}'
  }

  function parse_FormalParameterList()
  {
    eventHandler.startNonterminal("FormalParameterList", e0);
    shift(2);                       // Identifier
    for (;;)
    {
      lookahead1W(11);              // WhiteSpace | Comment | ')' | ','
      if (l1 != 27)                 // ','
      {
        break;
      }
      shift(27);                    // ','
      lookahead1W(0);               // Identifier | WhiteSpace | Comment
      shift(2);                     // Identifier
    }
    eventHandler.endNonterminal("FormalParameterList", e0);
  }

  function try_FormalParameterList()
  {
    shiftT(2);                      // Identifier
    for (;;)
    {
      lookahead1W(11);              // WhiteSpace | Comment | ')' | ','
      if (l1 != 27)                 // ','
      {
        break;
      }
      shiftT(27);                   // ','
      lookahead1W(0);               // Identifier | WhiteSpace | Comment
      shiftT(2);                    // Identifier
    }
  }

  function parse_Arguments()
  {
    eventHandler.startNonterminal("Arguments", e0);
    shift(20);                      // '('
    lookahead1W(21);                // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | ')' | '+' | '++' | '-' | '--' | '[' | 'delete' |
                                    // 'function' | 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
    if (l1 != 21)                   // ')'
    {
      whitespace();
      parse_AssignmentExpression();
      for (;;)
      {
        if (l1 != 27)               // ','
        {
          break;
        }
        shift(27);                  // ','
        lookahead1W(20);            // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
        whitespace();
        parse_AssignmentExpression();
      }
    }
    shift(21);                      // ')'
    eventHandler.endNonterminal("Arguments", e0);
  }

  function try_Arguments()
  {
    shiftT(20);                     // '('
    lookahead1W(21);                // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | ')' | '+' | '++' | '-' | '--' | '[' | 'delete' |
                                    // 'function' | 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
    if (l1 != 21)                   // ')'
    {
      try_AssignmentExpression();
      for (;;)
      {
        if (l1 != 27)               // ','
        {
          break;
        }
        shiftT(27);                 // ','
        lookahead1W(20);            // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
        try_AssignmentExpression();
      }
    }
    shiftT(21);                     // ')'
  }

  function parse_CallExpression()
  {
    eventHandler.startNonterminal("CallExpression", e0);
    parse_MemberExpression();
    whitespace();
    parse_Arguments();
    for (;;)
    {
      lookahead1W(33);              // EOF | Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '!=' | '!==' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' | '*' |
                                    // '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '.' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '===' | '>' | '>=' | '>>' |
                                    // '>>=' | '>>>' | '>>>=' | '?' | '[' | ']' | '^' | '^=' | 'break' | 'case' |
                                    // 'continue' | 'debugger' | 'default' | 'delete' | 'do' | 'else' | 'for' |
                                    // 'function' | 'if' | 'in' | 'instanceof' | 'new' | 'return' | 'switch' | 'this' |
                                    // 'throw' | 'try' | 'typeof' | 'var' | 'void' | 'while' | 'with' | '{' | '|' |
                                    // '|=' | '||' | '}' | '~'
      if (l1 == 20                  // '('
       || l1 == 50)                 // '['
      {
        lk = memoized(9, e0);
        if (lk == 0)
        {
          var b0A = b0; var e0A = e0; var l1A = l1;
          var b1A = b1; var e1A = e1;
          try
          {
            switch (l1)
            {
            case 20:                // '('
              try_Arguments();
              break;
            case 50:                // '['
              shiftT(50);           // '['
              lookahead1W(20);      // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
              try_Expression();
              shiftT(51);           // ']'
              break;
            default:
              shiftT(31);           // '.'
              lookahead1W(1);       // IdentifierName | WhiteSpace | Comment
              shiftT(5);            // IdentifierName
            }
            lk = -1;
          }
          catch (p1A)
          {
            lk = -2;
          }
          b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
          b1 = b1A; e1 = e1A; end = e1A; }
          memoize(9, e0, lk);
        }
      }
      else
      {
        lk = l1;
      }
      if (lk != -1
       && lk != 31)                 // '.'
      {
        break;
      }
      switch (l1)
      {
      case 20:                      // '('
        whitespace();
        parse_Arguments();
        break;
      case 50:                      // '['
        shift(50);                  // '['
        lookahead1W(20);            // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
        whitespace();
        parse_Expression();
        shift(51);                  // ']'
        break;
      default:
        shift(31);                  // '.'
        lookahead1W(1);             // IdentifierName | WhiteSpace | Comment
        shift(5);                   // IdentifierName
      }
    }
    eventHandler.endNonterminal("CallExpression", e0);
  }

  function try_CallExpression()
  {
    try_MemberExpression();
    try_Arguments();
    for (;;)
    {
      lookahead1W(33);              // EOF | Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '!=' | '!==' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' | '*' |
                                    // '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '.' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '===' | '>' | '>=' | '>>' |
                                    // '>>=' | '>>>' | '>>>=' | '?' | '[' | ']' | '^' | '^=' | 'break' | 'case' |
                                    // 'continue' | 'debugger' | 'default' | 'delete' | 'do' | 'else' | 'for' |
                                    // 'function' | 'if' | 'in' | 'instanceof' | 'new' | 'return' | 'switch' | 'this' |
                                    // 'throw' | 'try' | 'typeof' | 'var' | 'void' | 'while' | 'with' | '{' | '|' |
                                    // '|=' | '||' | '}' | '~'
      if (l1 == 20                  // '('
       || l1 == 50)                 // '['
      {
        lk = memoized(9, e0);
        if (lk == 0)
        {
          var b0A = b0; var e0A = e0; var l1A = l1;
          var b1A = b1; var e1A = e1;
          try
          {
            switch (l1)
            {
            case 20:                // '('
              try_Arguments();
              break;
            case 50:                // '['
              shiftT(50);           // '['
              lookahead1W(20);      // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
              try_Expression();
              shiftT(51);           // ']'
              break;
            default:
              shiftT(31);           // '.'
              lookahead1W(1);       // IdentifierName | WhiteSpace | Comment
              shiftT(5);            // IdentifierName
            }
            memoize(9, e0A, -1);
            continue;
          }
          catch (p1A)
          {
            b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
            b1 = b1A; e1 = e1A; end = e1A; }
            memoize(9, e0A, -2);
            break;
          }
        }
      }
      else
      {
        lk = l1;
      }
      if (lk != -1
       && lk != 31)                 // '.'
      {
        break;
      }
      switch (l1)
      {
      case 20:                      // '('
        try_Arguments();
        break;
      case 50:                      // '['
        shiftT(50);                 // '['
        lookahead1W(20);            // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
        try_Expression();
        shiftT(51);                 // ']'
        break;
      default:
        shiftT(31);                 // '.'
        lookahead1W(1);             // IdentifierName | WhiteSpace | Comment
        shiftT(5);                  // IdentifierName
      }
    }
  }

  function parse_EmptyStatement()
  {
    eventHandler.startNonterminal("EmptyStatement", e0);
    shift(35);                      // ';'
    eventHandler.endNonterminal("EmptyStatement", e0);
  }

  function try_EmptyStatement()
  {
    shiftT(35);                     // ';'
  }

  function parse_AssignmentOperator()
  {
    eventHandler.startNonterminal("AssignmentOperator", e0);
    switch (l1)
    {
    case 40:                        // '='
      shift(40);                    // '='
      break;
    case 23:                        // '*='
      shift(23);                    // '*='
      break;
    case 33:                        // '/='
      shift(33);                    // '/='
      break;
    case 16:                        // '%='
      shift(16);                    // '%='
      break;
    case 26:                        // '+='
      shift(26);                    // '+='
      break;
    case 30:                        // '-='
      shift(30);                    // '-='
      break;
    case 38:                        // '<<='
      shift(38);                    // '<<='
      break;
    case 46:                        // '>>='
      shift(46);                    // '>>='
      break;
    case 48:                        // '>>>='
      shift(48);                    // '>>>='
      break;
    case 19:                        // '&='
      shift(19);                    // '&='
      break;
    case 53:                        // '^='
      shift(53);                    // '^='
      break;
    default:
      shift(84);                    // '|='
    }
    eventHandler.endNonterminal("AssignmentOperator", e0);
  }

  function try_AssignmentOperator()
  {
    switch (l1)
    {
    case 40:                        // '='
      shiftT(40);                   // '='
      break;
    case 23:                        // '*='
      shiftT(23);                   // '*='
      break;
    case 33:                        // '/='
      shiftT(33);                   // '/='
      break;
    case 16:                        // '%='
      shiftT(16);                   // '%='
      break;
    case 26:                        // '+='
      shiftT(26);                   // '+='
      break;
    case 30:                        // '-='
      shiftT(30);                   // '-='
      break;
    case 38:                        // '<<='
      shiftT(38);                   // '<<='
      break;
    case 46:                        // '>>='
      shiftT(46);                   // '>>='
      break;
    case 48:                        // '>>>='
      shiftT(48);                   // '>>>='
      break;
    case 19:                        // '&='
      shiftT(19);                   // '&='
      break;
    case 53:                        // '^='
      shiftT(53);                   // '^='
      break;
    default:
      shiftT(84);                   // '|='
    }
  }

  function parse_ExpressionStatement()
  {
    eventHandler.startNonterminal("ExpressionStatement", e0);
    parse_Expression();
    whitespace();
    parse_Semicolon();
    eventHandler.endNonterminal("ExpressionStatement", e0);
  }

  function try_ExpressionStatement()
  {
    try_Expression();
    try_Semicolon();
  }

  function parse_IfStatement()
  {
    eventHandler.startNonterminal("IfStatement", e0);
    shift(67);                      // 'if'
    lookahead1W(2);                 // WhiteSpace | Comment | '('
    shift(20);                      // '('
    lookahead1W(20);                // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
    whitespace();
    parse_Expression();
    shift(21);                      // ')'
    lookahead1W(24);                // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '~'
    whitespace();
    parse_Statement();
    lookahead1W(29);                // EOF | Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' | 'case' |
                                    // 'continue' | 'debugger' | 'default' | 'delete' | 'do' | 'else' | 'for' |
                                    // 'function' | 'if' | 'new' | 'return' | 'switch' | 'this' | 'throw' | 'try' |
                                    // 'typeof' | 'var' | 'void' | 'while' | 'with' | '{' | '}' | '~'
    if (l1 == 62)                   // 'else'
    {
      lk = memoized(10, e0);
      if (lk == 0)
      {
        var b0A = b0; var e0A = e0; var l1A = l1;
        var b1A = b1; var e1A = e1;
        try
        {
          shiftT(62);               // 'else'
          lookahead1W(24);          // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '~'
          try_Statement();
          lk = -1;
        }
        catch (p1A)
        {
          lk = -2;
        }
        b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
        b1 = b1A; e1 = e1A; end = e1A; }
        memoize(10, e0, lk);
      }
    }
    else
    {
      lk = l1;
    }
    if (lk == -1)
    {
      shift(62);                    // 'else'
      lookahead1W(24);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '~'
      whitespace();
      parse_Statement();
    }
    eventHandler.endNonterminal("IfStatement", e0);
  }

  function try_IfStatement()
  {
    shiftT(67);                     // 'if'
    lookahead1W(2);                 // WhiteSpace | Comment | '('
    shiftT(20);                     // '('
    lookahead1W(20);                // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
    try_Expression();
    shiftT(21);                     // ')'
    lookahead1W(24);                // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '~'
    try_Statement();
    lookahead1W(29);                // EOF | Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' | 'case' |
                                    // 'continue' | 'debugger' | 'default' | 'delete' | 'do' | 'else' | 'for' |
                                    // 'function' | 'if' | 'new' | 'return' | 'switch' | 'this' | 'throw' | 'try' |
                                    // 'typeof' | 'var' | 'void' | 'while' | 'with' | '{' | '}' | '~'
    if (l1 == 62)                   // 'else'
    {
      lk = memoized(10, e0);
      if (lk == 0)
      {
        var b0A = b0; var e0A = e0; var l1A = l1;
        var b1A = b1; var e1A = e1;
        try
        {
          shiftT(62);               // 'else'
          lookahead1W(24);          // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '~'
          try_Statement();
          memoize(10, e0A, -1);
        }
        catch (p1A)
        {
          b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
          b1 = b1A; e1 = e1A; end = e1A; }
          memoize(10, e0A, -2);
        }
        lk = -2;
      }
    }
    else
    {
      lk = l1;
    }
    if (lk == -1)
    {
      shiftT(62);                   // 'else'
      lookahead1W(24);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '~'
      try_Statement();
    }
  }

  function parse_IterationStatement()
  {
    eventHandler.startNonterminal("IterationStatement", e0);
    if (l1 == 64)                   // 'for'
    {
      lk = memoized(11, e0);
      if (lk == 0)
      {
        var b0A = b0; var e0A = e0; var l1A = l1;
        var b1A = b1; var e1A = e1;
        try
        {
          shiftT(64);               // 'for'
          lookahead1W(2);           // WhiteSpace | Comment | '('
          shiftT(20);               // '('
          lookahead1W(22);          // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'delete' |
                                    // 'function' | 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
          if (l1 != 35)             // ';'
          {
            try_ExpressionNoIn();
          }
          shiftT(35);               // ';'
          lookahead1W(22);          // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'delete' |
                                    // 'function' | 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
          if (l1 != 35)             // ';'
          {
            try_Expression();
          }
          shiftT(35);               // ';'
          lookahead1W(21);          // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | ')' | '+' | '++' | '-' | '--' | '[' | 'delete' |
                                    // 'function' | 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
          if (l1 != 21)             // ')'
          {
            try_Expression();
          }
          shiftT(21);               // ')'
          lookahead1W(24);          // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '~'
          try_Statement();
          lk = -3;
        }
        catch (p3A)
        {
          try
          {
            b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
            b1 = b1A; e1 = e1A; end = e1A; }
            shiftT(64);             // 'for'
            lookahead1W(2);         // WhiteSpace | Comment | '('
            shiftT(20);             // '('
            lookahead1W(5);         // WhiteSpace | Comment | 'var'
            shiftT(78);             // 'var'
            lookahead1W(0);         // Identifier | WhiteSpace | Comment
            try_VariableDeclarationListNoIn();
            shiftT(35);             // ';'
            lookahead1W(22);        // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'delete' |
                                    // 'function' | 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
            if (l1 != 35)           // ';'
            {
              try_Expression();
            }
            shiftT(35);             // ';'
            lookahead1W(21);        // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | ')' | '+' | '++' | '-' | '--' | '[' | 'delete' |
                                    // 'function' | 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
            if (l1 != 21)           // ')'
            {
              try_Expression();
            }
            shiftT(21);             // ')'
            lookahead1W(24);        // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '~'
            try_Statement();
            lk = -4;
          }
          catch (p4A)
          {
            try
            {
              b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
              b1 = b1A; e1 = e1A; end = e1A; }
              shiftT(64);           // 'for'
              lookahead1W(2);       // WhiteSpace | Comment | '('
              shiftT(20);           // '('
              lookahead1W(19);      // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '(' | '[' | 'function' | 'new' | 'this' | '{'
              try_LeftHandSideExpression();
              shiftT(68);           // 'in'
              lookahead1W(20);      // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
              try_Expression();
              shiftT(21);           // ')'
              lookahead1W(24);      // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '~'
              try_Statement();
              lk = -5;
            }
            catch (p5A)
            {
              lk = -6;
            }
          }
        }
        b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
        b1 = b1A; e1 = e1A; end = e1A; }
        memoize(11, e0, lk);
      }
    }
    else
    {
      lk = l1;
    }
    switch (lk)
    {
    case 61:                        // 'do'
      shift(61);                    // 'do'
      lookahead1W(24);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '~'
      whitespace();
      parse_Statement();
      lookahead1W(6);               // WhiteSpace | Comment | 'while'
      shift(80);                    // 'while'
      lookahead1W(2);               // WhiteSpace | Comment | '('
      shift(20);                    // '('
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_Expression();
      shift(21);                    // ')'
      lookahead1W(29);              // EOF | Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' | 'case' |
                                    // 'continue' | 'debugger' | 'default' | 'delete' | 'do' | 'else' | 'for' |
                                    // 'function' | 'if' | 'new' | 'return' | 'switch' | 'this' | 'throw' | 'try' |
                                    // 'typeof' | 'var' | 'void' | 'while' | 'with' | '{' | '}' | '~'
      whitespace();
      parse_Semicolon();
      break;
    case -3:
      shift(64);                    // 'for'
      lookahead1W(2);               // WhiteSpace | Comment | '('
      shift(20);                    // '('
      lookahead1W(22);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'delete' |
                                    // 'function' | 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      if (l1 != 35)                 // ';'
      {
        whitespace();
        parse_ExpressionNoIn();
      }
      shift(35);                    // ';'
      lookahead1W(22);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'delete' |
                                    // 'function' | 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      if (l1 != 35)                 // ';'
      {
        whitespace();
        parse_Expression();
      }
      shift(35);                    // ';'
      lookahead1W(21);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | ')' | '+' | '++' | '-' | '--' | '[' | 'delete' |
                                    // 'function' | 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      if (l1 != 21)                 // ')'
      {
        whitespace();
        parse_Expression();
      }
      shift(21);                    // ')'
      lookahead1W(24);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '~'
      whitespace();
      parse_Statement();
      break;
    case -4:
      shift(64);                    // 'for'
      lookahead1W(2);               // WhiteSpace | Comment | '('
      shift(20);                    // '('
      lookahead1W(5);               // WhiteSpace | Comment | 'var'
      shift(78);                    // 'var'
      lookahead1W(0);               // Identifier | WhiteSpace | Comment
      whitespace();
      parse_VariableDeclarationListNoIn();
      shift(35);                    // ';'
      lookahead1W(22);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'delete' |
                                    // 'function' | 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      if (l1 != 35)                 // ';'
      {
        whitespace();
        parse_Expression();
      }
      shift(35);                    // ';'
      lookahead1W(21);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | ')' | '+' | '++' | '-' | '--' | '[' | 'delete' |
                                    // 'function' | 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      if (l1 != 21)                 // ')'
      {
        whitespace();
        parse_Expression();
      }
      shift(21);                    // ')'
      lookahead1W(24);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '~'
      whitespace();
      parse_Statement();
      break;
    case -5:
      shift(64);                    // 'for'
      lookahead1W(2);               // WhiteSpace | Comment | '('
      shift(20);                    // '('
      lookahead1W(19);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '(' | '[' | 'function' | 'new' | 'this' | '{'
      whitespace();
      parse_LeftHandSideExpression();
      shift(68);                    // 'in'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_Expression();
      shift(21);                    // ')'
      lookahead1W(24);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '~'
      whitespace();
      parse_Statement();
      break;
    case -6:
      shift(64);                    // 'for'
      lookahead1W(2);               // WhiteSpace | Comment | '('
      shift(20);                    // '('
      lookahead1W(5);               // WhiteSpace | Comment | 'var'
      shift(78);                    // 'var'
      lookahead1W(0);               // Identifier | WhiteSpace | Comment
      whitespace();
      parse_VariableDeclarationNoIn();
      shift(68);                    // 'in'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_Expression();
      shift(21);                    // ')'
      lookahead1W(24);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '~'
      whitespace();
      parse_Statement();
      break;
    default:
      shift(80);                    // 'while'
      lookahead1W(2);               // WhiteSpace | Comment | '('
      shift(20);                    // '('
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_Expression();
      shift(21);                    // ')'
      lookahead1W(24);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '~'
      whitespace();
      parse_Statement();
    }
    eventHandler.endNonterminal("IterationStatement", e0);
  }

  function try_IterationStatement()
  {
    if (l1 == 64)                   // 'for'
    {
      lk = memoized(11, e0);
      if (lk == 0)
      {
        var b0A = b0; var e0A = e0; var l1A = l1;
        var b1A = b1; var e1A = e1;
        try
        {
          shiftT(64);               // 'for'
          lookahead1W(2);           // WhiteSpace | Comment | '('
          shiftT(20);               // '('
          lookahead1W(22);          // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'delete' |
                                    // 'function' | 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
          if (l1 != 35)             // ';'
          {
            try_ExpressionNoIn();
          }
          shiftT(35);               // ';'
          lookahead1W(22);          // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'delete' |
                                    // 'function' | 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
          if (l1 != 35)             // ';'
          {
            try_Expression();
          }
          shiftT(35);               // ';'
          lookahead1W(21);          // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | ')' | '+' | '++' | '-' | '--' | '[' | 'delete' |
                                    // 'function' | 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
          if (l1 != 21)             // ')'
          {
            try_Expression();
          }
          shiftT(21);               // ')'
          lookahead1W(24);          // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '~'
          try_Statement();
          memoize(11, e0A, -3);
          lk = -7;
        }
        catch (p3A)
        {
          try
          {
            b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
            b1 = b1A; e1 = e1A; end = e1A; }
            shiftT(64);             // 'for'
            lookahead1W(2);         // WhiteSpace | Comment | '('
            shiftT(20);             // '('
            lookahead1W(5);         // WhiteSpace | Comment | 'var'
            shiftT(78);             // 'var'
            lookahead1W(0);         // Identifier | WhiteSpace | Comment
            try_VariableDeclarationListNoIn();
            shiftT(35);             // ';'
            lookahead1W(22);        // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'delete' |
                                    // 'function' | 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
            if (l1 != 35)           // ';'
            {
              try_Expression();
            }
            shiftT(35);             // ';'
            lookahead1W(21);        // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | ')' | '+' | '++' | '-' | '--' | '[' | 'delete' |
                                    // 'function' | 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
            if (l1 != 21)           // ')'
            {
              try_Expression();
            }
            shiftT(21);             // ')'
            lookahead1W(24);        // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '~'
            try_Statement();
            memoize(11, e0A, -4);
            lk = -7;
          }
          catch (p4A)
          {
            try
            {
              b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
              b1 = b1A; e1 = e1A; end = e1A; }
              shiftT(64);           // 'for'
              lookahead1W(2);       // WhiteSpace | Comment | '('
              shiftT(20);           // '('
              lookahead1W(19);      // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '(' | '[' | 'function' | 'new' | 'this' | '{'
              try_LeftHandSideExpression();
              shiftT(68);           // 'in'
              lookahead1W(20);      // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
              try_Expression();
              shiftT(21);           // ')'
              lookahead1W(24);      // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '~'
              try_Statement();
              memoize(11, e0A, -5);
              lk = -7;
            }
            catch (p5A)
            {
              lk = -6;
              b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
              b1 = b1A; e1 = e1A; end = e1A; }
              memoize(11, e0A, -6);
            }
          }
        }
      }
    }
    else
    {
      lk = l1;
    }
    switch (lk)
    {
    case 61:                        // 'do'
      shiftT(61);                   // 'do'
      lookahead1W(24);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '~'
      try_Statement();
      lookahead1W(6);               // WhiteSpace | Comment | 'while'
      shiftT(80);                   // 'while'
      lookahead1W(2);               // WhiteSpace | Comment | '('
      shiftT(20);                   // '('
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_Expression();
      shiftT(21);                   // ')'
      lookahead1W(29);              // EOF | Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' | 'case' |
                                    // 'continue' | 'debugger' | 'default' | 'delete' | 'do' | 'else' | 'for' |
                                    // 'function' | 'if' | 'new' | 'return' | 'switch' | 'this' | 'throw' | 'try' |
                                    // 'typeof' | 'var' | 'void' | 'while' | 'with' | '{' | '}' | '~'
      try_Semicolon();
      break;
    case -3:
      shiftT(64);                   // 'for'
      lookahead1W(2);               // WhiteSpace | Comment | '('
      shiftT(20);                   // '('
      lookahead1W(22);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'delete' |
                                    // 'function' | 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      if (l1 != 35)                 // ';'
      {
        try_ExpressionNoIn();
      }
      shiftT(35);                   // ';'
      lookahead1W(22);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'delete' |
                                    // 'function' | 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      if (l1 != 35)                 // ';'
      {
        try_Expression();
      }
      shiftT(35);                   // ';'
      lookahead1W(21);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | ')' | '+' | '++' | '-' | '--' | '[' | 'delete' |
                                    // 'function' | 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      if (l1 != 21)                 // ')'
      {
        try_Expression();
      }
      shiftT(21);                   // ')'
      lookahead1W(24);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '~'
      try_Statement();
      break;
    case -4:
      shiftT(64);                   // 'for'
      lookahead1W(2);               // WhiteSpace | Comment | '('
      shiftT(20);                   // '('
      lookahead1W(5);               // WhiteSpace | Comment | 'var'
      shiftT(78);                   // 'var'
      lookahead1W(0);               // Identifier | WhiteSpace | Comment
      try_VariableDeclarationListNoIn();
      shiftT(35);                   // ';'
      lookahead1W(22);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'delete' |
                                    // 'function' | 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      if (l1 != 35)                 // ';'
      {
        try_Expression();
      }
      shiftT(35);                   // ';'
      lookahead1W(21);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | ')' | '+' | '++' | '-' | '--' | '[' | 'delete' |
                                    // 'function' | 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      if (l1 != 21)                 // ')'
      {
        try_Expression();
      }
      shiftT(21);                   // ')'
      lookahead1W(24);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '~'
      try_Statement();
      break;
    case -5:
      shiftT(64);                   // 'for'
      lookahead1W(2);               // WhiteSpace | Comment | '('
      shiftT(20);                   // '('
      lookahead1W(19);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '(' | '[' | 'function' | 'new' | 'this' | '{'
      try_LeftHandSideExpression();
      shiftT(68);                   // 'in'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_Expression();
      shiftT(21);                   // ')'
      lookahead1W(24);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '~'
      try_Statement();
      break;
    case -6:
      shiftT(64);                   // 'for'
      lookahead1W(2);               // WhiteSpace | Comment | '('
      shiftT(20);                   // '('
      lookahead1W(5);               // WhiteSpace | Comment | 'var'
      shiftT(78);                   // 'var'
      lookahead1W(0);               // Identifier | WhiteSpace | Comment
      try_VariableDeclarationNoIn();
      shiftT(68);                   // 'in'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_Expression();
      shiftT(21);                   // ')'
      lookahead1W(24);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '~'
      try_Statement();
      break;
    case -7:
      break;
    default:
      shiftT(80);                   // 'while'
      lookahead1W(2);               // WhiteSpace | Comment | '('
      shiftT(20);                   // '('
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_Expression();
      shiftT(21);                   // ')'
      lookahead1W(24);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '~'
      try_Statement();
    }
  }

  function parse_ExpressionNoIn()
  {
    eventHandler.startNonterminal("ExpressionNoIn", e0);
    parse_AssignmentExpressionNoIn();
    for (;;)
    {
      if (l1 != 27)                 // ','
      {
        break;
      }
      shift(27);                    // ','
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_AssignmentExpressionNoIn();
    }
    eventHandler.endNonterminal("ExpressionNoIn", e0);
  }

  function try_ExpressionNoIn()
  {
    try_AssignmentExpressionNoIn();
    for (;;)
    {
      if (l1 != 27)                 // ','
      {
        break;
      }
      shiftT(27);                   // ','
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_AssignmentExpressionNoIn();
    }
  }

  function parse_AssignmentExpressionNoIn()
  {
    eventHandler.startNonterminal("AssignmentExpressionNoIn", e0);
    if (l1 != 12                    // '!'
     && l1 != 24                    // '+'
     && l1 != 25                    // '++'
     && l1 != 28                    // '-'
     && l1 != 29                    // '--'
     && l1 != 60                    // 'delete'
     && l1 != 77                    // 'typeof'
     && l1 != 79                    // 'void'
     && l1 != 87)                   // '~'
    {
      lk = memoized(12, e0);
      if (lk == 0)
      {
        var b0A = b0; var e0A = e0; var l1A = l1;
        var b1A = b1; var e1A = e1;
        try
        {
          try_LeftHandSideExpression();
          try_AssignmentOperator();
          lookahead1W(20);          // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
          try_AssignmentExpressionNoIn();
          lk = -1;
        }
        catch (p1A)
        {
          lk = -2;
        }
        b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
        b1 = b1A; e1 = e1A; end = e1A; }
        memoize(12, e0, lk);
      }
    }
    else
    {
      lk = l1;
    }
    switch (lk)
    {
    case -1:
      parse_LeftHandSideExpression();
      whitespace();
      parse_AssignmentOperator();
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_AssignmentExpressionNoIn();
      break;
    default:
      parse_ConditionalExpressionNoIn();
    }
    eventHandler.endNonterminal("AssignmentExpressionNoIn", e0);
  }

  function try_AssignmentExpressionNoIn()
  {
    if (l1 != 12                    // '!'
     && l1 != 24                    // '+'
     && l1 != 25                    // '++'
     && l1 != 28                    // '-'
     && l1 != 29                    // '--'
     && l1 != 60                    // 'delete'
     && l1 != 77                    // 'typeof'
     && l1 != 79                    // 'void'
     && l1 != 87)                   // '~'
    {
      lk = memoized(12, e0);
      if (lk == 0)
      {
        var b0A = b0; var e0A = e0; var l1A = l1;
        var b1A = b1; var e1A = e1;
        try
        {
          try_LeftHandSideExpression();
          try_AssignmentOperator();
          lookahead1W(20);          // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
          try_AssignmentExpressionNoIn();
          memoize(12, e0A, -1);
          lk = -3;
        }
        catch (p1A)
        {
          lk = -2;
          b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
          b1 = b1A; e1 = e1A; end = e1A; }
          memoize(12, e0A, -2);
        }
      }
    }
    else
    {
      lk = l1;
    }
    switch (lk)
    {
    case -1:
      try_LeftHandSideExpression();
      try_AssignmentOperator();
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_AssignmentExpressionNoIn();
      break;
    case -3:
      break;
    default:
      try_ConditionalExpressionNoIn();
    }
  }

  function parse_ConditionalExpressionNoIn()
  {
    eventHandler.startNonterminal("ConditionalExpressionNoIn", e0);
    parse_LogicalORExpressionNoIn();
    for (;;)
    {
      if (l1 == 49)                 // '?'
      {
        lk = memoized(13, e0);
        if (lk == 0)
        {
          var b0A = b0; var e0A = e0; var l1A = l1;
          var b1A = b1; var e1A = e1;
          try
          {
            shiftT(49);             // '?'
            lookahead1W(20);        // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
            try_AssignmentExpression();
            shiftT(34);             // ':'
            lookahead1W(20);        // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
            try_AssignmentExpressionNoIn();
            lk = -1;
          }
          catch (p1A)
          {
            lk = -2;
          }
          b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
          b1 = b1A; e1 = e1A; end = e1A; }
          memoize(13, e0, lk);
        }
      }
      else
      {
        lk = l1;
      }
      if (lk != -1)
      {
        break;
      }
      shift(49);                    // '?'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_AssignmentExpression();
      shift(34);                    // ':'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_AssignmentExpressionNoIn();
    }
    eventHandler.endNonterminal("ConditionalExpressionNoIn", e0);
  }

  function try_ConditionalExpressionNoIn()
  {
    try_LogicalORExpressionNoIn();
    for (;;)
    {
      if (l1 == 49)                 // '?'
      {
        lk = memoized(13, e0);
        if (lk == 0)
        {
          var b0A = b0; var e0A = e0; var l1A = l1;
          var b1A = b1; var e1A = e1;
          try
          {
            shiftT(49);             // '?'
            lookahead1W(20);        // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
            try_AssignmentExpression();
            shiftT(34);             // ':'
            lookahead1W(20);        // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
            try_AssignmentExpressionNoIn();
            memoize(13, e0A, -1);
            continue;
          }
          catch (p1A)
          {
            b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
            b1 = b1A; e1 = e1A; end = e1A; }
            memoize(13, e0A, -2);
            break;
          }
        }
      }
      else
      {
        lk = l1;
      }
      if (lk != -1)
      {
        break;
      }
      shiftT(49);                   // '?'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_AssignmentExpression();
      shiftT(34);                   // ':'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_AssignmentExpressionNoIn();
    }
  }

  function parse_LogicalORExpressionNoIn()
  {
    eventHandler.startNonterminal("LogicalORExpressionNoIn", e0);
    parse_LogicalANDExpressionNoIn();
    for (;;)
    {
      if (l1 != 85)                 // '||'
      {
        break;
      }
      shift(85);                    // '||'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_LogicalANDExpressionNoIn();
    }
    eventHandler.endNonterminal("LogicalORExpressionNoIn", e0);
  }

  function try_LogicalORExpressionNoIn()
  {
    try_LogicalANDExpressionNoIn();
    for (;;)
    {
      if (l1 != 85)                 // '||'
      {
        break;
      }
      shiftT(85);                   // '||'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_LogicalANDExpressionNoIn();
    }
  }

  function parse_LogicalANDExpressionNoIn()
  {
    eventHandler.startNonterminal("LogicalANDExpressionNoIn", e0);
    parse_BitwiseORExpressionNoIn();
    for (;;)
    {
      if (l1 != 18)                 // '&&'
      {
        break;
      }
      shift(18);                    // '&&'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_BitwiseORExpressionNoIn();
    }
    eventHandler.endNonterminal("LogicalANDExpressionNoIn", e0);
  }

  function try_LogicalANDExpressionNoIn()
  {
    try_BitwiseORExpressionNoIn();
    for (;;)
    {
      if (l1 != 18)                 // '&&'
      {
        break;
      }
      shiftT(18);                   // '&&'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_BitwiseORExpressionNoIn();
    }
  }

  function parse_BitwiseORExpressionNoIn()
  {
    eventHandler.startNonterminal("BitwiseORExpressionNoIn", e0);
    parse_BitwiseXORExpressionNoIn();
    for (;;)
    {
      if (l1 != 83)                 // '|'
      {
        break;
      }
      shift(83);                    // '|'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_BitwiseXORExpressionNoIn();
    }
    eventHandler.endNonterminal("BitwiseORExpressionNoIn", e0);
  }

  function try_BitwiseORExpressionNoIn()
  {
    try_BitwiseXORExpressionNoIn();
    for (;;)
    {
      if (l1 != 83)                 // '|'
      {
        break;
      }
      shiftT(83);                   // '|'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_BitwiseXORExpressionNoIn();
    }
  }

  function parse_BitwiseXORExpressionNoIn()
  {
    eventHandler.startNonterminal("BitwiseXORExpressionNoIn", e0);
    parse_BitwiseANDExpressionNoIn();
    for (;;)
    {
      if (l1 != 52)                 // '^'
      {
        break;
      }
      shift(52);                    // '^'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_BitwiseANDExpressionNoIn();
    }
    eventHandler.endNonterminal("BitwiseXORExpressionNoIn", e0);
  }

  function try_BitwiseXORExpressionNoIn()
  {
    try_BitwiseANDExpressionNoIn();
    for (;;)
    {
      if (l1 != 52)                 // '^'
      {
        break;
      }
      shiftT(52);                   // '^'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_BitwiseANDExpressionNoIn();
    }
  }

  function parse_BitwiseANDExpressionNoIn()
  {
    eventHandler.startNonterminal("BitwiseANDExpressionNoIn", e0);
    parse_EqualityExpressionNoIn();
    for (;;)
    {
      if (l1 != 17)                 // '&'
      {
        break;
      }
      shift(17);                    // '&'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_EqualityExpressionNoIn();
    }
    eventHandler.endNonterminal("BitwiseANDExpressionNoIn", e0);
  }

  function try_BitwiseANDExpressionNoIn()
  {
    try_EqualityExpressionNoIn();
    for (;;)
    {
      if (l1 != 17)                 // '&'
      {
        break;
      }
      shiftT(17);                   // '&'
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_EqualityExpressionNoIn();
    }
  }

  function parse_EqualityExpressionNoIn()
  {
    eventHandler.startNonterminal("EqualityExpressionNoIn", e0);
    parse_RelationalExpressionNoIn();
    for (;;)
    {
      if (l1 != 13                  // '!='
       && l1 != 14                  // '!=='
       && l1 != 41                  // '=='
       && l1 != 42)                 // '==='
      {
        break;
      }
      switch (l1)
      {
      case 41:                      // '=='
        shift(41);                  // '=='
        break;
      case 13:                      // '!='
        shift(13);                  // '!='
        break;
      case 42:                      // '==='
        shift(42);                  // '==='
        break;
      default:
        shift(14);                  // '!=='
      }
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_RelationalExpressionNoIn();
    }
    eventHandler.endNonterminal("EqualityExpressionNoIn", e0);
  }

  function try_EqualityExpressionNoIn()
  {
    try_RelationalExpressionNoIn();
    for (;;)
    {
      if (l1 != 13                  // '!='
       && l1 != 14                  // '!=='
       && l1 != 41                  // '=='
       && l1 != 42)                 // '==='
      {
        break;
      }
      switch (l1)
      {
      case 41:                      // '=='
        shiftT(41);                 // '=='
        break;
      case 13:                      // '!='
        shiftT(13);                 // '!='
        break;
      case 42:                      // '==='
        shiftT(42);                 // '==='
        break;
      default:
        shiftT(14);                 // '!=='
      }
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_RelationalExpressionNoIn();
    }
  }

  function parse_RelationalExpressionNoIn()
  {
    eventHandler.startNonterminal("RelationalExpressionNoIn", e0);
    parse_ShiftExpression();
    for (;;)
    {
      if (l1 != 36                  // '<'
       && l1 != 39                  // '<='
       && l1 != 43                  // '>'
       && l1 != 44                  // '>='
       && l1 != 69)                 // 'instanceof'
      {
        break;
      }
      switch (l1)
      {
      case 36:                      // '<'
        shift(36);                  // '<'
        break;
      case 43:                      // '>'
        shift(43);                  // '>'
        break;
      case 39:                      // '<='
        shift(39);                  // '<='
        break;
      case 44:                      // '>='
        shift(44);                  // '>='
        break;
      default:
        shift(69);                  // 'instanceof'
      }
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      whitespace();
      parse_ShiftExpression();
    }
    eventHandler.endNonterminal("RelationalExpressionNoIn", e0);
  }

  function try_RelationalExpressionNoIn()
  {
    try_ShiftExpression();
    for (;;)
    {
      if (l1 != 36                  // '<'
       && l1 != 39                  // '<='
       && l1 != 43                  // '>'
       && l1 != 44                  // '>='
       && l1 != 69)                 // 'instanceof'
      {
        break;
      }
      switch (l1)
      {
      case 36:                      // '<'
        shiftT(36);                 // '<'
        break;
      case 43:                      // '>'
        shiftT(43);                 // '>'
        break;
      case 39:                      // '<='
        shiftT(39);                 // '<='
        break;
      case 44:                      // '>='
        shiftT(44);                 // '>='
        break;
      default:
        shiftT(69);                 // 'instanceof'
      }
      lookahead1W(20);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
      try_ShiftExpression();
    }
  }

  function parse_VariableDeclarationListNoIn()
  {
    eventHandler.startNonterminal("VariableDeclarationListNoIn", e0);
    parse_VariableDeclarationNoIn();
    for (;;)
    {
      if (l1 != 27)                 // ','
      {
        break;
      }
      shift(27);                    // ','
      lookahead1W(0);               // Identifier | WhiteSpace | Comment
      whitespace();
      parse_VariableDeclarationNoIn();
    }
    eventHandler.endNonterminal("VariableDeclarationListNoIn", e0);
  }

  function try_VariableDeclarationListNoIn()
  {
    try_VariableDeclarationNoIn();
    for (;;)
    {
      if (l1 != 27)                 // ','
      {
        break;
      }
      shiftT(27);                   // ','
      lookahead1W(0);               // Identifier | WhiteSpace | Comment
      try_VariableDeclarationNoIn();
    }
  }

  function parse_VariableDeclarationNoIn()
  {
    eventHandler.startNonterminal("VariableDeclarationNoIn", e0);
    shift(2);                       // Identifier
    lookahead1W(16);                // WhiteSpace | Comment | ',' | ';' | '=' | 'in'
    if (l1 == 40)                   // '='
    {
      whitespace();
      parse_InitialiserNoIn();
    }
    eventHandler.endNonterminal("VariableDeclarationNoIn", e0);
  }

  function try_VariableDeclarationNoIn()
  {
    shiftT(2);                      // Identifier
    lookahead1W(16);                // WhiteSpace | Comment | ',' | ';' | '=' | 'in'
    if (l1 == 40)                   // '='
    {
      try_InitialiserNoIn();
    }
  }

  function parse_InitialiserNoIn()
  {
    eventHandler.startNonterminal("InitialiserNoIn", e0);
    shift(40);                      // '='
    lookahead1W(20);                // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
    whitespace();
    parse_AssignmentExpressionNoIn();
    eventHandler.endNonterminal("InitialiserNoIn", e0);
  }

  function try_InitialiserNoIn()
  {
    shiftT(40);                     // '='
    lookahead1W(20);                // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
    try_AssignmentExpressionNoIn();
  }

  function parse_ContinueStatement()
  {
    eventHandler.startNonterminal("ContinueStatement", e0);
    shift(57);                      // 'continue'
    lookahead1W(29);                // EOF | Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' | 'case' |
                                    // 'continue' | 'debugger' | 'default' | 'delete' | 'do' | 'else' | 'for' |
                                    // 'function' | 'if' | 'new' | 'return' | 'switch' | 'this' | 'throw' | 'try' |
                                    // 'typeof' | 'var' | 'void' | 'while' | 'with' | '{' | '}' | '~'
    if (l1 == 2)                    // Identifier
    {
      lk = memoized(14, e0);
      if (lk == 0)
      {
        var b0A = b0; var e0A = e0; var l1A = l1;
        var b1A = b1; var e1A = e1;
        try
        {
          shiftT(2);                // Identifier
          lk = -1;
        }
        catch (p1A)
        {
          lk = -2;
        }
        b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
        b1 = b1A; e1 = e1A; end = e1A; }
        memoize(14, e0, lk);
      }
    }
    else
    {
      lk = l1;
    }
    if (lk == -1)
    {
      shift(2);                     // Identifier
    }
    lookahead1W(29);                // EOF | Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' | 'case' |
                                    // 'continue' | 'debugger' | 'default' | 'delete' | 'do' | 'else' | 'for' |
                                    // 'function' | 'if' | 'new' | 'return' | 'switch' | 'this' | 'throw' | 'try' |
                                    // 'typeof' | 'var' | 'void' | 'while' | 'with' | '{' | '}' | '~'
    whitespace();
    parse_Semicolon();
    eventHandler.endNonterminal("ContinueStatement", e0);
  }

  function try_ContinueStatement()
  {
    shiftT(57);                     // 'continue'
    lookahead1W(29);                // EOF | Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' | 'case' |
                                    // 'continue' | 'debugger' | 'default' | 'delete' | 'do' | 'else' | 'for' |
                                    // 'function' | 'if' | 'new' | 'return' | 'switch' | 'this' | 'throw' | 'try' |
                                    // 'typeof' | 'var' | 'void' | 'while' | 'with' | '{' | '}' | '~'
    if (l1 == 2)                    // Identifier
    {
      lk = memoized(14, e0);
      if (lk == 0)
      {
        var b0A = b0; var e0A = e0; var l1A = l1;
        var b1A = b1; var e1A = e1;
        try
        {
          shiftT(2);                // Identifier
          memoize(14, e0A, -1);
        }
        catch (p1A)
        {
          b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
          b1 = b1A; e1 = e1A; end = e1A; }
          memoize(14, e0A, -2);
        }
        lk = -2;
      }
    }
    else
    {
      lk = l1;
    }
    if (lk == -1)
    {
      shiftT(2);                    // Identifier
    }
    lookahead1W(29);                // EOF | Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' | 'case' |
                                    // 'continue' | 'debugger' | 'default' | 'delete' | 'do' | 'else' | 'for' |
                                    // 'function' | 'if' | 'new' | 'return' | 'switch' | 'this' | 'throw' | 'try' |
                                    // 'typeof' | 'var' | 'void' | 'while' | 'with' | '{' | '}' | '~'
    try_Semicolon();
  }

  function parse_BreakStatement()
  {
    eventHandler.startNonterminal("BreakStatement", e0);
    shift(54);                      // 'break'
    lookahead1W(29);                // EOF | Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' | 'case' |
                                    // 'continue' | 'debugger' | 'default' | 'delete' | 'do' | 'else' | 'for' |
                                    // 'function' | 'if' | 'new' | 'return' | 'switch' | 'this' | 'throw' | 'try' |
                                    // 'typeof' | 'var' | 'void' | 'while' | 'with' | '{' | '}' | '~'
    if (l1 == 2)                    // Identifier
    {
      lk = memoized(15, e0);
      if (lk == 0)
      {
        var b0A = b0; var e0A = e0; var l1A = l1;
        var b1A = b1; var e1A = e1;
        try
        {
          shiftT(2);                // Identifier
          lk = -1;
        }
        catch (p1A)
        {
          lk = -2;
        }
        b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
        b1 = b1A; e1 = e1A; end = e1A; }
        memoize(15, e0, lk);
      }
    }
    else
    {
      lk = l1;
    }
    if (lk == -1)
    {
      shift(2);                     // Identifier
    }
    lookahead1W(29);                // EOF | Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' | 'case' |
                                    // 'continue' | 'debugger' | 'default' | 'delete' | 'do' | 'else' | 'for' |
                                    // 'function' | 'if' | 'new' | 'return' | 'switch' | 'this' | 'throw' | 'try' |
                                    // 'typeof' | 'var' | 'void' | 'while' | 'with' | '{' | '}' | '~'
    whitespace();
    parse_Semicolon();
    eventHandler.endNonterminal("BreakStatement", e0);
  }

  function try_BreakStatement()
  {
    shiftT(54);                     // 'break'
    lookahead1W(29);                // EOF | Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' | 'case' |
                                    // 'continue' | 'debugger' | 'default' | 'delete' | 'do' | 'else' | 'for' |
                                    // 'function' | 'if' | 'new' | 'return' | 'switch' | 'this' | 'throw' | 'try' |
                                    // 'typeof' | 'var' | 'void' | 'while' | 'with' | '{' | '}' | '~'
    if (l1 == 2)                    // Identifier
    {
      lk = memoized(15, e0);
      if (lk == 0)
      {
        var b0A = b0; var e0A = e0; var l1A = l1;
        var b1A = b1; var e1A = e1;
        try
        {
          shiftT(2);                // Identifier
          memoize(15, e0A, -1);
        }
        catch (p1A)
        {
          b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
          b1 = b1A; e1 = e1A; end = e1A; }
          memoize(15, e0A, -2);
        }
        lk = -2;
      }
    }
    else
    {
      lk = l1;
    }
    if (lk == -1)
    {
      shiftT(2);                    // Identifier
    }
    lookahead1W(29);                // EOF | Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' | 'case' |
                                    // 'continue' | 'debugger' | 'default' | 'delete' | 'do' | 'else' | 'for' |
                                    // 'function' | 'if' | 'new' | 'return' | 'switch' | 'this' | 'throw' | 'try' |
                                    // 'typeof' | 'var' | 'void' | 'while' | 'with' | '{' | '}' | '~'
    try_Semicolon();
  }

  function parse_ReturnStatement()
  {
    eventHandler.startNonterminal("ReturnStatement", e0);
    shift(71);                      // 'return'
    lookahead1W(29);                // EOF | Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' | 'case' |
                                    // 'continue' | 'debugger' | 'default' | 'delete' | 'do' | 'else' | 'for' |
                                    // 'function' | 'if' | 'new' | 'return' | 'switch' | 'this' | 'throw' | 'try' |
                                    // 'typeof' | 'var' | 'void' | 'while' | 'with' | '{' | '}' | '~'
    if (l1 != 1                     // EOF
     && l1 != 35                    // ';'
     && l1 != 54                    // 'break'
     && l1 != 55                    // 'case'
     && l1 != 57                    // 'continue'
     && l1 != 58                    // 'debugger'
     && l1 != 59                    // 'default'
     && l1 != 61                    // 'do'
     && l1 != 62                    // 'else'
     && l1 != 64                    // 'for'
     && l1 != 67                    // 'if'
     && l1 != 71                    // 'return'
     && l1 != 73                    // 'switch'
     && l1 != 75                    // 'throw'
     && l1 != 76                    // 'try'
     && l1 != 78                    // 'var'
     && l1 != 80                    // 'while'
     && l1 != 81                    // 'with'
     && l1 != 86)                   // '}'
    {
      lk = memoized(16, e0);
      if (lk == 0)
      {
        var b0A = b0; var e0A = e0; var l1A = l1;
        var b1A = b1; var e1A = e1;
        try
        {
          try_Expression();
          lk = -1;
        }
        catch (p1A)
        {
          lk = -2;
        }
        b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
        b1 = b1A; e1 = e1A; end = e1A; }
        memoize(16, e0, lk);
      }
    }
    else
    {
      lk = l1;
    }
    if (lk == -1)
    {
      whitespace();
      parse_Expression();
    }
    whitespace();
    parse_Semicolon();
    eventHandler.endNonterminal("ReturnStatement", e0);
  }

  function try_ReturnStatement()
  {
    shiftT(71);                     // 'return'
    lookahead1W(29);                // EOF | Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' | 'case' |
                                    // 'continue' | 'debugger' | 'default' | 'delete' | 'do' | 'else' | 'for' |
                                    // 'function' | 'if' | 'new' | 'return' | 'switch' | 'this' | 'throw' | 'try' |
                                    // 'typeof' | 'var' | 'void' | 'while' | 'with' | '{' | '}' | '~'
    if (l1 != 1                     // EOF
     && l1 != 35                    // ';'
     && l1 != 54                    // 'break'
     && l1 != 55                    // 'case'
     && l1 != 57                    // 'continue'
     && l1 != 58                    // 'debugger'
     && l1 != 59                    // 'default'
     && l1 != 61                    // 'do'
     && l1 != 62                    // 'else'
     && l1 != 64                    // 'for'
     && l1 != 67                    // 'if'
     && l1 != 71                    // 'return'
     && l1 != 73                    // 'switch'
     && l1 != 75                    // 'throw'
     && l1 != 76                    // 'try'
     && l1 != 78                    // 'var'
     && l1 != 80                    // 'while'
     && l1 != 81                    // 'with'
     && l1 != 86)                   // '}'
    {
      lk = memoized(16, e0);
      if (lk == 0)
      {
        var b0A = b0; var e0A = e0; var l1A = l1;
        var b1A = b1; var e1A = e1;
        try
        {
          try_Expression();
          memoize(16, e0A, -1);
        }
        catch (p1A)
        {
          b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
          b1 = b1A; e1 = e1A; end = e1A; }
          memoize(16, e0A, -2);
        }
        lk = -2;
      }
    }
    else
    {
      lk = l1;
    }
    if (lk == -1)
    {
      try_Expression();
    }
    try_Semicolon();
  }

  function parse_WithStatement()
  {
    eventHandler.startNonterminal("WithStatement", e0);
    shift(81);                      // 'with'
    lookahead1W(2);                 // WhiteSpace | Comment | '('
    shift(20);                      // '('
    lookahead1W(20);                // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
    whitespace();
    parse_Expression();
    shift(21);                      // ')'
    lookahead1W(24);                // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '~'
    whitespace();
    parse_Statement();
    eventHandler.endNonterminal("WithStatement", e0);
  }

  function try_WithStatement()
  {
    shiftT(81);                     // 'with'
    lookahead1W(2);                 // WhiteSpace | Comment | '('
    shiftT(20);                     // '('
    lookahead1W(20);                // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
    try_Expression();
    shiftT(21);                     // ')'
    lookahead1W(24);                // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '~'
    try_Statement();
  }

  function parse_LabelledStatement()
  {
    eventHandler.startNonterminal("LabelledStatement", e0);
    shift(2);                       // Identifier
    lookahead1W(4);                 // WhiteSpace | Comment | ':'
    shift(34);                      // ':'
    lookahead1W(24);                // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '~'
    whitespace();
    parse_Statement();
    eventHandler.endNonterminal("LabelledStatement", e0);
  }

  function try_LabelledStatement()
  {
    shiftT(2);                      // Identifier
    lookahead1W(4);                 // WhiteSpace | Comment | ':'
    shiftT(34);                     // ':'
    lookahead1W(24);                // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '~'
    try_Statement();
  }

  function parse_SwitchStatement()
  {
    eventHandler.startNonterminal("SwitchStatement", e0);
    shift(73);                      // 'switch'
    lookahead1W(2);                 // WhiteSpace | Comment | '('
    shift(20);                      // '('
    lookahead1W(20);                // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
    whitespace();
    parse_Expression();
    shift(21);                      // ')'
    lookahead1W(7);                 // WhiteSpace | Comment | '{'
    whitespace();
    parse_CaseBlock();
    eventHandler.endNonterminal("SwitchStatement", e0);
  }

  function try_SwitchStatement()
  {
    shiftT(73);                     // 'switch'
    lookahead1W(2);                 // WhiteSpace | Comment | '('
    shiftT(20);                     // '('
    lookahead1W(20);                // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
    try_Expression();
    shiftT(21);                     // ')'
    lookahead1W(7);                 // WhiteSpace | Comment | '{'
    try_CaseBlock();
  }

  function parse_CaseBlock()
  {
    eventHandler.startNonterminal("CaseBlock", e0);
    shift(82);                      // '{'
    for (;;)
    {
      lookahead1W(14);              // WhiteSpace | Comment | 'case' | 'default' | '}'
      if (l1 != 55)                 // 'case'
      {
        break;
      }
      whitespace();
      parse_CaseClause();
    }
    if (l1 == 59)                   // 'default'
    {
      whitespace();
      parse_DefaultClause();
      for (;;)
      {
        if (l1 != 55)               // 'case'
        {
          break;
        }
        whitespace();
        parse_CaseClause();
      }
    }
    shift(86);                      // '}'
    eventHandler.endNonterminal("CaseBlock", e0);
  }

  function try_CaseBlock()
  {
    shiftT(82);                     // '{'
    for (;;)
    {
      lookahead1W(14);              // WhiteSpace | Comment | 'case' | 'default' | '}'
      if (l1 != 55)                 // 'case'
      {
        break;
      }
      try_CaseClause();
    }
    if (l1 == 59)                   // 'default'
    {
      try_DefaultClause();
      for (;;)
      {
        if (l1 != 55)               // 'case'
        {
          break;
        }
        try_CaseClause();
      }
    }
    shiftT(86);                     // '}'
  }

  function parse_CaseClause()
  {
    eventHandler.startNonterminal("CaseClause", e0);
    shift(55);                      // 'case'
    lookahead1W(20);                // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
    whitespace();
    parse_Expression();
    shift(34);                      // ':'
    for (;;)
    {
      lookahead1W(28);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' | 'case' |
                                    // 'continue' | 'debugger' | 'default' | 'delete' | 'do' | 'for' | 'function' |
                                    // 'if' | 'new' | 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' |
                                    // 'var' | 'void' | 'while' | 'with' | '{' | '}' | '~'
      if (l1 == 55                  // 'case'
       || l1 == 59                  // 'default'
       || l1 == 86)                 // '}'
      {
        break;
      }
      whitespace();
      parse_Statement();
    }
    eventHandler.endNonterminal("CaseClause", e0);
  }

  function try_CaseClause()
  {
    shiftT(55);                     // 'case'
    lookahead1W(20);                // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
    try_Expression();
    shiftT(34);                     // ':'
    for (;;)
    {
      lookahead1W(28);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' | 'case' |
                                    // 'continue' | 'debugger' | 'default' | 'delete' | 'do' | 'for' | 'function' |
                                    // 'if' | 'new' | 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' |
                                    // 'var' | 'void' | 'while' | 'with' | '{' | '}' | '~'
      if (l1 == 55                  // 'case'
       || l1 == 59                  // 'default'
       || l1 == 86)                 // '}'
      {
        break;
      }
      try_Statement();
    }
  }

  function parse_DefaultClause()
  {
    eventHandler.startNonterminal("DefaultClause", e0);
    shift(59);                      // 'default'
    lookahead1W(4);                 // WhiteSpace | Comment | ':'
    shift(34);                      // ':'
    for (;;)
    {
      lookahead1W(27);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' | 'case' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '}' | '~'
      if (l1 == 55                  // 'case'
       || l1 == 86)                 // '}'
      {
        break;
      }
      whitespace();
      parse_Statement();
    }
    eventHandler.endNonterminal("DefaultClause", e0);
  }

  function try_DefaultClause()
  {
    shiftT(59);                     // 'default'
    lookahead1W(4);                 // WhiteSpace | Comment | ':'
    shiftT(34);                     // ':'
    for (;;)
    {
      lookahead1W(27);              // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' | 'case' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '}' | '~'
      if (l1 == 55                  // 'case'
       || l1 == 86)                 // '}'
      {
        break;
      }
      try_Statement();
    }
  }

  function parse_ThrowStatement()
  {
    eventHandler.startNonterminal("ThrowStatement", e0);
    shift(75);                      // 'throw'
    lookahead1W(20);                // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
    whitespace();
    parse_Expression();
    whitespace();
    parse_Semicolon();
    eventHandler.endNonterminal("ThrowStatement", e0);
  }

  function try_ThrowStatement()
  {
    shiftT(75);                     // 'throw'
    lookahead1W(20);                // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | '[' | 'delete' | 'function' |
                                    // 'new' | 'this' | 'typeof' | 'void' | '{' | '~'
    try_Expression();
    try_Semicolon();
  }

  function parse_TryStatement()
  {
    eventHandler.startNonterminal("TryStatement", e0);
    shift(76);                      // 'try'
    lookahead1W(7);                 // WhiteSpace | Comment | '{'
    whitespace();
    parse_Block();
    lookahead1W(13);                // WhiteSpace | Comment | 'catch' | 'finally'
    switch (l1)
    {
    case 56:                        // 'catch'
      whitespace();
      parse_Catch();
      lookahead1W(30);              // EOF | Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' | 'case' |
                                    // 'continue' | 'debugger' | 'default' | 'delete' | 'do' | 'else' | 'finally' |
                                    // 'for' | 'function' | 'if' | 'new' | 'return' | 'switch' | 'this' | 'throw' |
                                    // 'try' | 'typeof' | 'var' | 'void' | 'while' | 'with' | '{' | '}' | '~'
      if (l1 == 63)                 // 'finally'
      {
        whitespace();
        parse_Finally();
      }
      break;
    default:
      whitespace();
      parse_Finally();
    }
    eventHandler.endNonterminal("TryStatement", e0);
  }

  function try_TryStatement()
  {
    shiftT(76);                     // 'try'
    lookahead1W(7);                 // WhiteSpace | Comment | '{'
    try_Block();
    lookahead1W(13);                // WhiteSpace | Comment | 'catch' | 'finally'
    switch (l1)
    {
    case 56:                        // 'catch'
      try_Catch();
      lookahead1W(30);              // EOF | Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' | 'case' |
                                    // 'continue' | 'debugger' | 'default' | 'delete' | 'do' | 'else' | 'finally' |
                                    // 'for' | 'function' | 'if' | 'new' | 'return' | 'switch' | 'this' | 'throw' |
                                    // 'try' | 'typeof' | 'var' | 'void' | 'while' | 'with' | '{' | '}' | '~'
      if (l1 == 63)                 // 'finally'
      {
        try_Finally();
      }
      break;
    default:
      try_Finally();
    }
  }

  function parse_Catch()
  {
    eventHandler.startNonterminal("Catch", e0);
    shift(56);                      // 'catch'
    lookahead1W(2);                 // WhiteSpace | Comment | '('
    shift(20);                      // '('
    lookahead1W(0);                 // Identifier | WhiteSpace | Comment
    shift(2);                       // Identifier
    lookahead1W(3);                 // WhiteSpace | Comment | ')'
    shift(21);                      // ')'
    lookahead1W(7);                 // WhiteSpace | Comment | '{'
    whitespace();
    parse_Block();
    eventHandler.endNonterminal("Catch", e0);
  }

  function try_Catch()
  {
    shiftT(56);                     // 'catch'
    lookahead1W(2);                 // WhiteSpace | Comment | '('
    shiftT(20);                     // '('
    lookahead1W(0);                 // Identifier | WhiteSpace | Comment
    shiftT(2);                      // Identifier
    lookahead1W(3);                 // WhiteSpace | Comment | ')'
    shiftT(21);                     // ')'
    lookahead1W(7);                 // WhiteSpace | Comment | '{'
    try_Block();
  }

  function parse_Finally()
  {
    eventHandler.startNonterminal("Finally", e0);
    shift(63);                      // 'finally'
    lookahead1W(7);                 // WhiteSpace | Comment | '{'
    whitespace();
    parse_Block();
    eventHandler.endNonterminal("Finally", e0);
  }

  function try_Finally()
  {
    shiftT(63);                     // 'finally'
    lookahead1W(7);                 // WhiteSpace | Comment | '{'
    try_Block();
  }

  function parse_DebuggerStatement()
  {
    eventHandler.startNonterminal("DebuggerStatement", e0);
    shift(58);                      // 'debugger'
    lookahead1W(29);                // EOF | Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' | 'case' |
                                    // 'continue' | 'debugger' | 'default' | 'delete' | 'do' | 'else' | 'for' |
                                    // 'function' | 'if' | 'new' | 'return' | 'switch' | 'this' | 'throw' | 'try' |
                                    // 'typeof' | 'var' | 'void' | 'while' | 'with' | '{' | '}' | '~'
    whitespace();
    parse_Semicolon();
    eventHandler.endNonterminal("DebuggerStatement", e0);
  }

  function try_DebuggerStatement()
  {
    shiftT(58);                     // 'debugger'
    lookahead1W(29);                // EOF | Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' | 'case' |
                                    // 'continue' | 'debugger' | 'default' | 'delete' | 'do' | 'else' | 'for' |
                                    // 'function' | 'if' | 'new' | 'return' | 'switch' | 'this' | 'throw' | 'try' |
                                    // 'typeof' | 'var' | 'void' | 'while' | 'with' | '{' | '}' | '~'
    try_Semicolon();
  }

  function parse_FunctionDeclaration()
  {
    eventHandler.startNonterminal("FunctionDeclaration", e0);
    shift(65);                      // 'function'
    lookahead1W(0);                 // Identifier | WhiteSpace | Comment
    shift(2);                       // Identifier
    lookahead1W(2);                 // WhiteSpace | Comment | '('
    shift(20);                      // '('
    lookahead1W(10);                // Identifier | WhiteSpace | Comment | ')'
    if (l1 == 2)                    // Identifier
    {
      whitespace();
      parse_FormalParameterList();
    }
    shift(21);                      // ')'
    lookahead1W(7);                 // WhiteSpace | Comment | '{'
    shift(82);                      // '{'
    lookahead1W(26);                // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '}' | '~'
    whitespace();
    parse_FunctionBody();
    shift(86);                      // '}'
    eventHandler.endNonterminal("FunctionDeclaration", e0);
  }

  function try_FunctionDeclaration()
  {
    shiftT(65);                     // 'function'
    lookahead1W(0);                 // Identifier | WhiteSpace | Comment
    shiftT(2);                      // Identifier
    lookahead1W(2);                 // WhiteSpace | Comment | '('
    shiftT(20);                     // '('
    lookahead1W(10);                // Identifier | WhiteSpace | Comment | ')'
    if (l1 == 2)                    // Identifier
    {
      try_FormalParameterList();
    }
    shiftT(21);                     // ')'
    lookahead1W(7);                 // WhiteSpace | Comment | '{'
    shiftT(82);                     // '{'
    lookahead1W(26);                // Identifier | NullLiteral | BooleanLiteral | StringLiteral |
                                    // RegularExpressionLiteral | DecimalLiteral | HexIntegerLiteral | WhiteSpace |
                                    // Comment | '!' | '(' | '+' | '++' | '-' | '--' | ';' | '[' | 'break' |
                                    // 'continue' | 'debugger' | 'delete' | 'do' | 'for' | 'function' | 'if' | 'new' |
                                    // 'return' | 'switch' | 'this' | 'throw' | 'try' | 'typeof' | 'var' | 'void' |
                                    // 'while' | 'with' | '{' | '}' | '~'
    try_FunctionBody();
    shiftT(86);                     // '}'
  }

  function parse_Semicolon()
  {
    eventHandler.startNonterminal("Semicolon", e0);
    switch (l1)
    {
    case 35:                        // ';'
      shift(35);                    // ';'
      break;
    default:
      break;
    }
    eventHandler.endNonterminal("Semicolon", e0);
  }

  function try_Semicolon()
  {
    switch (l1)
    {
    case 35:                        // ';'
      shiftT(35);                   // ';'
      break;
    default:
      break;
    }
  }

  function shift(t)
  {
    if (l1 == t)
    {
      whitespace();
      eventHandler.terminal(ES5Parser.TOKEN[l1], b1, e1 > size ? size : e1);
      b0 = b1; e0 = e1; l1 = 0;
    }
    else
    {
      error(b1, e1, 0, l1, t);
    }
  }

  function shiftT(t)
  {
    if (l1 == t)
    {
      b0 = b1; e0 = e1; l1 = 0;
    }
    else
    {
      error(b1, e1, 0, l1, t);
    }
  }

  function whitespace()
  {
    if (e0 != b1)
    {
      b0 = e0;
      e0 = b1;
      eventHandler.whitespace(b0, e0);
    }
  }

  function matchW(set)
  {
    var code;
    for (;;)
    {
      code = match(set);
      if (code != 10                // WhiteSpace
       && code != 11)               // Comment
      {
        break;
      }
    }
    return code;
  }

  function lookahead1W(set)
  {
    if (l1 == 0)
    {
      l1 = matchW(set);
      b1 = begin;
      e1 = end;
    }
  }

  function error(b, e, s, l, t)
  {
    if (e > ex)
    {
      bx = b;
      ex = e;
      sx = s;
      lx = l;
      tx = t;
    }
    throw new self.ParseException(bx, ex, sx, lx, tx);
  }

  var lk, b0, e0;
  var l1, b1, e1;
  var bx, ex, sx, lx, tx;
  var eventHandler;
  var memo;

  function memoize(i, e, v)
  {
    memo[(e << 5) + i] = v;
  }

  function memoized(i, e)
  {
    var v = memo[(e << 5) + i];
    return typeof v != "undefined" ? v : 0;
  }

  var input;
  var size;
  var begin;
  var end;

  function match(tokenSetId)
  {
    var nonbmp = false;
    begin = end;
    var current = end;
    var result = ES5Parser.INITIAL[tokenSetId];
    var state = 0;

    for (var code = result & 511; code != 0; )
    {
      var charclass;
      var c0 = current < size ? input.charCodeAt(current) : 0;
      ++current;
      if (c0 < 0x80)
      {
        charclass = ES5Parser.MAP0[c0];
      }
      else if (c0 < 0xd800)
      {
        var c1 = c0 >> 3;
        charclass = ES5Parser.MAP1[(c0 & 7) + ES5Parser.MAP1[(c1 & 31) + ES5Parser.MAP1[c1 >> 5]]];
      }
      else
      {
        if (c0 < 0xdc00)
        {
          var c1 = current < size ? input.charCodeAt(current) : 0;
          if (c1 >= 0xdc00 && c1 < 0xe000)
          {
            ++current;
            c0 = ((c0 & 0x3ff) << 10) + (c1 & 0x3ff) + 0x10000;
            nonbmp = true;
          }
        }
        var lo = 0, hi = 3;
        for (var m = 2; ; m = (hi + lo) >> 1)
        {
          if (ES5Parser.MAP2[m] > c0) hi = m - 1;
          else if (ES5Parser.MAP2[4 + m] < c0) lo = m + 1;
          else {charclass = ES5Parser.MAP2[8 + m]; break;}
          if (lo > hi) {charclass = 0; break;}
        }
      }

      state = code;
      var i0 = (charclass << 9) + code - 1;
      code = ES5Parser.TRANSITION[(i0 & 7) + ES5Parser.TRANSITION[i0 >> 3]];

      if (code > 511)
      {
        result = code;
        code &= 511;
        end = current;
      }
    }

    result >>= 9;
    if (result == 0)
    {
      end = current - 1;
      var c1 = end < size ? input.charCodeAt(end) : 0;
      if (c1 >= 0xdc00 && c1 < 0xe000) --end;
      return error(begin, end, state, -1, -1);
    }

    if (nonbmp)
    {
      for (var i = result >> 7; i > 0; --i)
      {
        --end;
        var c1 = end < size ? input.charCodeAt(end) : 0;
        if (c1 >= 0xdc00 && c1 < 0xe000) --end;
      }
    }
    else
    {
      end -= result >> 7;
    }

    return (result & 127) - 1;
  }
}

ES5Parser.getTokenSet = function(tokenSetId)
{
  var set = [];
  var s = tokenSetId < 0 ? - tokenSetId : INITIAL[tokenSetId] & 511;
  for (var i = 0; i < 88; i += 32)
  {
    var j = i;
    var i0 = (i >> 5) * 361 + s - 1;
    var i1 = i0 >> 1;
    var f = ES5Parser.EXPECTED[(i0 & 1) + ES5Parser.EXPECTED[(i1 & 3) + ES5Parser.EXPECTED[i1 >> 2]]];
    for ( ; f != 0; f >>>= 1, ++j)
    {
      if ((f & 1) != 0)
      {
        set.push(ES5Parser.TOKEN[j]);
      }
    }
  }
  return set;
};

ES5Parser.MAP0 =
[
  /*   0 */ 65, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 5, 6, 7,
  /*  36 */ 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 21, 21, 21, 21, 21, 21, 22, 22, 23, 24, 25, 26, 27,
  /*  63 */ 28, 7, 29, 29, 29, 29, 30, 29, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 31, 8, 8, 32, 33, 34, 35,
  /*  95 */ 8, 7, 36, 37, 38, 39, 40, 41, 42, 43, 44, 8, 45, 46, 47, 48, 49, 50, 8, 51, 52, 53, 54, 55, 56, 57, 58, 8,
  /* 123 */ 59, 60, 61, 62, 7
];

ES5Parser.MAP1 =
[
  /*    0 */ 216, 335, 247, 367, 432, 695, 303, 400, 400, 464, 496, 528, 560, 592, 640, 669, 899, 727, 400, 400, 400,
  /*   21 */ 400, 608, 400, 398, 400, 400, 400, 400, 400, 759, 791, 823, 275, 400, 400, 400, 400, 400, 400, 400, 400,
  /*   42 */ 400, 400, 400, 400, 400, 400, 855, 887, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400,
  /*   63 */ 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 931, 931, 931, 931, 931, 931,
  /*   84 */ 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931,
  /*  105 */ 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931,
  /*  126 */ 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931,
  /*  147 */ 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 943, 400, 400, 400, 400, 400, 400, 400, 400,
  /*  168 */ 400, 400, 400, 400, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931,
  /*  189 */ 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931, 931,
  /*  210 */ 931, 931, 931, 931, 931, 975, 1007, 1016, 1008, 1008, 1024, 1032, 1040, 1048, 1056, 1313, 1313, 1081, 1099,
  /*  229 */ 1107, 1115, 1123, 1323, 1149, 1149, 1149, 1148, 1149, 1472, 1149, 1313, 1313, 1314, 1313, 1313, 1313, 1314,
  /*  247 */ 1313, 1313, 1313, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313,
  /*  265 */ 1313, 1313, 1313, 1320, 1149, 1518, 1319, 1149, 1440, 1149, 1149, 1149, 1149, 1149, 1151, 1344, 1149, 1149,
  /*  283 */ 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1318, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149,
  /*  301 */ 1149, 1149, 1149, 1149, 1149, 1149, 1312, 1313, 1313, 1318, 1137, 1379, 1439, 1149, 1434, 1440, 1137, 1313,
  /*  319 */ 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1415, 1313, 1314, 1190, 1434, 1368, 1255, 1434, 1440, 1313, 1313,
  /*  337 */ 1313, 1313, 1313, 1313, 1413, 1314, 1312, 1311, 1313, 1313, 1313, 1313, 1313, 1314, 1313, 1313, 1313, 1313,
  /*  355 */ 1313, 1313, 1313, 1313, 1317, 1516, 1313, 1313, 1313, 1313, 1242, 1519, 1434, 1434, 1434, 1434, 1434, 1434,
  /*  373 */ 1434, 1434, 1436, 1149, 1149, 1149, 1440, 1149, 1149, 1149, 1073, 1290, 1313, 1313, 1310, 1313, 1313, 1313,
  /*  391 */ 1313, 1314, 1314, 1459, 1311, 1313, 1317, 1149, 1322, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149,
  /*  409 */ 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149,
  /*  427 */ 1149, 1149, 1149, 1149, 1149, 1312, 1159, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1312, 1159, 1313,
  /*  445 */ 1313, 1313, 1313, 1168, 1149, 1313, 1313, 1313, 1313, 1313, 1313, 1181, 1088, 1313, 1313, 1313, 1182, 1315,
  /*  463 */ 1319, 1530, 1313, 1313, 1313, 1313, 1313, 1313, 1208, 1434, 1436, 1256, 1313, 1226, 1434, 1149, 1149, 1530,
  /*  481 */ 1181, 1414, 1313, 1313, 1311, 1240, 1251, 1217, 1229, 1472, 1266, 1226, 1434, 1319, 1149, 1277, 1300, 1414,
  /*  499 */ 1313, 1313, 1311, 1449, 1251, 1232, 1229, 1149, 1288, 1473, 1434, 1298, 1149, 1530, 1289, 1310, 1313, 1313,
  /*  517 */ 1311, 1308, 1208, 1331, 1173, 1149, 1149, 1063, 1434, 1149, 1149, 1530, 1181, 1414, 1313, 1313, 1311, 1411,
  /*  535 */ 1208, 1257, 1229, 1473, 1266, 1091, 1434, 1149, 1149, 1500, 1340, 1356, 1352, 1243, 1340, 1139, 1091, 1258,
  /*  553 */ 1255, 1472, 1149, 1472, 1434, 1149, 1149, 1530, 1159, 1311, 1313, 1313, 1311, 1160, 1091, 1332, 1255, 1474,
  /*  571 */ 1149, 1091, 1434, 1149, 1149, 1500, 1159, 1311, 1313, 1313, 1311, 1160, 1091, 1332, 1255, 1474, 1151, 1091,
  /*  589 */ 1434, 1149, 1149, 1500, 1159, 1311, 1313, 1313, 1311, 1313, 1091, 1218, 1255, 1472, 1149, 1091, 1434, 1149,
  /*  607 */ 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1148,
  /*  625 */ 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1312, 1313, 1313,
  /*  643 */ 1313, 1313, 1314, 1364, 1439, 1376, 1435, 1434, 1440, 1149, 1149, 1149, 1149, 1269, 1388, 1517, 1312, 1398,
  /*  661 */ 1408, 1364, 1200, 1423, 1436, 1434, 1440, 1149, 1149, 1149, 1149, 1440, 1434, 1440, 1130, 1428, 1313, 1312,
  /*  679 */ 1313, 1313, 1313, 1319, 1433, 1434, 1332, 1438, 1331, 1433, 1434, 1436, 1433, 1071, 1149, 1149, 1149, 1149,
  /*  697 */ 1149, 1149, 1149, 1149, 1312, 1313, 1313, 1313, 1314, 1470, 1312, 1313, 1313, 1313, 1314, 1149, 1433, 1434,
  /*  715 */ 1214, 1434, 1434, 1196, 1068, 1149, 1313, 1313, 1313, 1318, 1318, 1149, 1308, 1448, 1318, 1149, 1149, 1149,
  /*  733 */ 1149, 1457, 1320, 1457, 1242, 1514, 1400, 1241, 1268, 1149, 1149, 1149, 1149, 1151, 1149, 1390, 1150, 1354,
  /*  751 */ 1318, 1149, 1149, 1149, 1149, 1468, 1320, 1470, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313,
  /*  769 */ 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1317, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313,
  /*  787 */ 1313, 1313, 1313, 1319, 1313, 1313, 1315, 1315, 1313, 1313, 1313, 1313, 1315, 1315, 1313, 1460, 1313, 1313,
  /*  805 */ 1313, 1315, 1313, 1313, 1313, 1313, 1313, 1313, 1159, 1140, 1280, 1316, 1182, 1317, 1313, 1316, 1280, 1316,
  /*  823 */ 1489, 1494, 1149, 1149, 1149, 1482, 1149, 1149, 1149, 1149, 1149, 1321, 1149, 1149, 1149, 1149, 1149, 1149,
  /*  841 */ 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1434, 1437, 1071, 1149, 1149, 1149, 1508, 1149, 1149, 1149,
  /*  859 */ 1312, 1380, 1216, 1149, 1312, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1316, 1497, 1312, 1313,
  /*  877 */ 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1527, 1516, 1313, 1313, 1313, 1313, 1316, 1149, 1149,
  /*  895 */ 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149,
  /*  913 */ 1149, 1149, 1149, 1149, 1149, 1149, 1313, 1313, 1313, 1313, 1315, 1149, 1313, 1313, 1313, 1313, 1314, 1149,
  /*  931 */ 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313,
  /*  949 */ 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1315, 1149, 1149, 1149,
  /*  967 */ 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1149, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313,
  /*  985 */ 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1313, 1317, 1149, 1149, 1149, 1149, 1149, 1149, 1149,
  /* 1003 */ 1149, 1149, 1149, 1149, 65, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 4, 0, 0, 1, 5, 6, 7, 8, 9, 10, 11, 12,
  /* 1033 */ 13, 14, 15, 16, 17, 18, 19, 20, 21, 21, 21, 21, 21, 21, 21, 22, 22, 23, 24, 25, 26, 27, 28, 7, 29, 29, 29,
  /* 1060 */ 29, 30, 29, 8, 7, 7, 7, 7, 7, 63, 63, 7, 63, 7, 7, 7, 7, 7, 7, 8, 63, 31, 8, 8, 32, 33, 34, 35, 8, 7, 7, 8,
  /* 1092 */ 8, 7, 7, 7, 7, 63, 63, 7, 36, 37, 38, 39, 40, 41, 42, 43, 44, 8, 45, 46, 47, 48, 49, 50, 8, 51, 52, 53, 54,
  /* 1121 */ 55, 56, 57, 58, 8, 59, 60, 61, 62, 7, 7, 7, 7, 7, 63, 7, 63, 8, 8, 8, 8, 8, 8, 8, 7, 8, 7, 1, 7, 7, 7, 7,
  /* 1153 */ 7, 7, 7, 7, 8, 7, 8, 8, 8, 8, 8, 7, 8, 8, 8, 8, 8, 7, 63, 63, 63, 63, 7, 63, 63, 63, 7, 7, 8, 8, 8, 8, 8,
  /* 1186 */ 7, 7, 8, 8, 8, 8, 8, 8, 7, 8, 63, 63, 7, 63, 63, 63, 7, 63, 63, 8, 7, 7, 8, 8, 7, 7, 63, 8, 63, 63, 7, 63,
  /* 1218 */ 63, 63, 63, 63, 7, 7, 63, 63, 8, 8, 63, 63, 7, 7, 63, 63, 63, 7, 7, 7, 7, 63, 8, 7, 8, 7, 7, 7, 8, 8, 7, 7,
  /* 1250 */ 7, 8, 8, 7, 7, 63, 7, 63, 63, 63, 63, 7, 7, 7, 63, 63, 7, 7, 7, 7, 8, 8, 7, 8, 7, 7, 8, 7, 7, 63, 7, 7, 8,
  /* 1283 */ 8, 8, 7, 8, 8, 7, 8, 8, 8, 8, 7, 8, 7, 8, 8, 63, 63, 8, 8, 8, 7, 7, 7, 7, 8, 8, 7, 8, 8, 7, 8, 8, 8, 8, 8,
  /* 1318 */ 8, 8, 8, 7, 7, 7, 7, 7, 7, 7, 1, 7, 7, 63, 63, 63, 63, 63, 63, 7, 63, 63, 8, 8, 8, 7, 7, 7, 8, 8, 7, 7, 8,
  /* 1351 */ 7, 7, 8, 8, 7, 8, 7, 8, 8, 8, 8, 7, 7, 8, 63, 8, 8, 63, 63, 63, 63, 63, 8, 8, 63, 8, 8, 8, 8, 8, 8, 63, 63,
  /* 1384 */ 63, 63, 63, 63, 8, 7, 8, 7, 7, 8, 7, 7, 8, 8, 7, 8, 8, 8, 7, 8, 7, 8, 7, 8, 7, 7, 8, 8, 7, 8, 8, 7, 7, 8,
  /* 1418 */ 8, 8, 8, 8, 7, 8, 8, 8, 8, 8, 7, 63, 7, 7, 7, 7, 63, 63, 63, 63, 63, 63, 63, 63, 7, 7, 7, 7, 7, 7, 7, 8, 7,
  /* 1451 */ 8, 8, 7, 8, 8, 7, 7, 7, 7, 7, 8, 7, 8, 7, 8, 7, 8, 7, 7, 7, 8, 7, 7, 7, 7, 7, 7, 7, 63, 63, 7, 64, 64, 7,
  /* 1485 */ 7, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 1, 7, 63, 63, 7, 7, 63, 63, 7, 8, 8, 8, 1, 7, 7, 7, 7, 63, 7, 8, 7, 7, 7,
  /* 1519 */ 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 7, 63, 63, 63, 7, 8, 8, 8
];

ES5Parser.MAP2 =
[
  /*  0 */ 57344, 65279, 65280, 65536, 65278, 65279, 65533, 1114111, 7, 1, 7, 7
];

ES5Parser.INITIAL =
[
  /*  0 */ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
  /* 29 */ 30, 31, 32, 33, 34
];

ES5Parser.TRANSITION =
[
  /*    0 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /*   18 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /*   36 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /*   54 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4224, 4224, 4224, 4224, 4240, 4636, 4273, 6203,
  /*   72 */ 4251, 4636, 4636, 4338, 5049, 4266, 4362, 4361, 4638, 4328, 4283, 4636, 5006, 4636, 4322, 4634, 4636, 4636,
  /*   90 */ 4376, 4291, 4308, 4636, 4316, 4639, 4636, 4270, 4336, 4346, 4659, 4360, 4670, 4419, 4440, 4415, 4370, 4258,
  /*  108 */ 4388, 4402, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /*  126 */ 4274, 4274, 4224, 4224, 4224, 4224, 4240, 4636, 4273, 4274, 4243, 4636, 4636, 4338, 4274, 4411, 4362, 4361,
  /*  144 */ 4638, 4328, 4325, 4636, 5006, 4636, 4322, 4634, 4636, 4636, 4376, 4291, 4427, 4636, 4316, 4639, 4636, 4270,
  /*  162 */ 4336, 4346, 4659, 4360, 4670, 4419, 4440, 4415, 4370, 4258, 4388, 4402, 4274, 4274, 4274, 4274, 4274, 4274,
  /*  180 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4224, 4224, 4224, 4224, 4230, 4274,
  /*  198 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /*  216 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /*  234 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /*  252 */ 4274, 4274, 4274, 4274, 4224, 4224, 4224, 4224, 4240, 4636, 4273, 4274, 4243, 4636, 4636, 4338, 4274, 4411,
  /*  270 */ 4362, 4361, 4638, 6052, 4325, 4636, 5006, 4636, 4322, 4634, 4636, 4636, 4376, 4274, 4427, 4636, 4316, 4639,
  /*  288 */ 4636, 4270, 4336, 4346, 4659, 4360, 4670, 4419, 4440, 4415, 4370, 4258, 4388, 4402, 4274, 4274, 4274, 4274,
  /*  306 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 6138, 6142,
  /*  324 */ 4435, 4636, 4273, 6203, 4251, 4636, 4636, 4338, 5049, 4266, 4362, 4361, 4638, 4328, 4283, 4636, 5006, 4636,
  /*  342 */ 4322, 4634, 4636, 4636, 4376, 4291, 4308, 4636, 4316, 4639, 4636, 4270, 4336, 4346, 4659, 4360, 4670, 4419,
  /*  360 */ 4440, 4415, 4370, 4258, 4388, 4402, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /*  378 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4403, 4448, 4449, 4457, 4636, 4273, 4465, 4251, 4636, 4636, 4338,
  /*  396 */ 5049, 4266, 4362, 4361, 4638, 4328, 4283, 4636, 5006, 4636, 4322, 4634, 4636, 4636, 4376, 4476, 4308, 4636,
  /*  414 */ 4316, 4639, 4636, 4270, 4336, 4346, 4659, 4360, 4670, 4419, 4440, 4415, 4370, 4258, 4388, 4402, 4274, 4274,
  /*  432 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /*  450 */ 4274, 4274, 4549, 4636, 4273, 6203, 4251, 4636, 4636, 4338, 5049, 4266, 4362, 4361, 4638, 4328, 4283, 4636,
  /*  468 */ 5006, 4636, 4322, 4634, 4636, 4636, 4376, 4291, 4308, 4636, 4316, 4639, 4636, 4270, 4336, 4346, 4659, 4360,
  /*  486 */ 4670, 4419, 4440, 4415, 4370, 4258, 4388, 4402, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /*  504 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 6018, 5250, 4839, 5574, 5602, 5574, 6018, 5487, 5600, 5574,
  /*  522 */ 5574, 6206, 5049, 4494, 5574, 5574, 4508, 4328, 5254, 5574, 5574, 5574, 6973, 4506, 5574, 5574, 6869, 4291,
  /*  540 */ 4518, 5574, 5574, 4842, 5574, 4510, 4275, 5574, 5574, 4914, 4509, 6258, 5574, 6342, 5574, 6257, 4915, 6870,
  /*  558 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /*  576 */ 4274, 4274, 4274, 4274, 4530, 4636, 4273, 6203, 4251, 4636, 4636, 4338, 5049, 4266, 4362, 4361, 4638, 4328,
  /*  594 */ 4283, 4636, 5006, 4636, 4322, 4634, 4636, 4636, 4376, 4291, 4308, 4636, 4316, 4639, 4636, 4270, 4336, 4346,
  /*  612 */ 4659, 4360, 4670, 4419, 4440, 4415, 4370, 4258, 4388, 4402, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /*  630 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4538, 4636, 4273, 6203,
  /*  648 */ 4251, 4636, 4636, 4546, 4557, 4266, 4362, 4361, 4638, 4328, 4283, 4636, 5006, 4636, 4322, 4634, 4636, 4636,
  /*  666 */ 4376, 4291, 4308, 4636, 4316, 4639, 4636, 4270, 4336, 4346, 4659, 4360, 4670, 4419, 4440, 4415, 4370, 4258,
  /*  684 */ 4388, 4402, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /*  702 */ 4274, 4274, 4274, 6871, 4574, 4575, 4583, 4636, 4273, 4591, 4251, 4636, 4636, 4338, 5049, 4266, 4362, 4361,
  /*  720 */ 4638, 4328, 4283, 4636, 5006, 4636, 4322, 4634, 4636, 4636, 4376, 4602, 4308, 4636, 4316, 4639, 4636, 4270,
  /*  738 */ 4336, 4346, 4659, 4360, 4670, 4419, 4440, 4415, 4370, 4258, 4388, 4402, 4274, 4274, 4274, 4274, 4274, 4274,
  /*  756 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4938, 4939, 5201, 5204, 4615, 4636,
  /*  774 */ 4273, 6203, 4251, 4636, 4636, 4338, 5049, 4266, 4362, 4361, 4638, 4328, 4283, 4636, 5006, 4636, 4322, 4634,
  /*  792 */ 4636, 4636, 4376, 4291, 4308, 4636, 4316, 4639, 4636, 4270, 4336, 4346, 4659, 4360, 4670, 4419, 4440, 4415,
  /*  810 */ 4370, 4258, 4388, 4402, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /*  828 */ 4274, 4274, 4274, 4274, 6515, 5045, 6513, 4274, 4623, 4636, 4273, 6203, 4251, 4636, 4636, 4338, 5049, 4266,
  /*  846 */ 4362, 4361, 4638, 4328, 4283, 4636, 5006, 4636, 4322, 4634, 4636, 4636, 4376, 4291, 4308, 4636, 4316, 4639,
  /*  864 */ 4636, 4270, 4336, 4346, 4659, 4360, 4670, 4419, 4440, 4415, 4370, 4258, 4388, 4402, 4274, 4274, 4274, 4274,
  /*  882 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /*  900 */ 4631, 4636, 4273, 6203, 4647, 4636, 4636, 4338, 4380, 4655, 4362, 4361, 4638, 4328, 4283, 4636, 5006, 4636,
  /*  918 */ 4322, 4667, 4636, 4636, 4376, 4291, 4308, 4636, 4316, 4639, 4636, 4270, 4336, 4346, 4659, 4360, 4670, 4419,
  /*  936 */ 4440, 4415, 4370, 4258, 4388, 4402, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /*  954 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 7219, 7223, 4678, 4636, 4273, 6203, 4686, 4636, 4636, 4338,
  /*  972 */ 5880, 4266, 4362, 4361, 4638, 4328, 4694, 4636, 5006, 4636, 4322, 4634, 4636, 4636, 4376, 4291, 4308, 4636,
  /*  990 */ 4316, 4639, 4636, 4270, 4336, 4346, 4659, 4360, 4670, 4419, 4440, 4415, 4370, 4258, 4388, 4402, 4274, 4274,
  /* 1008 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 5518,
  /* 1026 */ 5522, 5151, 4702, 4636, 4273, 6203, 4251, 4636, 4636, 4338, 5049, 4266, 4362, 4361, 4638, 4328, 4283, 4636,
  /* 1044 */ 5006, 4636, 4322, 4634, 4636, 4636, 4376, 4291, 4308, 4636, 4316, 4639, 4636, 4270, 4336, 4346, 4659, 4360,
  /* 1062 */ 4670, 4419, 4440, 4415, 4370, 4258, 4388, 4402, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 1080 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4296, 4300, 4710, 4636, 4273, 6203, 4718, 4636,
  /* 1098 */ 4636, 4338, 6005, 4266, 4362, 4361, 4638, 4328, 4694, 4636, 5006, 4636, 4322, 4634, 4636, 4636, 4376, 4291,
  /* 1116 */ 4308, 4636, 4316, 4639, 4636, 4270, 4336, 4346, 4659, 4360, 4670, 4419, 4440, 4415, 4370, 4258, 4388, 4402,
  /* 1134 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 1152 */ 4274, 4970, 4726, 4727, 4735, 4636, 4273, 4743, 4251, 4636, 4636, 4338, 5049, 4266, 4362, 4361, 4638, 4328,
  /* 1170 */ 4283, 4636, 5006, 4636, 4322, 4634, 4636, 4636, 4376, 4291, 4308, 4636, 4316, 4639, 4636, 4270, 4336, 4346,
  /* 1188 */ 4659, 4360, 4670, 4419, 4440, 4415, 4370, 4258, 4388, 4402, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 1206 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4760, 4760, 4765, 4768, 4776, 4636, 4273, 6203,
  /* 1224 */ 4784, 4636, 4636, 4338, 6898, 4266, 4362, 4361, 4638, 4328, 4792, 4636, 5006, 4636, 4322, 4800, 4636, 4636,
  /* 1242 */ 4376, 4291, 4308, 4636, 4316, 4639, 4636, 4270, 4336, 4346, 4659, 4360, 4670, 4419, 4440, 4415, 4370, 4258,
  /* 1260 */ 4388, 4402, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 1278 */ 4274, 4274, 4274, 4232, 4811, 4812, 4820, 5574, 6018, 4833, 5600, 5574, 5574, 6206, 5049, 4852, 5574, 5574,
  /* 1296 */ 6290, 4594, 4881, 5574, 5574, 5574, 6973, 4864, 5574, 5574, 5502, 4874, 4518, 5574, 5574, 4892, 5574, 5631,
  /* 1314 */ 5244, 5574, 5574, 5574, 6014, 7082, 5574, 4498, 5574, 6449, 4889, 6870, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 1332 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 6020, 4900, 4901, 4909, 5574,
  /* 1350 */ 6018, 4833, 5600, 5574, 5574, 6206, 5049, 4852, 5574, 5574, 6290, 4594, 4881, 5574, 5574, 5574, 6973, 4864,
  /* 1368 */ 5574, 5574, 5502, 4874, 4518, 5574, 5574, 4892, 5574, 5631, 5244, 5574, 5574, 5574, 6014, 7082, 5574, 4498,
  /* 1386 */ 5574, 6449, 4889, 6870, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 1404 */ 4274, 4274, 4274, 4274, 4274, 6020, 4900, 4901, 4909, 5574, 6018, 4833, 5600, 5574, 5574, 6206, 5049, 4852,
  /* 1422 */ 5574, 5574, 6290, 5097, 4881, 5574, 5574, 5574, 6973, 4864, 5574, 5574, 5502, 4874, 4518, 5574, 5574, 4892,
  /* 1440 */ 5574, 5631, 5244, 5574, 5574, 5574, 6014, 7082, 5574, 4498, 5574, 6449, 4889, 6870, 4274, 4274, 4274, 4274,
  /* 1458 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4481, 4274, 4274, 4274,
  /* 1476 */ 4923, 4636, 4273, 6203, 4251, 4636, 4636, 4338, 5049, 4266, 4362, 4361, 4638, 4328, 4283, 4636, 5006, 4636,
  /* 1494 */ 4322, 4634, 4636, 4636, 4376, 4291, 4308, 4636, 4316, 4639, 4636, 4270, 4336, 4346, 4659, 4360, 4670, 4419,
  /* 1512 */ 4440, 4415, 4370, 4258, 4388, 4402, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 1530 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4931, 4947, 4953, 4636, 4273, 6203, 4251, 4636, 4636, 4338,
  /* 1548 */ 5049, 4266, 4362, 4361, 4638, 4328, 4283, 4636, 5006, 4636, 4322, 4634, 4636, 4636, 4376, 4291, 4308, 4636,
  /* 1566 */ 4316, 4639, 4636, 4270, 4336, 4346, 4659, 4360, 4670, 4419, 4440, 4415, 4370, 4258, 4388, 4402, 4274, 4274,
  /* 1584 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 1602 */ 4274, 4274, 4961, 4636, 4273, 6203, 4251, 4636, 4636, 5477, 5282, 4266, 4362, 4361, 4638, 4328, 4283, 4636,
  /* 1620 */ 5006, 4636, 4322, 4634, 4636, 4636, 4376, 4291, 4308, 4636, 4316, 4639, 4636, 4270, 4336, 4346, 4659, 4360,
  /* 1638 */ 4670, 4419, 4440, 4415, 4370, 4258, 4388, 4402, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 1656 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4969, 5532, 4978, 4636, 4273, 6203, 4251, 4636,
  /* 1674 */ 4636, 4986, 4994, 5002, 4362, 4361, 4638, 4328, 4283, 4636, 5006, 4636, 4394, 4634, 4636, 4636, 4376, 4291,
  /* 1692 */ 4308, 4636, 4316, 4803, 4636, 4270, 4336, 4346, 4659, 4360, 4670, 4419, 4440, 4415, 4370, 4258, 4388, 4402,
  /* 1710 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 1728 */ 4274, 4274, 4274, 4274, 5014, 4636, 4273, 6203, 4251, 4636, 4636, 4486, 5167, 4266, 4362, 4361, 4638, 4328,
  /* 1746 */ 4283, 4636, 5006, 4636, 4352, 4634, 4636, 4636, 4376, 4291, 4308, 4636, 4316, 4639, 4636, 4270, 4336, 4346,
  /* 1764 */ 4659, 4360, 4670, 4419, 4440, 4415, 4370, 4258, 4388, 4402, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 1782 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 5022, 4636, 4273, 6203,
  /* 1800 */ 4251, 4636, 4636, 4338, 5049, 4266, 4362, 4361, 4638, 4328, 4283, 4636, 5006, 4636, 4322, 4634, 4636, 4636,
  /* 1818 */ 4376, 4291, 4308, 4636, 4316, 4639, 4636, 4270, 4336, 4346, 4659, 4360, 4670, 4419, 4440, 4415, 4370, 4258,
  /* 1836 */ 4388, 4402, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 1854 */ 4274, 4274, 6018, 5250, 4839, 5574, 5602, 5574, 6018, 5487, 5600, 5574, 5574, 6206, 5049, 4852, 5574, 5574,
  /* 1872 */ 6290, 4328, 5030, 5574, 5574, 5574, 6973, 4864, 5574, 5574, 5502, 5038, 4518, 5574, 5574, 4892, 5574, 5631,
  /* 1890 */ 5244, 5574, 5574, 5574, 6014, 7082, 5574, 4498, 5574, 6449, 4889, 6870, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 1908 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 6018, 5250, 4839, 5574, 5602, 5574,
  /* 1926 */ 6018, 6831, 5600, 5574, 5574, 6206, 5049, 4852, 5574, 5574, 6290, 4468, 5030, 5574, 5574, 5574, 6973, 4864,
  /* 1944 */ 5574, 5574, 5502, 5038, 4518, 5574, 5574, 4892, 5574, 5631, 5244, 5574, 5574, 5574, 6014, 7082, 5574, 4498,
  /* 1962 */ 5574, 6449, 4889, 6870, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 1980 */ 4274, 4274, 4274, 4274, 6018, 5250, 4839, 5574, 5602, 5574, 6018, 5057, 5600, 5574, 5574, 6206, 5049, 4494,
  /* 1998 */ 5574, 5574, 4508, 4328, 5254, 5574, 5574, 5574, 6973, 4506, 5574, 5574, 6869, 4291, 4518, 5574, 5574, 4842,
  /* 2016 */ 5574, 4510, 4275, 5574, 5574, 4914, 4509, 6258, 5574, 6342, 5574, 6257, 4915, 6870, 4274, 4274, 4274, 4274,
  /* 2034 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 6303, 6306,
  /* 2052 */ 5071, 4636, 4273, 6203, 5079, 4636, 4636, 4338, 6737, 4266, 4362, 4361, 4638, 4328, 5087, 4636, 5006, 4636,
  /* 2070 */ 4322, 4634, 4636, 4636, 4376, 4291, 4308, 4636, 4316, 4639, 4636, 4270, 4336, 4346, 4659, 4360, 4670, 4419,
  /* 2088 */ 4440, 4415, 4370, 4258, 4388, 4402, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 2106 */ 4274, 4274, 4274, 4274, 4274, 4274, 5095, 5105, 5111, 5114, 5122, 5185, 5149, 5135, 5142, 5185, 5185, 5264,
  /* 2124 */ 6333, 5159, 5313, 5312, 5187, 4328, 5175, 5185, 5335, 5185, 5238, 5183, 5185, 5185, 5278, 5196, 5212, 5185,
  /* 2142 */ 5232, 5188, 5185, 5163, 5262, 5272, 5224, 5290, 5127, 5298, 5219, 5294, 5306, 5321, 5329, 5343, 4274, 4274,
  /* 2160 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 2178 */ 5585, 4274, 5352, 4636, 4273, 6203, 4251, 4636, 4636, 4338, 5049, 4266, 4362, 4361, 4638, 4328, 7193, 4636,
  /* 2196 */ 5006, 4636, 4322, 4634, 4636, 4636, 4376, 4291, 4308, 4636, 4316, 4639, 4636, 4270, 4336, 4346, 4659, 4360,
  /* 2214 */ 4670, 4419, 4440, 4415, 4370, 4258, 4388, 4402, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 2232 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 5360, 4636, 4273, 6203, 4251, 4636,
  /* 2250 */ 4636, 4338, 5049, 4266, 4362, 4361, 4638, 4328, 4283, 4636, 5006, 4636, 4322, 4634, 4636, 4636, 4376, 4291,
  /* 2268 */ 4308, 4636, 4316, 4639, 4636, 4270, 4336, 4346, 4659, 4360, 4670, 4419, 4440, 4415, 4370, 4258, 4388, 4402,
  /* 2286 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 2304 */ 6018, 5250, 4839, 5574, 4844, 5368, 5381, 5487, 5389, 5410, 5402, 6206, 5049, 5424, 5574, 5574, 6290, 4328,
  /* 2322 */ 5030, 5574, 5574, 5574, 6973, 5442, 5453, 5574, 5873, 5470, 4518, 7108, 5574, 5495, 5574, 5513, 5244, 5574,
  /* 2340 */ 5574, 6846, 6014, 7082, 5574, 4498, 5574, 6449, 4889, 6870, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 2358 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 5530, 5540, 5063, 5554, 5560, 5574, 6018, 5487,
  /* 2376 */ 5600, 5574, 5574, 6206, 5049, 4852, 5573, 5574, 6290, 4328, 5030, 6720, 6181, 6218, 6973, 4864, 5574, 5574,
  /* 2394 */ 5502, 5038, 4518, 5574, 5574, 4892, 5574, 5631, 5244, 5574, 5574, 5574, 6014, 7082, 5574, 4498, 5574, 6449,
  /* 2412 */ 4889, 6870, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 2430 */ 4274, 4274, 5583, 5593, 5546, 5610, 5616, 5574, 6018, 5487, 5600, 5574, 5574, 6206, 5049, 4852, 5574, 5574,
  /* 2448 */ 6290, 4328, 5030, 5574, 5574, 5574, 6973, 5644, 6353, 5574, 7076, 5038, 5657, 5574, 5574, 4892, 5574, 5631,
  /* 2466 */ 5244, 5574, 6717, 5574, 6014, 7082, 5574, 5955, 5574, 5671, 4889, 6870, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 2484 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 5683, 5693, 5765, 5715, 5721, 5574,
  /* 2502 */ 6018, 5487, 5600, 5574, 5574, 6206, 5049, 4852, 5574, 5574, 6290, 4328, 5030, 5574, 5574, 5574, 6973, 4864,
  /* 2520 */ 5574, 5575, 5502, 5038, 4518, 6665, 5574, 4892, 5574, 5631, 5244, 5574, 5574, 5983, 6014, 7082, 5574, 4498,
  /* 2538 */ 5574, 6449, 4889, 6870, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 2556 */ 4274, 4274, 4274, 4274, 5748, 5759, 5932, 5935, 5773, 5802, 6018, 5781, 5789, 6235, 5434, 6206, 5049, 5797,
  /* 2574 */ 5574, 5574, 6290, 4468, 5030, 5574, 5815, 5574, 6973, 5825, 5837, 5373, 5707, 5038, 4518, 5854, 5574, 5866,
  /* 2592 */ 5574, 5649, 5244, 5574, 5731, 5574, 6014, 6987, 5574, 4498, 7104, 5396, 5897, 6870, 4274, 4274, 4274, 4274,
  /* 2610 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 5915, 5926, 6624, 5943,
  /* 2628 */ 5950, 6163, 6018, 5487, 5600, 6849, 5574, 5751, 5049, 4852, 5906, 5574, 6290, 6758, 5030, 5900, 5903, 6485,
  /* 2646 */ 6973, 4864, 5574, 5574, 5502, 5038, 4518, 5574, 5574, 4892, 5574, 5631, 5244, 5574, 5574, 5574, 6109, 6693,
  /* 2664 */ 5574, 4498, 5574, 6449, 5963, 6870, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 2682 */ 4274, 4274, 4274, 4274, 4274, 4274, 6018, 5250, 5971, 5574, 5602, 5574, 6018, 5487, 5600, 5574, 5574, 6206,
  /* 2700 */ 5049, 4494, 5574, 5574, 4508, 4328, 5254, 5574, 5574, 5574, 6973, 4506, 5574, 5574, 6869, 4291, 4518, 5574,
  /* 2718 */ 5574, 4842, 6287, 4510, 4275, 5574, 5982, 5565, 4509, 6258, 5991, 6342, 5574, 6257, 4915, 6870, 4274, 4274,
  /* 2736 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 6018, 5250,
  /* 2754 */ 4839, 5574, 5602, 6935, 6000, 5487, 7069, 6028, 6037, 6206, 5049, 4494, 5574, 5574, 4508, 4328, 5254, 5574,
  /* 2772 */ 5574, 5574, 6973, 4506, 5574, 5574, 6049, 4291, 4518, 5574, 7126, 4842, 5574, 6679, 4275, 5574, 5574, 4914,
  /* 2790 */ 4509, 6258, 6960, 6342, 5574, 6257, 4915, 6870, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 2808 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 6081, 6060, 6074, 6092, 6100, 6117, 6127, 5487, 6150, 6191,
  /* 2826 */ 5807, 6206, 5049, 4494, 5574, 5907, 6171, 6199, 5254, 6996, 6217, 6226, 6973, 4506, 5574, 5574, 6869, 4291,
  /* 2844 */ 4518, 5574, 5574, 4842, 6243, 4510, 4275, 4866, 5574, 4914, 6253, 6010, 5574, 6342, 5574, 6257, 4915, 6870,
  /* 2862 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 2880 */ 6018, 5250, 4839, 5574, 5602, 5574, 6018, 5487, 5600, 5574, 5574, 6206, 5049, 4494, 5574, 5574, 4508, 4328,
  /* 2898 */ 5254, 5574, 5574, 5574, 6973, 4506, 5574, 5574, 6869, 4291, 4518, 5574, 5574, 7085, 5574, 4510, 4275, 6578,
  /* 2916 */ 5574, 4914, 4509, 6258, 5574, 6342, 5574, 6257, 4915, 6870, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 2934 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 6018, 5250, 4839, 5574, 6502, 6271, 6018, 5487,
  /* 2952 */ 5600, 5736, 5740, 6206, 5049, 4494, 6266, 5846, 4508, 4328, 5254, 6280, 6105, 5992, 6973, 4506, 5574, 6484,
  /* 2970 */ 6298, 4291, 6314, 5574, 6409, 4842, 7136, 5829, 4275, 5574, 5574, 6322, 6341, 6350, 6041, 6342, 5574, 6257,
  /* 2988 */ 4915, 6870, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 3006 */ 4274, 4274, 6018, 5250, 4839, 5574, 5602, 5459, 6018, 5487, 5600, 6588, 5574, 5505, 5049, 4494, 5574, 5574,
  /* 3024 */ 4508, 4328, 5254, 5574, 5574, 5574, 6973, 4506, 6163, 5574, 6869, 4291, 4518, 5574, 5574, 4842, 5574, 4510,
  /* 3042 */ 4275, 5574, 5574, 4914, 4509, 6258, 5574, 6342, 5574, 6257, 4915, 6870, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 3060 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 6361, 6372, 6772, 6775, 6386, 6406,
  /* 3078 */ 6018, 5889, 5600, 6610, 6245, 5918, 5049, 6417, 5974, 6425, 4508, 5483, 5254, 6434, 6816, 5574, 6444, 4506,
  /* 3096 */ 5574, 5574, 6869, 4291, 4518, 5574, 5574, 4842, 6819, 4510, 4275, 5574, 5574, 5626, 6913, 4607, 6461, 6342,
  /* 3114 */ 5574, 6176, 4915, 6870, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 3132 */ 4274, 4274, 4274, 4274, 6018, 5250, 4839, 5574, 4825, 6469, 6018, 5487, 6477, 6493, 5663, 6206, 5049, 4494,
  /* 3150 */ 5574, 5574, 4508, 4328, 5254, 5574, 5574, 5574, 6973, 4506, 6231, 7154, 6869, 4291, 4518, 5574, 6391, 4842,
  /* 3168 */ 5574, 6733, 4275, 5726, 5574, 4914, 4509, 6258, 5574, 6567, 5574, 6257, 5416, 6870, 4274, 4274, 4274, 4274,
  /* 3186 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 6018, 5250, 4839, 5574,
  /* 3204 */ 5602, 5574, 6018, 5487, 5600, 5574, 5574, 6206, 5049, 4494, 6395, 6398, 6499, 4328, 5254, 6029, 5574, 5574,
  /* 3222 */ 6973, 4506, 5574, 5574, 6869, 4291, 4518, 5574, 5574, 4842, 5574, 4510, 4275, 5574, 5574, 4914, 4509, 6258,
  /* 3240 */ 5574, 6342, 5574, 6257, 4915, 6870, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 3258 */ 4274, 4274, 4274, 4274, 4274, 4274, 6510, 6523, 6066, 6537, 6543, 6945, 6018, 5487, 6560, 6575, 6586, 6206,
  /* 3276 */ 5049, 4494, 5575, 5574, 6802, 4328, 5254, 6798, 5675, 6596, 6973, 4506, 5574, 5574, 6869, 4291, 4518, 5574,
  /* 3294 */ 5574, 4842, 6746, 6329, 4275, 5574, 6608, 4914, 4509, 6258, 5574, 6342, 5574, 6917, 4915, 6870, 4274, 4274,
  /* 3312 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 6639, 6618,
  /* 3330 */ 6632, 6650, 6656, 5574, 6018, 5487, 5600, 5574, 5574, 6206, 5049, 6673, 6859, 6699, 4508, 5885, 5254, 5574,
  /* 3348 */ 5574, 6963, 6687, 6710, 5574, 6161, 6869, 4291, 6728, 6745, 5574, 4842, 5574, 4510, 4275, 5574, 5574, 4914,
  /* 3366 */ 4509, 6258, 5574, 6342, 5574, 6257, 4915, 6870, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 3384 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 6754, 6766, 7010, 6783, 6789, 5574, 6018, 5487, 5600, 5574,
  /* 3402 */ 5574, 6206, 5049, 6810, 6600, 4856, 6453, 6827, 5636, 5574, 6272, 5858, 6973, 6839, 6426, 5842, 6869, 4291,
  /* 3420 */ 4518, 5462, 6157, 7033, 6857, 6867, 5344, 6794, 5574, 4914, 4509, 6258, 5574, 4522, 6702, 6257, 4915, 6870,
  /* 3438 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 3456 */ 6018, 5250, 4839, 5574, 5621, 6879, 6894, 5487, 6906, 6886, 6884, 6206, 5049, 4494, 6992, 5574, 6677, 6084,
  /* 3474 */ 5254, 6185, 5574, 6188, 6973, 6925, 5574, 6933, 6869, 4291, 4518, 7117, 6943, 4842, 6661, 4510, 6953, 5574,
  /* 3492 */ 5817, 4914, 4509, 6258, 5574, 6971, 7151, 6257, 4915, 6870, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 3510 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 6981, 7004, 6378, 7018, 7024, 5574, 6018, 5487,
  /* 3528 */ 5600, 5574, 5574, 6206, 5049, 4494, 5574, 5574, 4508, 4328, 5254, 5574, 5574, 5574, 6973, 4506, 5574, 5574,
  /* 3546 */ 6869, 4291, 4518, 5574, 5574, 4842, 5574, 4510, 4275, 5574, 5574, 4914, 4509, 6258, 5574, 6342, 5574, 6257,
  /* 3564 */ 4915, 6870, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 3582 */ 4274, 4274, 7041, 7062, 6529, 7093, 7099, 6552, 6018, 5487, 5600, 5574, 7116, 6206, 5049, 4494, 5574, 6162,
  /* 3600 */ 4508, 4328, 5254, 6549, 5574, 5574, 6973, 4506, 5574, 5574, 6869, 4291, 4518, 5574, 5574, 4842, 5574, 4510,
  /* 3618 */ 4275, 5574, 7029, 4914, 4509, 6258, 5574, 6342, 5574, 6257, 4915, 6870, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 3636 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 6018, 5250, 4839, 5574, 5602, 7125,
  /* 3654 */ 6018, 5057, 5600, 5574, 6436, 6206, 5049, 4494, 5574, 5574, 4508, 6364, 5254, 5574, 5574, 5574, 6973, 4506,
  /* 3672 */ 5574, 5574, 6869, 4291, 4518, 5574, 5574, 4842, 5574, 4510, 4275, 5574, 5574, 4914, 4509, 6258, 5574, 6342,
  /* 3690 */ 5574, 6257, 4915, 6870, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 3708 */ 4274, 4274, 4274, 4274, 6018, 5250, 4839, 5574, 5602, 5445, 6018, 5487, 5700, 7135, 7134, 6206, 5049, 4494,
  /* 3726 */ 5574, 5574, 5827, 4328, 5254, 6160, 5574, 5431, 6973, 4506, 5574, 5574, 6869, 4291, 4518, 5574, 5574, 4842,
  /* 3744 */ 5574, 4510, 4275, 5574, 5574, 4914, 4509, 6258, 5574, 7144, 6119, 6257, 4915, 6870, 4274, 4274, 4274, 4274,
  /* 3762 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 5685, 4274, 4749, 4752,
  /* 3780 */ 7162, 4636, 4273, 6203, 4251, 4636, 4636, 4338, 5049, 4266, 4362, 4361, 4638, 4328, 4283, 4636, 5006, 4636,
  /* 3798 */ 4322, 4634, 4636, 4636, 4376, 4291, 4308, 4636, 4316, 4639, 4636, 4270, 4336, 4346, 4659, 4360, 4670, 4419,
  /* 3816 */ 4440, 4415, 4370, 4258, 4388, 4402, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 3834 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 7170, 4636, 4273, 6203, 4251, 4636, 4636, 6642,
  /* 3852 */ 5049, 7178, 4362, 4361, 4638, 4328, 4283, 4636, 5006, 4636, 4322, 4634, 4636, 4636, 4376, 4291, 4308, 4636,
  /* 3870 */ 4316, 4639, 4636, 4270, 4336, 4346, 4659, 4360, 4670, 4419, 4440, 4415, 4370, 4258, 4388, 4402, 4274, 4274,
  /* 3888 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 7186,
  /* 3906 */ 6134, 7048, 7054, 4636, 4273, 6203, 4251, 4636, 4636, 4338, 5049, 4266, 4362, 4361, 4638, 4328, 4283, 4636,
  /* 3924 */ 5006, 4636, 4322, 4634, 4636, 4636, 4376, 4291, 4308, 4636, 4316, 4639, 4636, 4270, 4336, 4346, 4659, 4360,
  /* 3942 */ 4670, 4419, 4440, 4415, 4370, 4258, 4388, 4402, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 3960 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4562, 4566, 7201, 4636, 4273, 6203, 4251, 4636,
  /* 3978 */ 4636, 4338, 5049, 4266, 4362, 4361, 4638, 4328, 4283, 4636, 5006, 4636, 4322, 4634, 4636, 4636, 4376, 4291,
  /* 3996 */ 4308, 4636, 4316, 4639, 4636, 4270, 4336, 4346, 4659, 4360, 4670, 4419, 4440, 4415, 4370, 4258, 4388, 4402,
  /* 4014 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 4032 */ 4274, 4274, 4274, 4274, 6209, 5574, 6018, 5487, 5600, 5574, 5574, 6206, 5049, 4494, 5574, 5574, 4508, 4328,
  /* 4050 */ 5254, 5574, 5574, 5574, 6973, 4506, 5574, 5574, 6869, 4291, 4518, 5574, 5574, 4842, 5574, 4510, 4275, 5574,
  /* 4068 */ 5574, 4914, 4509, 6258, 5574, 6342, 5574, 6257, 4915, 6870, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 4086 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4224, 4224, 4224, 4224, 4240, 4636, 4273, 4274,
  /* 4104 */ 4243, 4636, 4636, 4338, 4274, 4411, 4362, 4361, 4638, 4328, 4325, 4636, 5006, 4636, 4322, 4634, 4636, 4636,
  /* 4122 */ 4376, 4274, 4427, 4636, 4316, 4639, 4636, 4270, 4336, 4346, 4659, 4360, 4670, 4419, 4440, 4415, 4370, 4258,
  /* 4140 */ 4388, 4402, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 4158 */ 4274, 4274, 4274, 4274, 4274, 7209, 7215, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 4176 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 4194 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274,
  /* 4212 */ 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 4274, 5632, 5632, 5632, 5632, 5632, 5632,
  /* 4230 */ 5632, 5632, 0, 0, 0, 0, 0, 0, 0, 4669, 5632, 5632, 67072, 0, 0, 67072, 67072, 67072, 0, 0, 67072, 0, 150,
  /* 4253 */ 67072, 67072, 67072, 0, 0, 67072, 98304, 96256, 0, 67072, 67072, 67072, 96256, 0, 106, 6251, 0, 67072,
  /* 4271 */ 67072, 67072, 67072, 0, 0, 0, 0, 0, 0, 0, 0, 35, 0, 0, 100864, 0, 0, 150, 151, 150, 0, 58, 0, 0, 59, 0, 0,
  /* 4298 */ 0, 0, 14919, 14919, 14919, 14919, 14919, 14919, 14919, 14919, 99840, 102912, 0, 151, 67072, 67072, 101888,
  /* 4315 */ 67072, 98816, 67072, 67072, 67072, 104960, 105984, 67072, 67072, 0, 0, 0, 100864, 0, 0, 0, 0, 0, 58, 59, 0,
  /* 4336 */ 94208, 0, 0, 0, 0, 0, 0, 67072, 0, 0, 67584, 103936, 68096, 67072, 67072, 106496, 67072, 67072, 0, 0,
  /* 4356 */ 24576, 100864, 0, 24830, 97792, 67072, 67072, 0, 67072, 67072, 67072, 67072, 67072, 67072, 96768, 105472,
  /* 4372 */ 67072, 67072, 102400, 103424, 67072, 67072, 0, 105984, 0, 0, 0, 0, 106, 0, 0, 0, 98304, 67072, 0, 99328,
  /* 4392 */ 95232, 95744, 67072, 67072, 7680, 22016, 0, 100864, 19968, 24064, 101376, 0, 0, 0, 0, 0, 0, 0, 58, 0, 106,
  /* 4413 */ 0, 0, 67072, 67072, 67072, 67072, 0, 0, 0, 67072, 67072, 67072, 93696, 67072, 99840, 102912, 0, 0, 67072,
  /* 4432 */ 67072, 101888, 67072, 6745, 6745, 67072, 0, 0, 67072, 67072, 67072, 104448, 107008, 67072, 67072, 67072, 0,
  /* 4449 */ 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 67072, 0, 0, 67072, 67072, 67072, 0, 3584, 59, 0, 0, 0, 0, 0, 58,
  /* 4474 */ 59, 145, 0, 3584, 0, 0, 59, 0, 0, 0, 0, 17920, 0, 0, 0, 0, 23733, 67072, 0, 0, 0, 106, 6251, 0, 35, 35, 35,
  /* 4501 */ 35, 0, 0, 348, 35, 106, 0, 35, 35, 35, 35, 35, 35, 0, 0, 0, 0, 3122, 3122, 4323, 151, 35, 35, 35, 35, 0,
  /* 4527 */ 347, 0, 35, 8192, 8288, 67072, 0, 0, 67072, 67072, 67072, 9306, 9313, 67072, 0, 0, 67072, 67072, 67072, 0,
  /* 4547 */ 9728, 0, 0, 0, 67072, 0, 0, 67072, 67072, 67072, 9728, 0, 0, 0, 150, 0, 0, 0, 0, 45056, 45056, 45056,
  /* 4569 */ 45056, 45056, 45056, 45056, 45056, 0, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 67072, 0, 0, 67072, 67072,
  /* 4590 */ 67072, 0, 58, 3584, 0, 0, 0, 0, 0, 58, 59, 4752, 0, 58, 0, 0, 3584, 0, 0, 0, 35, 35, 35, 35, 339, 10752,
  /* 4616 */ 10752, 67072, 0, 0, 67072, 67072, 67072, 11264, 11264, 67072, 0, 0, 67072, 67072, 67072, 11776, 11874,
  /* 4633 */ 67072, 106, 0, 67072, 67072, 67072, 67072, 67072, 67072, 67072, 67072, 0, 0, 67072, 0, 106, 67072, 67072,
  /* 4651 */ 67072, 0, 0, 67072, 0, 185, 6251, 0, 67072, 67072, 67072, 67072, 67072, 107520, 94208, 67072, 185, 0,
  /* 4669 */ 67072, 67072, 67072, 67072, 67072, 67072, 0, 107008, 94720, 12870, 12899, 67072, 0, 0, 67072, 67072, 67072,
  /* 4686 */ 0, 150, 67072, 67072, 67072, 13312, 0, 67072, 224, 0, 100864, 0, 0, 150, 151, 150, 14336, 14336, 67072, 0,
  /* 4706 */ 0, 67072, 67072, 67072, 14919, 14948, 67072, 0, 0, 67072, 67072, 67072, 0, 150, 67072, 67072, 67072, 0,
  /* 4724 */ 15360, 67072, 0, 60, 60, 60, 60, 60, 60, 60, 60, 60, 16444, 67072, 0, 0, 67072, 67072, 67072, 0, 58, 59, 0,
  /* 4747 */ 4752, 4752, 0, 0, 0, 42496, 42496, 42496, 42496, 42496, 42496, 42496, 42496, 36, 36, 36, 36, 36, 36, 36,
  /* 4767 */ 36, 66, 66, 66, 66, 66, 66, 66, 66, 16962, 16997, 67072, 6251, 0, 67072, 67072, 67072, 0, 6251, 67072,
  /* 4787 */ 67072, 67072, 0, 0, 67072, 0, 0, 100864, 0, 0, 4323, 151, 150, 6144, 0, 67072, 67072, 67072, 67072, 67072,
  /* 4807 */ 67072, 25088, 0, 67072, 0, 4669, 4669, 4669, 4669, 4669, 4669, 4669, 4669, 4669, 4669, 35, 0, 0, 35, 35,
  /* 4827 */ 35, 0, 0, 35, 112, 114, 0, 58, 59, 4752, 0, 4670, 0, 3122, 3122, 35, 35, 35, 35, 35, 0, 0, 35, 110, 35, 0,
  /* 4853 */ 106, 6251, 186, 35, 35, 35, 35, 35, 202, 35, 35, 106, 255, 35, 35, 35, 35, 35, 35, 35, 320, 0, 58, 275,
  /* 4877 */ 276, 59, 277, 278, 4832, 5266, 0, 3122, 3122, 150, 151, 150, 35, 35, 4323, 35, 35, 35, 35, 35, 0, 300, 35,
  /* 4900 */ 0, 4670, 4670, 4670, 4670, 4670, 4670, 4670, 4670, 4670, 4670, 35, 0, 0, 35, 35, 35, 0, 35, 35, 35, 35, 35,
  /* 4923 */ 17920, 17920, 67072, 0, 0, 67072, 67072, 67072, 18432, 0, 0, 0, 0, 0, 18432, 0, 0, 10752, 0, 0, 0, 0, 0, 0,
  /* 4947 */ 18432, 18432, 18432, 18432, 18432, 18432, 18432, 18432, 67072, 0, 0, 67072, 67072, 67072, 19035, 19046,
  /* 4963 */ 67072, 0, 0, 67072, 67072, 67072, 20992, 0, 0, 0, 0, 0, 0, 0, 60, 92, 21084, 67072, 0, 0, 67072, 67072,
  /* 4985 */ 67072, 7347, 0, 20480, 21684, 23040, 67072, 0, 8704, 10240, 12288, 13824, 15872, 17558, 20480, 23040,
  /* 5001 */ 27648, 43520, 106, 6251, 0, 67072, 67072, 67072, 67072, 97280, 67072, 100352, 67072, 22621, 22631, 67072,
  /* 5017 */ 0, 0, 67072, 67072, 67072, 25600, 25600, 67072, 0, 0, 67072, 67072, 67072, 0, 5266, 0, 3122, 3122, 150,
  /* 5036 */ 151, 150, 0, 58, 275, 276, 59, 277, 278, 0, 0, 11264, 11264, 0, 0, 0, 0, 150, 0, 0, 0, 0, 58, 59, 0, 146,
  /* 5062 */ 0, 0, 3122, 3122, 38, 38, 38, 38, 38, 26112, 26112, 67072, 0, 0, 67072, 67072, 67072, 0, 151, 67072, 67072,
  /* 5083 */ 67072, 0, 0, 67072, 0, 0, 100864, 0, 0, 151, 151, 150, 37, 51, 0, 0, 0, 0, 0, 0, 0, 4752, 0, 37, 37, 0, 0,
  /* 5110 */ 0, 0, 51, 51, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 67109, 0, 0, 67109, 67109, 67109, 67109, 67109, 0,
  /* 5133 */ 107008, 94720, 0, 142, 143, 0, 0, 0, 0, 51, 152, 67109, 67109, 67109, 0, 0, 67109, 51, 0, 0, 0, 0, 0, 0, 0,
  /* 5158 */ 14336, 0, 106, 6251, 0, 67109, 67109, 67109, 67109, 0, 0, 0, 0, 150, 0, 23736, 0, 0, 0, 100864, 51, 51,
  /* 5180 */ 152, 228, 150, 106, 0, 67109, 67109, 67109, 67109, 67109, 67109, 67109, 67109, 0, 0, 67109, 0, 142, 0, 0,
  /* 5200 */ 143, 0, 0, 0, 10752, 10752, 10752, 10752, 10752, 10752, 10752, 10752, 99891, 102963, 279, 151, 67109,
  /* 5217 */ 67109, 101925, 67109, 67109, 67109, 104485, 107045, 67109, 67109, 67109, 67109, 67109, 107557, 94245,
  /* 5231 */ 67109, 98853, 67109, 67109, 67109, 104997, 106021, 67109, 67109, 0, 0, 0, 100901, 0, 0, 220, 58, 223, 59,
  /* 5250 */ 0, 35, 35, 0, 0, 0, 0, 3122, 3122, 150, 151, 150, 94208, 0, 0, 0, 0, 0, 0, 67109, 0, 0, 67621, 103973,
  /* 5274 */ 68133, 67109, 67109, 106533, 67109, 67109, 0, 105984, 0, 0, 0, 0, 150, 19639, 0, 0, 97829, 67109, 67109, 0,
  /* 5294 */ 67109, 67109, 67109, 67109, 0, 0, 0, 67109, 67109, 67109, 93733, 67109, 96805, 105509, 67109, 67109,
  /* 5310 */ 102437, 103461, 67109, 67109, 37, 67109, 67109, 67109, 67109, 67109, 67109, 67109, 98304, 96256, 0, 67109,
  /* 5326 */ 67109, 67109, 96293, 98341, 67109, 0, 99365, 95269, 95781, 67109, 67109, 67109, 67109, 97317, 67109,
  /* 5341 */ 100389, 67109, 101413, 0, 0, 0, 0, 0, 0, 0, 316, 26624, 26624, 67072, 0, 0, 67072, 67072, 67072, 27136,
  /* 5361 */ 27240, 67072, 0, 0, 67072, 67072, 67072, 35, 118, 35, 35, 35, 35, 35, 120, 35, 35, 35, 268, 35, 35, 3122,
  /* 5383 */ 0, 136, 0, 138, 0, 140, 3122, 150, 153, 35, 35, 0, 0, 35, 0, 0, 355, 35, 357, 35, 35, 172, 35, 175, 35, 35,
  /* 5409 */ 153, 35, 120, 35, 110, 35, 153, 35, 35, 0, 35, 35, 35, 360, 35, 0, 106, 6251, 186, 35, 35, 190, 35, 35,
  /* 5433 */ 245, 35, 35, 35, 35, 35, 176, 35, 35, 106, 255, 256, 35, 35, 35, 35, 35, 35, 131, 35, 260, 35, 35, 35, 35,
  /* 5458 */ 264, 35, 35, 122, 35, 35, 35, 35, 35, 35, 288, 35, 274, 58, 275, 276, 59, 277, 278, 0, 0, 19456, 0, 0,
  /* 5482 */ 67072, 0, 0, 215, 0, 0, 58, 59, 0, 0, 0, 0, 3122, 35, 296, 35, 298, 35, 0, 300, 35, 35, 269, 0, 0, 0, 0, 0,
  /* 5510 */ 122, 0, 0, 35, 307, 35, 35, 310, 0, 0, 0, 14336, 14336, 0, 0, 0, 0, 0, 0, 14336, 38, 3122, 0, 0, 0, 0, 0,
  /* 5537 */ 0, 0, 20992, 0, 38, 38, 0, 0, 0, 0, 3122, 3122, 39, 39, 39, 39, 39, 75, 75, 75, 75, 75, 75, 75, 75, 35, 0,
  /* 5564 */ 0, 35, 35, 35, 0, 35, 203, 35, 35, 192, 35, 35, 35, 35, 35, 35, 35, 35, 114, 39, 3122, 0, 0, 0, 0, 0, 0, 0,
  /* 5592 */ 26624, 0, 39, 39, 0, 0, 54, 56, 3122, 150, 35, 35, 35, 0, 0, 35, 35, 35, 76, 76, 76, 85, 85, 85, 85, 85,
  /* 5618 */ 35, 0, 0, 35, 35, 35, 0, 108, 35, 35, 35, 0, 329, 35, 35, 35, 35, 310, 0, 0, 0, 3297, 3298, 150, 151, 150,
  /* 5644 */ 106, 255, 35, 35, 210, 35, 35, 35, 35, 310, 311, 0, 0, 3122, 3122, 4323, 151, 35, 280, 35, 35, 161, 35,
  /* 5667 */ 163, 165, 35, 166, 354, 0, 0, 355, 35, 35, 35, 35, 35, 241, 35, 35, 40, 3122, 0, 0, 0, 0, 0, 0, 0, 42496,
  /* 5693 */ 0, 40, 40, 0, 0, 0, 57, 3122, 150, 35, 35, 131, 0, 0, 35, 35, 269, 0, 0, 0, 0, 273, 77, 77, 77, 77, 86, 86,
  /* 5721 */ 86, 86, 35, 0, 0, 35, 35, 35, 35, 318, 35, 35, 35, 35, 325, 35, 35, 35, 111, 35, 35, 35, 35, 111, 35, 177,
  /* 5747 */ 35, 41, 3122, 0, 0, 0, 0, 0, 0, 167, 0, 0, 0, 41, 41, 0, 0, 0, 0, 3122, 3122, 40, 72, 72, 72, 72, 87, 87,
  /* 5775 */ 35, 0, 0, 35, 35, 113, 141, 58, 59, 0, 145, 145, 0, 3220, 3221, 150, 35, 155, 35, 0, 0, 159, 0, 106, 6251,
  /* 5800 */ 186, 187, 35, 35, 35, 124, 126, 35, 35, 35, 174, 35, 35, 35, 178, 35, 238, 35, 35, 35, 35, 35, 35, 35, 326,
  /* 5825 */ 106, 255, 35, 114, 35, 35, 35, 35, 0, 0, 0, 313, 35, 261, 35, 35, 263, 35, 35, 35, 189, 35, 35, 35, 35,
  /* 5850 */ 201, 35, 35, 35, 35, 283, 284, 285, 35, 35, 35, 35, 35, 248, 189, 35, 295, 35, 297, 35, 35, 0, 300, 35, 35,
  /* 5875 */ 269, 0, 0, 0, 272, 0, 0, 13312, 0, 150, 0, 0, 0, 216, 0, 58, 59, 0, 0, 0, 147, 3122, 35, 359, 4323, 35, 35,
  /* 5902 */ 35, 35, 35, 35, 193, 35, 35, 35, 35, 35, 35, 35, 204, 42, 3122, 0, 0, 0, 0, 0, 0, 182, 0, 0, 0, 42, 42, 0,
  /* 5930 */ 0, 55, 0, 3122, 3122, 41, 41, 41, 41, 41, 87, 87, 87, 78, 78, 78, 78, 78, 78, 88, 78, 78, 35, 0, 0, 35, 35,
  /* 5957 */ 35, 207, 0, 0, 348, 35, 35, 35, 4323, 35, 35, 35, 35, 361, 0, 3136, 3136, 35, 35, 35, 35, 35, 35, 198, 35,
  /* 5982 */ 321, 35, 35, 35, 35, 35, 35, 35, 205, 340, 35, 35, 35, 35, 35, 35, 35, 235, 133, 3122, 0, 0, 137, 0, 0, 0,
  /* 6008 */ 15360, 150, 0, 0, 0, 336, 35, 35, 35, 35, 35, 3122, 0, 0, 0, 0, 0, 0, 0, 4670, 157, 35, 35, 35, 35, 35, 35,
  /* 6035 */ 35, 236, 35, 170, 35, 173, 35, 35, 35, 35, 35, 343, 344, 35, 35, 114, 0, 0, 0, 0, 0, 0, 218, 221, 0, 0, 43,
  /* 6062 */ 43, 0, 0, 0, 0, 3122, 3122, 45, 45, 45, 45, 45, 63, 3122, 3122, 43, 43, 43, 43, 43, 3122, 0, 0, 0, 0, 0, 0,
  /* 6089 */ 219, 222, 0, 79, 79, 79, 79, 79, 79, 79, 79, 94, 94, 35, 0, 0, 35, 35, 35, 235, 35, 35, 35, 35, 114, 3122,
  /* 6115 */ 0, 0, 35, 119, 35, 35, 35, 35, 35, 35, 35, 353, 134, 3122, 0, 0, 0, 0, 139, 0, 0, 44544, 0, 0, 0, 0, 0,
  /* 6142 */ 6656, 6656, 6656, 6656, 6656, 6656, 6656, 6656, 3122, 150, 119, 35, 35, 0, 0, 35, 35, 291, 35, 35, 35, 35,
  /* 6164 */ 35, 114, 35, 35, 35, 35, 35, 205, 35, 35, 208, 209, 35, 0, 0, 0, 356, 35, 35, 35, 240, 35, 35, 35, 35, 35,
  /* 6190 */ 234, 35, 35, 35, 35, 35, 119, 35, 35, 213, 0, 0, 0, 0, 58, 59, 0, 0, 0, 0, 0, 35, 0, 0, 35, 35, 35, 237,
  /* 6218 */ 35, 35, 35, 35, 35, 35, 35, 240, 243, 233, 35, 35, 247, 35, 35, 35, 262, 35, 35, 35, 35, 164, 35, 35, 168,
  /* 6243 */ 35, 301, 35, 35, 35, 35, 35, 35, 116, 35, 35, 331, 35, 35, 35, 0, 0, 0, 35, 35, 35, 35, 35, 194, 35, 35,
  /* 6269 */ 35, 35, 115, 35, 35, 35, 35, 35, 35, 35, 242, 229, 35, 35, 232, 35, 35, 235, 35, 35, 302, 35, 35, 35, 35,
  /* 6294 */ 35, 35, 211, 0, 188, 35, 0, 0, 270, 0, 0, 0, 26112, 26112, 26112, 26112, 26112, 26112, 26112, 26112, 3122,
  /* 6315 */ 3122, 4323, 151, 35, 35, 35, 281, 35, 327, 35, 0, 35, 35, 257, 35, 35, 308, 35, 0, 0, 0, 0, 152, 0, 0, 0,
  /* 6341 */ 330, 35, 35, 35, 35, 0, 0, 0, 35, 333, 334, 0, 35, 35, 35, 35, 35, 35, 265, 35, 44, 3122, 0, 0, 0, 0, 0, 0,
  /* 6369 */ 220, 223, 0, 0, 44, 44, 0, 0, 0, 0, 3122, 3122, 48, 74, 74, 74, 74, 68, 68, 35, 0, 0, 35, 35, 35, 292, 35,
  /* 6396 */ 35, 35, 35, 196, 35, 35, 35, 35, 203, 35, 116, 35, 123, 35, 35, 35, 35, 35, 35, 293, 35, 0, 106, 6251, 0,
  /* 6421 */ 35, 35, 35, 191, 199, 35, 35, 35, 35, 35, 35, 35, 266, 35, 230, 35, 35, 35, 35, 35, 35, 117, 35, 35, 252,
  /* 6446 */ 0, 0, 0, 35, 0, 0, 355, 35, 35, 35, 35, 35, 210, 0, 0, 35, 341, 35, 35, 35, 35, 35, 345, 35, 120, 35, 35,
  /* 6473 */ 35, 35, 35, 132, 3122, 150, 120, 35, 35, 0, 0, 114, 35, 35, 35, 35, 35, 35, 35, 250, 35, 161, 35, 163, 165,
  /* 6498 */ 166, 35, 35, 207, 35, 35, 35, 0, 0, 35, 111, 35, 45, 3122, 0, 0, 0, 0, 0, 0, 11264, 0, 0, 0, 0, 0, 45, 45,
  /* 6526 */ 0, 0, 0, 0, 3122, 3122, 49, 49, 49, 49, 49, 80, 80, 80, 80, 80, 80, 80, 80, 35, 0, 0, 109, 35, 35, 231, 35,
  /* 6553 */ 35, 35, 35, 35, 128, 35, 35, 3122, 150, 35, 35, 158, 0, 0, 35, 35, 308, 35, 0, 0, 0, 349, 158, 35, 162, 35,
  /* 6579 */ 35, 35, 35, 35, 35, 319, 35, 35, 171, 35, 35, 35, 35, 35, 35, 122, 35, 35, 244, 35, 246, 35, 35, 35, 35,
  /* 6604 */ 197, 35, 35, 35, 35, 322, 35, 35, 35, 35, 35, 35, 123, 35, 0, 46, 46, 0, 0, 0, 0, 3122, 3122, 67, 67, 67,
  /* 6630 */ 67, 67, 0, 3137, 3137, 46, 46, 46, 46, 46, 3122, 0, 0, 0, 0, 0, 0, 67072, 44032, 0, 81, 81, 81, 81, 81, 81,
  /* 6656 */ 81, 81, 35, 0, 0, 35, 35, 35, 303, 35, 35, 35, 35, 286, 35, 35, 35, 0, 106, 6251, 0, 35, 188, 35, 35, 35,
  /* 6682 */ 35, 0, 0, 312, 0, 251, 35, 0, 0, 0, 253, 0, 0, 335, 35, 35, 338, 35, 35, 200, 35, 35, 35, 35, 35, 35, 352,
  /* 6709 */ 35, 106, 0, 35, 35, 35, 205, 257, 35, 35, 323, 35, 35, 35, 35, 35, 35, 192, 35, 3122, 3122, 4323, 151, 234,
  /* 6733 */ 35, 35, 35, 309, 0, 0, 0, 0, 151, 0, 0, 0, 282, 35, 35, 35, 35, 35, 257, 35, 35, 47, 3122, 0, 0, 0, 0, 0,
  /* 6761 */ 0, 217, 58, 59, 0, 0, 47, 47, 0, 0, 0, 0, 3122, 3122, 68, 68, 68, 68, 68, 68, 68, 68, 82, 82, 82, 82, 82,
  /* 6788 */ 82, 82, 82, 35, 0, 0, 35, 35, 35, 317, 35, 35, 35, 35, 206, 35, 35, 35, 35, 35, 0, 212, 0, 106, 6251, 0,
  /* 6814 */ 35, 189, 35, 35, 239, 35, 35, 35, 35, 35, 35, 304, 35, 0, 214, 0, 0, 0, 58, 59, 0, 145, 145, 0, 3122, 106,
  /* 6840 */ 0, 35, 35, 35, 35, 258, 35, 35, 328, 35, 35, 35, 35, 35, 35, 167, 35, 114, 35, 35, 35, 188, 35, 35, 35, 35,
  /* 6866 */ 35, 306, 35, 35, 35, 0, 0, 0, 0, 0, 0, 0, 59, 35, 121, 35, 125, 35, 127, 35, 35, 35, 35, 35, 35, 154, 35,
  /* 6893 */ 35, 35, 3122, 135, 0, 0, 0, 0, 0, 6251, 0, 0, 0, 3122, 150, 154, 156, 35, 0, 0, 35, 35, 332, 114, 35, 0, 0,
  /* 6920 */ 0, 35, 35, 358, 35, 106, 0, 35, 35, 35, 35, 35, 259, 35, 267, 35, 35, 35, 35, 35, 35, 129, 35, 35, 290, 35,
  /* 6946 */ 35, 35, 35, 35, 35, 130, 35, 0, 314, 0, 0, 0, 0, 315, 35, 35, 342, 35, 35, 35, 35, 35, 35, 249, 35, 188,
  /* 6972 */ 35, 35, 35, 0, 0, 0, 35, 0, 0, 48, 3122, 0, 0, 0, 52, 0, 0, 335, 35, 337, 35, 35, 35, 195, 35, 35, 35, 35,
  /* 7000 */ 233, 35, 35, 35, 0, 48, 48, 0, 0, 0, 0, 3122, 3122, 69, 73, 73, 73, 73, 83, 83, 83, 83, 83, 83, 83, 83, 35,
  /* 7027 */ 0, 0, 35, 35, 35, 324, 35, 35, 35, 35, 299, 0, 0, 35, 49, 3122, 0, 0, 0, 0, 53, 0, 0, 44544, 44544, 44544,
  /* 7053 */ 44544, 44544, 44544, 67072, 0, 0, 67072, 67072, 67072, 0, 49, 49, 0, 0, 0, 0, 3122, 150, 35, 35, 157, 0, 0,
  /* 7076 */ 35, 35, 269, 0, 0, 271, 0, 0, 335, 35, 35, 35, 35, 35, 0, 0, 114, 84, 84, 84, 84, 84, 84, 84, 84, 35, 0, 0,
  /* 7104 */ 35, 35, 35, 351, 35, 35, 35, 35, 35, 287, 35, 35, 169, 35, 35, 35, 35, 35, 35, 35, 289, 117, 35, 35, 35,
  /* 7129 */ 35, 35, 35, 35, 294, 35, 160, 35, 35, 35, 35, 35, 35, 35, 305, 35, 114, 35, 35, 346, 0, 0, 35, 35, 350, 35,
  /* 7155 */ 35, 35, 35, 35, 124, 35, 35, 42496, 42496, 67072, 0, 0, 67072, 67072, 67072, 43103, 43113, 67072, 0, 0,
  /* 7175 */ 67072, 67072, 67072, 44032, 106, 6251, 0, 67072, 67072, 67072, 67072, 44544, 0, 0, 0, 44544, 0, 44544, 0,
  /* 7194 */ 0, 100864, 0, 0, 150, 150, 150, 45056, 45056, 67072, 0, 0, 67072, 67072, 67072, 0, 1024, 0, 0, 0, 1024,
  /* 7215 */ 1024, 1024, 0, 0, 0, 0, 0, 0, 12870, 12870, 12870, 12870, 12870, 12870, 12870, 12870
];

ES5Parser.EXPECTED =
[
  /*   0 */ 136, 140, 144, 148, 152, 199, 158, 266, 164, 168, 214, 180, 184, 197, 199, 199, 200, 264, 206, 212, 199,
  /*  21 */ 225, 231, 198, 199, 199, 202, 287, 210, 170, 199, 154, 199, 201, 218, 222, 199, 199, 176, 174, 199, 172,
  /*  42 */ 199, 243, 228, 247, 381, 254, 258, 262, 340, 376, 380, 340, 300, 160, 270, 250, 279, 340, 340, 340, 378,
  /*  63 */ 340, 292, 239, 387, 284, 291, 340, 340, 376, 380, 340, 237, 339, 307, 340, 356, 296, 298, 304, 316, 340,
  /*  84 */ 322, 333, 318, 326, 330, 336, 413, 345, 348, 351, 354, 340, 414, 340, 275, 360, 367, 363, 279, 374, 340,
  /* 105 */ 340, 340, 385, 273, 189, 193, 391, 341, 340, 340, 340, 414, 340, 187, 191, 370, 394, 340, 280, 340, 400,
  /* 126 */ 404, 395, 340, 310, 408, 412, 312, 396, 234, 418, 420, 422, 427, 427, 581, 424, 426, 428, 431, 429, 433,
  /* 147 */ 435, 438, 437, 438, 439, 441, 515, 524, 524, 517, 524, 529, 530, 520, 520, 481, 483, 445, 449, 451, 514,
  /* 168 */ 528, 524, 527, 524, 524, 524, 520, 523, 524, 524, 529, 520, 456, 520, 494, 490, 460, 465, 446, 520, 495,
  /* 189 */ 520, 531, 493, 507, 542, 544, 520, 521, 508, 516, 524, 524, 524, 524, 530, 520, 520, 579, 497, 499, 500,
  /* 210 */ 498, 500, 528, 525, 527, 524, 524, 527, 520, 577, 577, 523, 526, 528, 524, 524, 528, 524, 524, 523, 524,
  /* 231 */ 524, 546, 494, 520, 497, 531, 520, 504, 520, 510, 513, 520, 517, 547, 524, 524, 517, 520, 494, 520, 520,
  /* 252 */ 531, 487, 553, 520, 457, 458, 469, 470, 472, 474, 476, 478, 520, 520, 492, 578, 443, 497, 519, 479, 485,
  /* 273 */ 520, 520, 574, 496, 576, 507, 489, 520, 520, 520, 490, 535, 519, 537, 492, 577, 577, 578, 539, 520, 520,
  /* 294 */ 520, 504, 463, 552, 520, 520, 505, 540, 511, 520, 452, 520, 520, 592, 558, 519, 491, 520, 531, 542, 520,
  /* 315 */ 501, 558, 519, 520, 520, 518, 552, 550, 552, 504, 540, 504, 555, 453, 557, 519, 551, 520, 452, 520, 520,
  /* 336 */ 462, 520, 555, 453, 520, 520, 520, 520, 447, 560, 541, 520, 541, 562, 564, 566, 568, 570, 570, 572, 520,
  /* 357 */ 520, 520, 549, 520, 583, 520, 533, 520, 520, 454, 585, 587, 589, 520, 522, 502, 594, 520, 591, 520, 520,
  /* 378 */ 520, 550, 461, 520, 520, 520, 467, 545, 491, 520, 520, 520, 592, 585, 580, 594, 596, 520, 520, 530, 520,
  /* 399 */ 532, 531, 506, 520, 543, 520, 547, 502, 596, 520, 547, 502, 491, 497, 520, 520, 520, 545, 491, 498, 530,
  /* 420 */ 3076, 3104, 1051648, 2100224, 2100228, 136317952, 134220800, 3072, 3072, 3936, 1052636, 134220800, 3936,
  /* 433 */ 856694748, 858791900, 856694748, 990912476, 856694748, 856694748, 856694750, 990912478, 997654494, -34, 768,
  /* 444 */ 256, 32, 2176, 0, 48, 20, 12, 20, 33554432, 67108864, 0, 56, 24576, 262144, 268697600, 268697608, 786432,
  /* 461 */ 8388608, 134217728, 0x80000000, 8388608, 100663296, 1610612736, -2130706432, 142606336, 269221888,
  /* 470 */ 910426120, 910426120, 918814728, 1053032456, 2126774280, -20709368, 2126774536, 2128527037, 2130706431, 0,
  /* 480 */ 160, 0, 41943040, 1006632960, 1073741824, 1536, 45056, 224, 126976, 2097152, 0, 65536, 0, 64, 0, 4, 256, 0,
  /* 498 */ 32, 32, 128, 128, 512, 2048, 0, 268435456, 0, 1024, 0, 2048, 4194304, 33554432, 872415232, 335544320,
  /* 514 */ 536870912, 4, 2048, 4, 0, 0x80000000, 0, 0, 1, 128, 4, 4, 12, 4, 20, 4, 32, 0, 2, 0, 3, 469762048,
  /* 536 */ 1073741824, 1024, 32768, 114688, 0, 4194304, 0, 8192, 32768, 0, 16384, 0, 128, 0, 16777216, 0x80000000,
  /* 552 */ 134217728, 0, 264, 0, 33554432, 0, 134217728, 1073741824, 65536, 262144, 16, 260, 4194564, 263234, 8692802,
  /* 567 */ 8692802, 8912587, 8912587, 13106891, 13106891, 15728379, 16776955, 16, 4, 2, 64, 64, 256, 512, 3072,
  /* 582 */ 1051652, 9216, 32768, 8, 128, 512, 15360, 49152, 196608, 3145728, 0, 8388608, 4096, 16384, 65536, 131072
];

ES5Parser.TOKEN =
[
  "(0)",
  "EOF",
  "Identifier",
  "'null'",
  "BooleanLiteral",
  "IdentifierName",
  "StringLiteral",
  "RegularExpressionLiteral",
  "DecimalLiteral",
  "HexIntegerLiteral",
  "WhiteSpace",
  "Comment",
  "'!'",
  "'!='",
  "'!=='",
  "'%'",
  "'%='",
  "'&'",
  "'&&'",
  "'&='",
  "'('",
  "')'",
  "'*'",
  "'*='",
  "'+'",
  "'++'",
  "'+='",
  "','",
  "'-'",
  "'--'",
  "'-='",
  "'.'",
  "'/'",
  "'/='",
  "':'",
  "';'",
  "'<'",
  "'<<'",
  "'<<='",
  "'<='",
  "'='",
  "'=='",
  "'==='",
  "'>'",
  "'>='",
  "'>>'",
  "'>>='",
  "'>>>'",
  "'>>>='",
  "'?'",
  "'['",
  "']'",
  "'^'",
  "'^='",
  "'break'",
  "'case'",
  "'catch'",
  "'continue'",
  "'debugger'",
  "'default'",
  "'delete'",
  "'do'",
  "'else'",
  "'finally'",
  "'for'",
  "'function'",
  "'get'",
  "'if'",
  "'in'",
  "'instanceof'",
  "'new'",
  "'return'",
  "'set'",
  "'switch'",
  "'this'",
  "'throw'",
  "'try'",
  "'typeof'",
  "'var'",
  "'void'",
  "'while'",
  "'with'",
  "'{'",
  "'|'",
  "'|='",
  "'||'",
  "'}'",
  "'~'"
];

// End
