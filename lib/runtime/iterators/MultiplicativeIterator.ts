/// <reference path="../../../typings/tsd.d.ts" />
import Iterator = require("./Iterator");
import Position = require("../../compiler/parsers/Position");

import Item = require("../items/Item");

class MultiplicativeIterator extends Iterator {

    private operator: string;
    private left: Iterator;
    private right: Iterator;

    constructor(position: Position, right: Iterator, left: Iterator, operator: string) {
        super(position);
        this.left = left;
        this.right = right;
        this.operator = operator;
    }

    next(): Promise<Item> {
        if(this.closed) {
            return this.emptySequence();
        }
        return Promise.all([this.left.next(), this.right.next()]).then<Item>((values) => {
            this.closed = true;
            var left = values[0].get();
            var right = values[1].get();
            var result: number;
            if(this.operator === "*") {
                result = left * right;
            } else if(this.operator === "div") {
                result = left / right;
            } else if(this.operator === "idiv") {
                result = Math.floor(left / right);
            } else if(this.operator === "mod") {
                result = left % right;
            }
            return Promise.resolve<Item>(new Item(result));
        });
    }

    reset(): Iterator {
        super.reset();
        this.left.reset();
        this.right.reset();
        return this;
    }
};

export = MultiplicativeIterator;
