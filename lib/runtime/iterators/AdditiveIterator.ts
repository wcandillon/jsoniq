/// <reference path="../../../typings/tsd.d.ts" />
import Iterator = require("./Iterator");
import Position = require("../../compiler/parsers/Position");

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

    next(): Promise<any> {
        super.next();
        return Promise.all([this.left.next(), this.right.next()]).then((values) => {
            this.closed = true;
            return Promise.resolve(values[0] + (this.isPlus ? values[1] : (- values[1])));
        });
    }

    reset(): Iterator {
        this.left.reset();
        this.right.reset();
        return super.reset();
    }
};

export = AdditiveIterator;
