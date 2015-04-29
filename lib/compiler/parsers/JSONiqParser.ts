Usage: REx [OPTION]... [input-file]

  -ll NUM        use strong-LL(K) algorithm up to K=NUM (default 3)
  -backtrack     allow PEG-style backtracking for LL-conflicts
  -faster        optimize speed
  -smaller       optimize memory consumption
  -cpp           generate parser in C++
  -csharp        generate parser in C#
  -java          generate parser in Java
  -javascript    generate parser in JavaScript
  -typescript    generate parser in TypeScript
  -scala         generate parser in Scala
  -xquery        generate parser in XQuery
  -xslt          generate parser in XSLT
  -xml           create XML representation of grammar
  -asi           handle EcmaScript automatic semicolon insertion (LL(1) only)
  -saxon         generate Saxon 9.6 extension function (requires -java, too)
  -name NAME     use non-default class name, or XQuery/XSLT module namespace
  -tree          generate code for parse tree or parsing event handler
  -trace         generate code for tokenizer trace
  -main          generate simple main program
  -performance   generate performance test program
  -version       show REx version

