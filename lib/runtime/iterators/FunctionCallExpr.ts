/// <reference path="../../../typings/tsd.d.ts" />
import Iterator  from "./Iterator";
import Position  from "../../compiler/parsers/Position";
import * as SourceMap from "source-map";
import QName from "../../compiler/QName";

export default class FunctionCallExpr extends Iterator {

    private name: QName;
    private args: Iterator[];

    constructor(position: Position, name: QName, args: Iterator[]) {
        super(position);
        this.name = name;
        this.args = args;
    }

    serialize(): SourceMap.SourceNode {
        var node = super.serialize();
        //node.add("r.ArrayIterator(")
        //    .add(this.expr.serialize())
        //    .add(")");
        return node;
    }
}
