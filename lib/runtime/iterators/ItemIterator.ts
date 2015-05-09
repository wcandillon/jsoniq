/// <reference path="../../../typings/tsd.d.ts" />
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
        return Promise.resolve(this.item);
    }
};

export = ItemIterator;
