/// <reference path="../../../typings/tsd.d.ts" />
import Iterator = require("./Iterator");
import DynamicContext = require("../DynamicContext");
import Position = require("../../compiler/parsers/Position");

import Item = require("../items/Item");

class VarRefIterator extends Iterator {

    private dctx: DynamicContext;
    private varName: string;
    private state: Iterator;

    constructor(position: Position, dctx: DynamicContext, varName: string) {
        super(position);
        this.dctx = dctx;
        this.varName = varName;
    }

    next(): Promise<Item> {
        if(!this.state) {
            this.state = this.dctx.getVariable("", this.varName);
            this.state.reset();
        }
        return this.state.next();
    }

    reset(): Iterator {
        super.reset();
        this.state = undefined;
        return this;
    }
};

export = VarRefIterator;
