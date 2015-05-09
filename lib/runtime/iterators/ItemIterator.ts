/// <reference path="../../../typings/tsd.d.ts" />
import es6 = require("es6-promise");

import Iterator = require("./Iterator");

import Item = require("../items/Item");

class ItemIterator extends Iterator {

    private item: Item;

    constructor(item: Item) {
        super(null);
        this.item = item;
    }

    next(): Promise<Item> {
        super.next();
        this.closed = true;
        return es6.Promise.resolve(this.item);
    }
};

export = ItemIterator;
