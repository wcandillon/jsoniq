/// <reference path="../../../typings/tsd.d.ts" />
import es6 = require("es6-promise");

import Iterator = require("./Iterator");

class MultiplicativeIterator extends Iterator {

    private operator: string;
    private left: Iterator;
    private right: Iterator;

    constructor(right: Iterator, left: Iterator, operator: string) {
        super();
        this.left = left;
        this.right = right;
        this.operator = operator;
    }

    next(): Promise<any> {
        super.next();
        return es6.Promise.all([this.left.next(), this.right.next()]).then((values) => {
            this.closed = true;
            if(this.operator === "*") {
                return es6.Promise.resolve(values[0] * values[1]);
            } else if(this.operator === "div") {
                return es6.Promise.resolve(values[0] / values[1]);
            } else if(this.operator === "idiv") {
                return es6.Promise.resolve(Math.floor(values[0] / values[1]));
            } else if(this.operator === "mod") {
                return es6.Promise.resolve(values[0] % values[1]);
            }
        });
    }
};

export = MultiplicativeIterator;
