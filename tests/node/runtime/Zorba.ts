/// <reference path="../../../typings/tsd.d.ts" />
require("jasmine2-pit");
import * as p from "path";
import * as fs from "fs";

import * as u from "./Utils";

declare function pit(expectation: string, assertion?: (done: () => void) => any): void;

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

describe("Test JSONiq Expressions", () => {

    var base = "tests/queries/zorba/Queries/zorba/jsoniq";
    var queries = [
        //"version_decl_02.xq"
    ];
    //getQueries("tests/queries/zorba/Queries/zorba/jsoniq")
    queries.forEach(file => {
        file = base + "/" + file;
        pit(file, () => {
            var query = fs.readFileSync(file, "utf-8");
            return u.expectSerializedQuery(query, file.substring(file.length - 3) === ".jq").then(e => {
                file = file.replace("/Queries/", "/ExpQueryResults/");
                file = file.substring(0, file.length - 3);
                file = file + ".xml.res";
                e.toEqual(fs.readFileSync(file, "utf-8"));
            });
        });
    });
});


describe("Test FLWOR Expressions", () => {

    var base = "tests/queries/zorba/Queries/zorba/flwor";
    var queries = [
        "flwor00.xq",
        "flwor01.xq",
        "flwor02.xq",
        "flwor06.xq",
        "flwor07.xq",
        "flwor08.xq",
        "flwor10.xq"
    ];
    //getQueries("tests/queries/zorba/Queries/zorba/jsoniq")
    queries.forEach(file => {
        file = base + "/" + file;
        pit(file, () => {
            var query = fs.readFileSync(file, "utf-8");
            return u.expectSerializedQuery(query, file.substring(file.length - 3) === ".jq").then(e => {
                file = file.replace("/Queries/", "/ExpQueryResults/");
                file = file.substring(0, file.length - 3);
                file = file + ".xml.res";
                e.toEqual(fs.readFileSync(file, "utf-8").trim());
            });
        });
    });
});

