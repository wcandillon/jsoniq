/// <reference path="../../../typings/tsd.d.ts" />
import utils = require("./utils");
import Iterator = require("./Iterator");

class RangeIterator implements Iterator {

    private g: any;

    constructor(f: Iterator, to: Iterator) {
        this.g = utils.generator<any>(async (yield) => {
            var start = f.next().value;
            var end = to.next().value;
            for(var i = start; i<=end; i++) {
                await yield(i);
            }
        });
    }

    next(): { value?: any; done: boolean } {
        return this.g.next();
    }
};

export = RangeIterator;
