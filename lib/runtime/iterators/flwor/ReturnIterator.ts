/// <reference path="../../../../typings/tsd.d.ts" />
import * as SourceMap from "source-map";

import Iterator from "../Iterator";
import IteratorClause from "../IteratorClause";
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

    serializeClauses(clauses: IteratorClause[]): SourceMap.SourceNode {
        if(clauses.length !== 0) {
            throw new Error("Invalid plan.");
        }
        var node = new SourceMap.SourceNode(this.position.getStartLine() + 1, this.position.getStartColumn() + 1, this.position.getFileName());
        node.add(this.expr.serialize());
        return node;
    }
}
