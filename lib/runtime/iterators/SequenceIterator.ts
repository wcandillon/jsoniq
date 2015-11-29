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
        node.add("r.SequenceIterator([");
        this.its.forEach((it, index) => {
            node.add(it.serialize());
            if(index !== this.its.length - 1) {
                node.add(", ");
            }
        });
        node.add("])");
        return node;
    }
}
