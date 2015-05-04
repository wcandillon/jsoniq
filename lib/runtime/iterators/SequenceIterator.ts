/// <reference path="../../../typings/tsd.d.ts" />
//import es6Promise = require("es6-promise");

import Iterator = require("./Iterator");

class SequenceIterator implements Iterator {

    private isClosed: boolean = false;
    private its: any[];

    constructor(its: Iterator[]) {
        this.its = its;
        if(this.its.length === 0) {
            this.isClosed = true;
        }
    }

    next(): Promise<any> {
        if(this.isClosed) {
            throw new Error("Iterator is closed.");
        }
        if(this.its.length === 1) {
            this.isClosed = true;
        }
        return this.its.splice(0, 1)[0].next();
    }

    closed(): boolean {
        return this.isClosed;
    }
};

export = SequenceIterator;
