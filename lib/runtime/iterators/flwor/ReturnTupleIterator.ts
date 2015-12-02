/// <reference path="../../../../typings/tsd.d.ts" />
import * as SourceMap from "source-map";

import IteratorClause from "./IteratorClause";
import Position from "../../../compiler/parsers/Position";

export default class WhereIterator extends IteratorClause {

    private variables: string[];

    constructor(
        position: Position,
        variables: string[]
    ) {
        super(position);
        this.variables = variables;
    }

    serializeClause(clauses: IteratorClause[]): SourceMap.SourceNode {
        var node = super.serialize("where");
        node.add(`
yield {
    ${this.variables.map(varName => { return `"$${varName}": $${varName}`; }).join(", \n")}
};
`);
        return node;
    }
}
