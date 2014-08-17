/// <reference path="../../typings/parsers/ES5.d.ts" />

import ParseTreeHandler = require("./compiler/ParseTreeHandler");

class JSONiq {
    private query: string;

    constructor(query: string) {
        this.query = query;
    }

    compile() {
        var handler = new ParseTreeHandler();
        var parser = new ES5Parser(this.query, handler);
        parser.parse_Program();
    }
}

export = JSONiq;
