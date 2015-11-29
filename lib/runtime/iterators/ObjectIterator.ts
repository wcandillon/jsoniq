/// <reference path="../../../typings/tsd.d.ts" />
//import * as _ from "lodash";
import Iterator from "./Iterator";
import Position from "../../compiler/parsers/Position";
import * as SourceMap from "source-map";

export default class ObjectIterator extends Iterator {

    private pairs: Iterator[];

    constructor(position: Position, pairs: Iterator[]) {
        super(position);
        this.pairs = pairs;
    }

    serialize(): SourceMap.SourceNode {
        var node = new SourceMap.SourceNode(this.position.getStartLine() + 1, this.position.getStartColumn() + 1, this.position.getFileName());
        this.pairs.forEach(pair => {
            node.add(pair.serialize());
        });
        if(this.pairs.length === 0) {
            node.add("stack.push(r.ObjectIterator([]));\n");
        } else {
            node.add("stack.push(r.ObjectIterator(stack.splice(" + (- this.pairs.length) + ")));\n");
        }
        return node;
    }
}
