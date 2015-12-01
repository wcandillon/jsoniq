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
        node.add("let $" + this.varName + " = (function(){ let seq = []; let it = ")
            .add(this.expr.serialize())
            .add("; for(let item of it){ seq.push(item); } return seq; })();\n");
        node.add(
            clauses[0].serializeClause(clauses.slice(1))
        );
        return node;
    }
}
