/// <reference path="../../../../typings/tsd.d.ts" />
import * as SourceMap from "source-map";

import Iterator from "../Iterator";
import IteratorClause from "./IteratorClause";
import Position from "../../../compiler/parsers/Position";

export default class LetIterator extends IteratorClause {

    private varName: string;
    private expr: Iterator;

    constructor(
        position: Position, varName: string, expr: Iterator
    ) {
        super(position);
        this.varName = varName;
        this.expr = expr;
    }

    serializeClause(clauses: IteratorClause[]): SourceMap.SourceNode {
        var node = super.serialize("let");
        node.add("let $" + this.varName + " = r.load(")
            .add(this.expr.serialize())
            .add(");\n")
            .add(clauses[0].serializeClause(clauses.slice(1)));
        return node;
    }
}
