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
        var node = new SourceMap.SourceNode(this.position.getStartLine() + 1, this.position.getStartColumn() + 1, this.position.getFileName());
        node.add(this.value.serialize());
        node.add(this.key.serialize());
        node
            .add("stack.push(r.PairIterator(stack.pop(), stack.pop()));\n");
        return node;
    }
}
