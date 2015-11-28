/// <reference path="../../../typings/tsd.d.ts" />
import Iterator from "./Iterator";
import Position from "../../compiler/parsers/Position";
import * as SourceMap from "source-map";

export default class RangeIterator extends Iterator {

    private from: Iterator;
    private to: Iterator;

    constructor(position: Position, f: Iterator, to: Iterator) {
        super(position);
        this.from = f;
        this.to = to;
    }

    serialize(): SourceMap.SourceNode {
        var node = new SourceMap.SourceNode(this.position.getStartLine() + 1, this.position.getStartColumn() + 1, this.position.getFileName());
        node
            .add("new r.RangeIterator(")
            .add(super.serialize())
            .add(", ")
            .add(this.from.serialize())
            .add(", ")
            .add(this.to.serialize())
            .add(")");
        return node;
    }
}
