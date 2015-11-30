/// <reference path="../../../typings/tsd.d.ts" />
import Iterator from "./Iterator";
import Position from "../../compiler/parsers/Position";
import * as SourceMap from "source-map";

export default class VarRefIterator extends Iterator {

    private varName: string;

    constructor(position: Position, varName: string) {
        super(position);
        this.varName = varName;
    }

    serialize(): SourceMap.SourceNode {
        var node = super.serialize();
        node.add("r.ItemIterator($" + this.varName + ")");
        return node;
    }
}
