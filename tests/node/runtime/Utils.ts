/// <reference path="../../../typings/tsd.d.ts" />
import JSONiq = require("../../../lib/JSONiq");

export function expectQuery(source: string, jsoniq?: boolean): Promise<jasmine.Matchers> {
    return new Promise((resolve, reject) => {
        var query = new JSONiq(source);
        if(jsoniq) {
            query.setFileName("test.jq");
        } else {
            query.setFileName("test.xq");
        }
        var it = query.compile();
        var result = [];
        it.forEach(function(item) {
            result.push(item.get());
        })
        .catch(error => {
            console.log(error.stack);
            reject(error.stack);
        })
        .then(() => {
            resolve(expect(result));
        });
    });
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
        var result: string[] = [];
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
    });
}
