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
        var node = super.serialize();
        node.add("r.ObjectIterator([");
        this.pairs.forEach((pair, index) => {
            node.add(pair.serialize());
            if(index !== this.pairs.length - 1) {
                node.add(", ");
            }
        });
        node.add("])");
        return node;
    }
}
