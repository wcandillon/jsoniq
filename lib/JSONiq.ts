/// <reference path="../typings/tsd.d.ts" />
import JSONiqParser = require("./compiler/parsers/JSONiqParser");

var parser = new JSONiqParser.Parser("1", null);
parser.parse_XQuery();
