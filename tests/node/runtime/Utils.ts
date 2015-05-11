/// <reference path="../../../typings/tsd.d.ts" />
import JSONiq = require("../../../lib/JSONiq");

export function expectQuery(source: string, jsoniq?: boolean): Promise<jasmine.Matchers> {
    return new Promise((resolve, reject) => {
        var query = new JSONiq(source);
        if(jsoniq) {
            query.setFileName("test.jq");
        }
        var it = query.compile();
        var result = [];
        it.forEach(function(item) {
            result.push(item.get());
        })
        .catch(error => {
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
        }
        var it = query.compile();
        var result: string[] = [];
        it.forEach(function(item) {
            result.push(item.get());
        })
        .catch(error => {
            reject(error.stack);
        })
        .then(() => {
            resolve(expect(result.join(" ")));
        });
    });
}
