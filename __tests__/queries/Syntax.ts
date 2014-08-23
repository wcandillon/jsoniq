///<reference path='../../typings/jest/jest.d.ts'/>
/// <reference path="../../typings/lodash/lodash.d.ts" />
/// <reference path="../../typings/parsers/ES5.d.ts" />
jest.autoMockOff();
//import _ = require("lodash");
//import jerr = require("../lib/errors");
import JSONiq = require("../../lib/queries/JSONiq");
ES5Parser = require("../../../parsers/ES5").ES5Parser;

describe("Query Syntax", () => {
    it("Simple query", () => {
        var query = new JSONiq("1 + 1");
        query.compile();
    });
});
