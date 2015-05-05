/// <reference path="../../../typings/tsd.d.ts" />
import es6 = require("es6-promise");

import Iterator = require("./Iterator");

class AdditiveIterator extends Iterator {

    private isPlus: boolean;
    private left: Iterator;
    private right: Iterator;

    constructor(left: Iterator, right: Iterator, isPlus: boolean) {
        super();
        this.left = left;
        this.right = right;
        this.isPlus = isPlus;
    }

    next(): Promise<any> {
        super.next();
        return es6.Promise.all([this.left.next(), this.right.next()]).then((values) => {
            this.closed = true;
            return es6.Promise.resolve(values[0] + (this.isPlus ? values[1] : (- values[1])));
        });
    }
};

export = AdditiveIterator;
