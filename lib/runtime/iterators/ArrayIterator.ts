/// <reference path="../../../typings/tsd.d.ts" />
import Iterator  from "./Iterator";
import Position  from "../../compiler/parsers/Position";
import * as SourceMap from "source-map";

export default class ArrayIterator extends Iterator {

    private expr: Iterator;

    constructor(position: Position, expr: Iterator) {
        super(position);
        this.expr = expr;
    }

    serialize(): SourceMap.SourceNode {
        var node = super.serialize();
        node.add("r.ArrayIterator(")
            .add(this.expr.serialize())
            .add(")");
        return node;
    }
}
