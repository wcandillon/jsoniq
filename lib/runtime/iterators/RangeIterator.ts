/// <reference path="../../../typings/tsd.d.ts" />
import es6 = require("es6-promise");

import Iterator = require("./Iterator");

class RangeIterator implements Iterator {

    private isClosed: boolean = false;
    private left: Iterator;
    private right: Iterator;

    constructor(left: Iterator, right: Iterator) {
        this.left = left;
        this.right = right;
    }

    next(): Promise<any> {
        if(this.isClosed) {
            throw new Error("Iterator is closed.");
        }
        return es6.Promise.all([this.left, this.right]).then((values) => {
            return values;
        });
    }

    closed(): boolean {
        return this.isClosed;
    }
};

export = RangeIterator;
