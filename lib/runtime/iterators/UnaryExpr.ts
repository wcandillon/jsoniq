/// <reference path="../../../typings/tsd.d.ts" />
import * as SourceMap from "source-map";

import Iterator from "./Iterator";
import Position from "../../compiler/parsers/Position";

export default class UnaryExpr extends Iterator {

    private ops: string[];
    private value: Iterator;

    constructor(position: Position, ops: string[], value: Iterator) {
        super(position);
        this.ops = ops;
        this.value = value;
    }

    serialize(): SourceMap.SourceNode {
        var node = super.serialize();
        node
            .add("r.unary(")
            .add(JSON.stringify(this.ops))
            .add(", ")
            .add(this.value.serialize())
            .add(")");
        return node;
    }
}
