/// <reference path="../../../typings/tsd.d.ts" />
import es6 = require("es6-promise");

import Iterator = require("./Iterator");

class AdditiveIterator implements Iterator {

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
        return es6.Promise.all([this.left.next(), this.right.next()]).then((values) => {
            this.isClosed = true;
            return es6.Promise.resolve(values[0] + values[1]);
        });
    }

    closed(): boolean {
        return this.isClosed;
    }
};

export = AdditiveIterator;
