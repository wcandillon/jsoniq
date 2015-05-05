/// <reference path="../../../typings/tsd.d.ts" />

import Iterator = require("./Iterator");

class SequenceIterator extends Iterator {

    private its: any[];

    constructor(its: Iterator[]) {
        super();
        this.its = its;
        if(this.its.length === 0) {
            this.closed = true;
        }
    }

    next(): Promise<any> {
        super.next();
        if(this.its[0].isClosed()) {
            this.its.splice(0, 1);
        }
        return this.its[0].next().then(item => {
            if(this.its[0].isClosed() && this.its.length === 1) {
                this.closed = true;
            }
            return item;
        });
    }
};

export = SequenceIterator;
