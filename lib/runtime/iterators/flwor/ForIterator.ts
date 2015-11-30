/// <reference path="../../../../typings/tsd.d.ts" />
import * as SourceMap from "source-map";

import Iterator from "../Iterator";
import IteratorClause from "./IteratorClause";
import Position from "../../../compiler/parsers/Position";

export default class ForIterator extends IteratorClause {

    private varName: string;
    private allowEmpty: boolean;
    private positionalVar: string;
    private expr: Iterator;

    constructor(
        position: Position, varName: string, allowEmpty: boolean, positionalVar: string, expr: Iterator
    ) {
        super(position);
        this.varName = varName;
        this.allowEmpty = allowEmpty;
        this.positionalVar = positionalVar;
        this.expr = expr;
    }

    serializeClause(clauses: IteratorClause[]): SourceMap.SourceNode {
        var node = super.serialize();
        if(this.positionalVar) {
            node.add("let $" + this.positionalVar + " = 0;\n");
        }
        node.add("for(let $" + this.varName + " of ");
        node.add(this.expr.serialize());
        node.add(") {\n");
        if(this.positionalVar) {
            node.add("$" + this.positionalVar + "++;\n");
        }
        node.add(
            clauses[0].serializeClause(clauses.slice(1))
        );
        node.add("}\n");
        return node;
    }
}
