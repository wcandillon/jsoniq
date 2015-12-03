/// <reference path="../../../typings/tsd.d.ts" />
import JSONiq from "../../../lib/JSONiq";
import Iterator from "../../../lib/runtime/iterators/Iterator";
import * as vm from "vm";

function serializeStandalone(it: Iterator): string {
    var source = "'use strict';";
    source += "var r = require('../../../lib/runtime/Runtime');\n";
    source += "var it = " + it.serialize() + ";\n";
    source += "for(var item of it) {\n";
    source += "    items.push(item);\n";
    source += "}\n";
    return source;
}

export function expectQuery(source: string, jsoniq?: boolean): jasmine.Matchers {
    var query = new JSONiq(source);
    var filename = jsoniq ? "test.jq" : "test.xq";
    query.setFileName(filename);
    var it = query.compile();
    var plan = serializeStandalone(it);
    var sandbox = <vm.Context>{ items: [], require: require, exports: exports };
    try {
        vm.runInNewContext(plan, sandbox, filename);
    } catch(e) {
        console.log(e);
        console.log(e.stack);
    }
    return expect((<{ items: []; }>sandbox).items);
}

export function expectSerializedQuery(source:string, jsoniq?:boolean):jasmine.Matchers {
    var query = new JSONiq(source);
    var filename = jsoniq ? "test.jq" : "test.xq";
    query.setFileName(filename);
    var it = query.compile();
    var plan = serializeStandalone(it);
    var sandbox = <vm.Context>{ items: [], require: require, exports: exports };
    vm.runInNewContext(plan, sandbox, filename);
    return expect((<{ items: []; }>sandbox).items.map(item => { return JSON.stringify(item); }).join(" "));
}
