/// <reference path="../../typings/tsd.d.ts" />
import * as p from "path";
import * as fs from "fs";

import JSONiq from "../../lib/JSONiq";

function getQueries(path: string): string[] {
    var files: string[] = [];
    fs.readdirSync(path).forEach(file => {
        file = p.resolve(p.normalize(path + "/" + file));
        if(fs.statSync(file).isFile() && ["jq", "xq"].indexOf(file.substring(file.length - 2)) !== -1) {
            files.push(file);
        } else if(fs.statSync(file).isDirectory()) {
            files = files.concat(getQueries(file));
        }
    });
    return files;
}

describe("Test Parser", () => {

    getQueries("tests/queries").forEach(file => {
        it(file, () => {
            var query = new JSONiq(fs.readFileSync(file, "utf-8"));
            query.setFileName(file);
        });
    });
});
