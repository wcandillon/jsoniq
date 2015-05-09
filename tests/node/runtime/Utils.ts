/// <reference path="../../../typings/tsd.d.ts" />
import JSONiq = require("../../../lib/JSONiq");

export function expectQuery(query: string): Promise<jasmine.Matchers> {
    return new Promise((resolve, reject) => {
        var it = new JSONiq(query).compile();
        var result = [];
        it.forEach(function(item){
            result.push(item.get());
        })
        .catch(error => {
            reject(error);
        })
        .then(() => {
            resolve(expect(result));
        });
    });
}
