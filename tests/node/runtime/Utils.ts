/// <reference path="../../../typings/tsd.d.ts" />
import JSONiq from "../../../lib/JSONiq";
import Iterator from "../../../lib/runtime/iterators/Iterator";
import * as vm from "vm";
import * as fs from "fs";


function serializeStandalone(it: Iterator): string {
    var source = "var exports = {};var r = exports;";
    source += fs.readFileSync("./dist/lib/runtime/Runtime.js", "utf-8");
    source += "var stack = [];\n";
    source += it.serialize();
    source += "stack.forEach(it => {\n";
    source += "    for(var item of it) {\n";
    source += "        items.push(item);\n";
    source += "    }\n";
    source += "});\n";
    return source;
}

export function expectQuery(source: string, jsoniq?: boolean): jasmine.Matchers {
    var query = new JSONiq(source);
    var filename = jsoniq ? "test.jq" : "test.xq";
    query.setFileName(filename);
    var it = query.compile();
    var plan = serializeStandalone(it);
    global.items = [];
    vm.runInThisContext(plan, filename);
    return expect(global.items);
}

export function expectSerializedQuery(source: string, jsoniq?: boolean): Promise<jasmine.Matchers> {
    return new Promise((resolve, reject) => {
        var query = new JSONiq(source);
        if(jsoniq) {
            query.setFileName("test.jq");
        } else {
            query.setFileName("test.xq");
        }
        var it = query.compile();
        var plan = JSONiq.serialize(it);
        console.log(plan);
        //var result: string[] = [];
        /*
        it.forEach(function(item) {
            result.push(JSON.stringify(item.get()));
        })
        .catch(error => {
            console.log(error.stack);
            reject(error.stack);
        })
        .then(() => {
            resolve(expect(result.join(" ")));
        });
        */
    });
}
