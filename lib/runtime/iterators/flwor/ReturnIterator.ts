/// <reference path="../../../../typings/tsd.d.ts" />
import * as SourceMap from "source-map";

import Iterator from "../Iterator";
import IteratorClause from "./IteratorClause";
import Position from "../../../compiler/parsers/Position";

export default class ReturnIterator extends IteratorClause {

    private expr: Iterator;

    constructor(
        position: Position,
        expr: Iterator
    ) {
        super(position);
        this.expr = expr;
    }

    serializeClause(clauses: IteratorClause[]): SourceMap.SourceNode {
        if(clauses.length !== 0) {
            throw new Error("Invalid plan.");
        }
        var node = super.serialize("return");
        node.add("yield *")
            .add(this.expr.serialize())
            .add(";\n");
        return node;
    }
}
