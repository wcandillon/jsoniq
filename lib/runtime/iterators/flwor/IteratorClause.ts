/// <reference path="../../../../typings/tsd.d.ts" />
import * as SourceMap from "source-map";

import Iterator from "../Iterator";

//TODO: Make abstract
export default class IteratorClause extends Iterator {

    getBindingVar(): string {
        return;
    }

    serializeClause(clauses: IteratorClause[]): SourceMap.SourceNode {
        throw new Error("abstract method");
    }
}
