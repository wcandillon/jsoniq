/// <reference path="../../../../typings/tsd.d.ts" />
import * as SourceMap from "source-map";

import Position from "../../../compiler/parsers/Position";
import IteratorClause from "./IteratorClause";
import Iterator from "../Iterator";

export default class FLWORIterator extends Iterator {

    private clauses: IteratorClause[];

    constructor(position: Position, clauses: Iterator[]) {
        super(position);
        this.clauses = <IteratorClause[]>clauses;
    }

    serialize(): SourceMap.SourceNode {
        var node = super.serialize();
        node.add("(function *(){")
            .add(this.clauses[0].serializeClause(this.clauses.slice(1)))
            .add("})()");
        return node;
    }
}
