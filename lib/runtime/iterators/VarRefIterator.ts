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
        super.next();
        if(this.state === undefined) {
            var it = this.dctx.getVariable("", this.varName);
            it.reset();
            this.state = it;
        }
        return this.state.next().then(item => {
            if(this.state.isClosed()) {
                this.closed = true;
            }
            return Promise.resolve(item);
        });
    }

    reset(): Iterator {
        super.reset();
        this.state = undefined;
        return this;
    }
};

export = VarRefIterator;
