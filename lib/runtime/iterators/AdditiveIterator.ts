/// <reference path="../../../typings/tsd.d.ts" />
import Iterator = require("./Iterator");
import Position = require("../../compiler/parsers/Position");

import Item = require("../items/Item");

class AdditiveIterator extends Iterator {

    private isPlus: boolean;
    private left: Iterator;
    private right: Iterator;

    constructor(position: Position, left: Iterator, right: Iterator, isPlus: boolean) {
        super(position);
        this.left = left;
        this.right = right;
        this.isPlus = isPlus;
    }

    next(): Promise<Item> {
        if(this.closed) {
            return this.emptySequence();
        }
        return Promise.all([this.left.next(), this.right.next()]).then((values) => {
            this.closed = true;
            var left = values[0].get();
            var right = values[1].get();
            return Promise.resolve(new Item(left + (this.isPlus ? right : (- right))));
        });
    }

    reset(): Iterator {
        super.reset();
        this.left.reset();
        this.right.reset();
        return this;
    }
};

export = AdditiveIterator;
