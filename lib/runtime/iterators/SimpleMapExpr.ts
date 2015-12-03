/// <reference path="../../../typings/tsd.d.ts" />
//import * as _ from "lodash";
import Iterator from "./Iterator";
import Position from "../../compiler/parsers/Position";
import * as SourceMap from "source-map";

export default class SimpleMapExpr extends Iterator {

    private left: Iterator;
    private right: Iterator;

    constructor(position: Position, left: Iterator, right: Iterator) {
        super(position);
        this.left = left;
        this.right = right;
    }

    //
    serialize(): SourceMap.SourceNode {
        var node = super.serialize();
        node.add("(function *(){\n")
            .add("for(let $$ of ")
            .add(this.left.serialize())
            .add("){\n")
            .add(`$$ = [$$];\n`)
            .add("yield *")
            .add(this.right.serialize())
            .add(";\n")
            .add("}\n})()")
        ;
        return node;
    }
}
