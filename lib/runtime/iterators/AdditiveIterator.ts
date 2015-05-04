/// <reference path="../../../typings/tsd.d.ts" />
import utils = require("./utils");
import Iterator = require("./Iterator");

class AdditiveIterator implements Iterator {

    private g: any;

    constructor(left: Iterator, right: Iterator) {
        this.g = utils.generator<any>(async (yield) => {
            await yield(left.next().value + right.next().value);
        });
    }

    next(): { value?: any; done: boolean } {
        return this.g.next();
    }
};

export = AdditiveIterator;
