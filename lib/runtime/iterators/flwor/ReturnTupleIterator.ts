/// <reference path="../../../../typings/tsd.d.ts" />
import * as SourceMap from "source-map";

import IteratorClause from "./IteratorClause";
import OrderByIterator from "./OrderByIterator";
import Position from "../../../compiler/parsers/Position";

export default class WhereIterator extends IteratorClause {

    private variables: string[];
    private operators: IteratorClause[];

    constructor(
        position: Position,
        variables: string[],
        operators: IteratorClause[]
    ) {
        super(position);
        this.variables = variables;
        this.operators = operators;
    }

    serializeClause(clauses: IteratorClause[]): SourceMap.SourceNode {
        var node = super.serialize("where");
        node.add(`
yield {
    ${this.variables.map(varName => { return `"$${varName}": $${varName}`; }).join(",\n")},
    ${this.operators.map(op => {
        if(op instanceof OrderByIterator) {
            return op.specs.map(spec => {
                return `group_${spec.ascending}_${spec.emptyGreatest}: r.load(${spec.expr.serialize()})`;
            });
        }
    }).join(",\n")}
};
`);
        return node;
    }
}
