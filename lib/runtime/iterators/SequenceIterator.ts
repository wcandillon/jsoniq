/// <reference path="../../../typings/tsd.d.ts" />
//import es6Promise = require("es6-promise");
import utils = require("./utils");
import Iterator = require("./Iterator");

class SequenceIterator implements Iterator {

    private g: any;

    constructor(its: Iterator[]) {
        this.g = utils.generator<any>(async (yield) => {
            its.forEach(async (it) => {
                await yield(it.next());
            });
        });
    }

    next(): { value?: any; done: boolean } {
        return this.g.next();
    }
};

export = SequenceIterator;
