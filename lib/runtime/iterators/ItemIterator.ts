/// <reference path="../../typings/tsd.d.ts" />
import es6Promise = require("es6-promise");

import Iterator = require("./Iterator");

class ItemIterator implements Iterator {

    private closed: boolean = false;
    private item: any;

    constructor(item: any) {
        this.item = item;
    }

    next(): Promise<any> {
        return new es6Promise.Promise((resolve) => {
            this.closed = true;
            resolve(item);
        });
    }

    closed(): boolean {
        return this.closed;
    }
};

export = ItemIterator;