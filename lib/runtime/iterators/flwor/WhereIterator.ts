/// <reference path="../../../../typings/tsd.d.ts" />
import * as SourceMap from "source-map";

import Iterator from "../Iterator";
import IteratorClause from "./IteratorClause";
import Position from "../../../compiler/parsers/Position";

export default class WhereIterator extends IteratorClause {

    private expr: Iterator;

    constructor(
        position: Position,
        expr: Iterator
    ) {
        super(position);
        this.expr = expr;
    }

    serializeClause(clauses: IteratorClause[]): SourceMap.SourceNode {
        var node = super.serialize("where");
        node.add("if(")
            .add(this.expr.serialize())
            .add(".next().value == true){")
            .add(clauses[0].serializeClause(clauses.slice(1)))
            .add("}");
        return node;
    }
}
