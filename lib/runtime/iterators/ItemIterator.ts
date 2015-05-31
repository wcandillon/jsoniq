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
        if(this.closed) {
            return this.emptySequence();
        }
        this.closed = true;
        return Promise.resolve(this.item);
    }

    serialize(): {} {
        return {
            __className: 'ItemIterator',
            arguments: [
                {
                    __className: 'Item',
                    arguments: [
                        this.item.get()
                    ]
                }
            ]
        }
    }
};

export = ItemIterator;
