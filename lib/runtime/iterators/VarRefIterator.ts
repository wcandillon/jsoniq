/// <reference path="../../../typings/tsd.d.ts" />
import Iterator = require("./Iterator");
//import DynamicContext = require("../DynamicContext");
import Position = require("../../compiler/parsers/Position");

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
            console.log(this.variable);
            console.log(this.variable instanceof Iterator);
            console.log(this.variable.reset);
            this.variable.reset();
        }
        return this.variable.next();
    }

    reset(): Iterator {
        this.variable = undefined;
        return this;
    }
};

export = VarRefIterator;
