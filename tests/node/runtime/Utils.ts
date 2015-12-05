/// <reference path="../../../typings/tsd.d.ts" />
import * as cp from "child_process";

import JSONiq from "../../../lib/JSONiq";

export function expectQuery(source: string, jsoniq?: boolean): jasmine.Matchers {
    let query = new JSONiq(source);
    let filename = jsoniq ? "test.jq" : "test.xq";
    query.setFileName(filename);
    let it = query.compile();
    let js = JSONiq.serializeDebug(it);
    let child = cp.execSync("node", { input: js });
    return expect(
        child.toString() === "" ? [] :
        child.toString().trim().split("\n").map(v => {
            return JSON.parse(v);
        })
    );
}

export function expectSerializedQuery(source: string, jsoniq?: boolean): jasmine.Matchers {
    let query = new JSONiq(source);
    let filename = jsoniq ? "test.jq" : "test.xq";
    query.setFileName(filename);
    let it = query.compile();
    let js = JSONiq.serializeDebug(it);
    let child = cp.execSync("node", { input: js });
    return expect(
        child.toString().trim().split("\n").join(" ")
    );
}
