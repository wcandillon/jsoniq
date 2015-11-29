/// <reference path="../../../typings/tsd.d.ts" />
import * as SourceMap from "source-map";

import Iterator from "./Iterator";
import Position from "../../compiler/parsers/Position";

export default class AdditiveIterator extends Iterator {

    private isPlus: boolean;
    private left: Iterator;
    private right: Iterator;

    constructor(position: Position, left: Iterator, right: Iterator, isPlus: boolean) {
        super(position);
        this.left = left;
        this.right = right;
        this.isPlus = isPlus;
    }

    serialize(): SourceMap.SourceNode {
        var node = new SourceMap.SourceNode(this.position.getStartLine() + 1, this.position.getStartColumn() + 1, this.position.getFileName());
        node
            .add("r.AdditiveIterator(")
            .add(this.left.serialize())
            .add(", ")
            .add(this.right.serialize())
            .add(", ")
            .add(JSON.stringify(this.isPlus))
            .add(")");
        return node;
    }
}
