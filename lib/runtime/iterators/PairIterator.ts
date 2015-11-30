/// <reference path="../../../typings/tsd.d.ts" />
import Iterator from "./Iterator";
import Position from "../../compiler/parsers/Position";
import * as SourceMap from "source-map";

export default class PairIterator extends Iterator {

    private key: Iterator;
    private value: Iterator;

    constructor(position: Position, key: Iterator, value: Iterator) {
        super(position);
        this.key = key;
        this.value = value;
    }

    serialize(): SourceMap.SourceNode {
        var node = super.serialize();
        node
            .add("r.PairIterator(")
            .add(this.key.serialize())
            .add(", ")
            .add(this.value.serialize())
            .add(")");
        return node;
    }
}
