/// <reference path="../../../typings/tsd.d.ts" />
//import * as _ from "lodash";
import Iterator from "./Iterator";
import Position from "../../compiler/parsers/Position";
import * as SourceMap from "source-map";

export default class SequenceIterator extends Iterator {

    private its: Iterator[];

    constructor(position: Position, its: Iterator[]) {
        super(position);
        this.its = its;
    }

    //
    serialize(): SourceMap.SourceNode {
        var node = new SourceMap.SourceNode(this.position.getStartLine() + 1, this.position.getStartColumn() + 1, this.position.getFileName());
        this.its.forEach(it => {
            node.add(it.serialize());
        });
        if(this.its.length === 0) {
            node.add("stack.push(r.SequenceIterator([]));\n");
        } else {
            node.add("stack.push(r.SequenceIterator(stack.splice(" + (- this.its.length) + ")));\n");
        }
        return node;
    }
}
