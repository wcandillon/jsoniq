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
        var node = new SourceMap.SourceNode(this.position.getStartLine() + 1, this.position.getStartColumn() + 1, this.position.getFileName());
        node.add(`(function *(){
    ${this.clauses[0].serializeClause(this.clauses.slice(1))}
})()`);
        return node;
    }
}
