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
        this.pairs.reverse().forEach(pair => {
            node.add(pair.serialize());
        });
        node
            .add("stack.push(r.ObjectIterator([")
            .add(this.pairs.map(pair => { return "stack.pop()"; }).join(","))
            .add("]));\n");
        return node;
    }
}
