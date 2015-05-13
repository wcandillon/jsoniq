/// <reference path="../../../typings/tsd.d.ts" />
import Iterator = require("./Iterator");
import Position = require("../../compiler/parsers/Position");

import Item = require("../items/Item");

class ArrayIterator extends Iterator {

    private expr: Iterator;

    constructor(position: Position, expr: Iterator) {
        super(position);
        this.expr = expr;
    }

    next(): Promise<Item> {
        if(this.closed) {
            return this.emptySequence();
        }
        var array = [];
        this.closed = true;
        return this.expr.forEach(item => {
            array.push(item.get());
        }).then(() => {
            return Promise.resolve(new Item(array));
        });
    }

    reset(): Iterator {
        super.reset();
        this.expr.reset();
        return this;
    }
};

export = ArrayIterator;
