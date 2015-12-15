/// <reference path="../../../typings/tsd.d.ts" />
import * as cp from "child_process";

import JSONiq from "../../../lib/JSONiq";

export function expectQuery(source: string, jsoniq?: boolean): jasmine.Matchers {
    let query = new JSONiq(source);
    let js = query.setFileName(jsoniq ? "test.jq" : "test.xq").compile().serializeDebug();
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
    let js = query.setFileName(jsoniq ? "test.jq" : "test.xq").compile().serializeDebug();
    let child = cp.execSync("node", { input: js });
    return expect(
        child.toString().trim().split("\n").join(" ")
    );
}
