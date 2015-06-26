/// <reference path="../../../typings/tsd.d.ts" />
import Iterator = require("./Iterator");
//import DynamicContext = require("../DynamicContext");
import Position = require("../../compiler/parsers/Position");
import SourceMap = require("source-map");

import Item = require("../items/Item");

class VarRefIterator extends Iterator {

    private varName: string;
    private variable: Iterator;

    constructor(position: Position, varName: string) {
        super(position);
        this.varName = varName;
    }

    next(): Promise<Item> {
        if(!this.variable) {
            this.variable = this.dctx.getVariable("", this.varName);
            this.variable.reset();
        }
        return this.variable.next();
    }

    reset(): Iterator {
        this.variable = undefined;
        return this;
    }

    serialize(): SourceMap.SourceNode {
        var node = new SourceMap.SourceNode(this.position.getStartLine() + 1, this.position.getEndColumn() + 1, this.position.getFileName());
        node
            .add("new r.VarRefIterator(")
            .add(super.serialize())
            .add(", ")
            .add(JSON.stringify(this.varName))
            .add(")");
        return node;
    }
};

export = VarRefIterator;
