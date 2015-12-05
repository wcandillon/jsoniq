/// <reference path="../../../typings/tsd.d.ts" />
import * as SourceMap from "source-map";

import Iterator from "./Iterator";
import Position from "../../compiler/parsers/Position";

export default class ObjectLookupExpr extends Iterator {

    private source: Iterator;
    private target: Iterator;

    constructor(position: Position, source: Iterator, target: Iterator) {
        super(position);
        this.source = source;
        this.target = target;
    }

    serialize(): SourceMap.SourceNode {
        var node = super.serialize();
        node
            .add("r.lookup(")
            .add(this.source.serialize())
            .add(", ")
            .add(this.target.serialize())
            .add(")");
        return node;
    }
}
