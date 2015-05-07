/// <reference path="../../../typings/tsd.d.ts" />
import Iterator = require("./Iterator");
import DynamicContext = require("../DynamicContext");
import Position = require("../../compiler/parsers/Position");

class VarRefIterator extends Iterator {

    private dctx: DynamicContext;
    private varName: string;

    constructor(position: Position, dctx: DynamicContext, varName: string) {
        super(position);
        this.dctx = dctx;
        this.varName = varName;
    }

    next(): Promise<any> {
        return this.dctx.getVariable('', this.varName).next();
    }

    reset(): Iterator {
        return super.reset();
    }
};

export = VarRefIterator;
