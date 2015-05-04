/// <reference path="../../../typings/tsd.d.ts" />
import utils = require("./utils");
import Iterator = require("./Iterator");

class ItemIterator implements Iterator {

    private g: any;

    constructor(item: any) {
        this.g = utils.generator<any>(async (yield) => {
            await yield(item);
        });
    }

    next(): { value?: any; done: boolean } {
        return this.g.next();
    }
};

export = ItemIterator;
