/// <reference path="../../../../typings/tsd.d.ts" />
import * as SourceMap from "source-map";

import Iterator from "../Iterator";
import IteratorClause from "./IteratorClause";
import Position from "../../../compiler/parsers/Position";

export default class OrderByIterator extends IteratorClause {

    private stable: boolean;
    private specs: { expr: Iterator; ascending: boolean; emptyGreatest: boolean }[];

    constructor(
        position: Position,
        stable: boolean,
        specs: { expr: Iterator; ascending: boolean; emptyGreatest: boolean }[]
    ) {
        super(position);
        this.stable = stable;
        this.specs = specs;
    }

    serializeClause(clauses: IteratorClause[]): SourceMap.SourceNode {
        var node = super.serialize("order by");
        node.add(`tuples = r.sort(tuples);\n`);
        return node;
    }
}
