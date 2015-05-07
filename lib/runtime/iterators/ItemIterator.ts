/// <reference path="../../../typings/tsd.d.ts" />
import es6 = require("es6-promise");

import Iterator = require("./Iterator");

class ItemIterator extends Iterator {

    private item: any;

    constructor(item: any) {
        super(null);
        this.item = item;
    }

    next(): Promise<any> {
        super.next();
        this.closed = true;
        return es6.Promise.resolve(this.item);
    }
};

export = ItemIterator;
