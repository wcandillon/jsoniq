/// <reference path="../../../typings/tsd.d.ts" />
import Iterator = require("./Iterator");
import Position = require("../../compiler/parsers/Position");

import Item = require("../items/Item");

class PairIterator extends Iterator {

    private key: Iterator;
    private value: Iterator;

    constructor(position: Position, key: Iterator, value: Iterator) {
        super(position);
        this.key = key;
        this.value = value;
    }

    next(): Promise<Item> {
        if(this.closed) {
            return this.emptySequence();
        }

        return Promise.all([this.key.next(), this.value.next()]).then(values => {
            var object = {};
            object[values[0].get()] = values[1].get();
            this.closed = true;
            return Promise.resolve(new Item(object));
        });
    }

    reset(): Iterator {
        super.reset();
        this.key.reset();
        this.value.reset();
        return this;
    }
};

export = PairIterator;
