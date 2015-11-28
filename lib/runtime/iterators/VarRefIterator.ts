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
        var node = new SourceMap.SourceNode(this.position.getStartLine() + 1, this.position.getStartColumn() + 1, this.position.getFileName());
        node
            .add("new r.VarRefIterator(")
            .add(super.serialize())
            .add(", ")
            .add(JSON.stringify(this.varName))
            .add(")");
        return node;
    }
}
