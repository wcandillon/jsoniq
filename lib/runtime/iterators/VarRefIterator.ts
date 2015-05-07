/// <reference path="../../../typings/tsd.d.ts" />
import Iterator = require("./Iterator");

class SequenceIterator extends Iterator {

    private dctx: DynamicContext;
    private varName: string;

    constructor(dctx: DynamicContext, varName: string) {
        super();
        this.dctx =;
        this.varName = varName;
    }

    next(): Promise<any> {
        return this.dctx.getVariable('', this.varName).next();
    }

    reset(): Iterator {
        return super.reset();
    }
};

export = SequenceIterator;
