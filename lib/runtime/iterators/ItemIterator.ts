/// <reference path="../../../typings/tsd.d.ts" />
import es6Promise = require("es6-promise");

import Iterator = require("./Iterator");

class ItemIterator implements Iterator {

    private isClosed: boolean = false;
    private item: any;

    constructor(item: any) {
        this.item = item;
    }

    next(): Promise<any> {
        if(this.isClosed) {
            throw new Error("Iterator is closed.");
        }
        return new es6Promise.Promise((resolve) => {
            this.isClosed = true;
            resolve(item);
        });
    }

    closed(): boolean {
        return this.isClosed;
    }
};

export = ItemIterator;
