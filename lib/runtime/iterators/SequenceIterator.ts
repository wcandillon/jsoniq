/// <reference path="../../../typings/tsd.d.ts" />

import Iterator = require("./Iterator");
import Position = require("../../compiler/parsers/Position");

import Item = require("../items/Item");

class SequenceIterator extends Iterator {

    private its: any[];

    constructor(position: Position, its: Iterator[]) {
        super(position);
        this.its = its;
        if(this.its.length === 0) {
            this.closed = true;
        }
    }

    next(): Promise<Item> {
        super.next();
        if(this.its[0].isClosed()) {
            this.its.splice(0, 1);
        }
        return this.its[0].next().then(item => {
            if(this.its[0].isClosed() && this.its.length === 1) {
                this.closed = true;
            }
            return item;
        });
    }

    reset(): Iterator {
        this.its.forEach(it => {
            it.reset();
        });
        return super.reset();
    }
};

export = SequenceIterator;