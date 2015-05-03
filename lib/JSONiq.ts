/// <reference path="../typings/tsd.d.ts" />
import JSONiqParser = require("./compiler/parsers/JSONiqParser");
import JSONParseTreeHandler = require("./compiler/parsers/JSONParseTreeHandler");

var handler = new JSONParseTreeHandler("1");
var parser = new JSONiqParser.Parser("1", handler);
parser.parse_XQuery();
console.log(handler.getParseTree());