/// <reference path="../../../typings/tsd.d.ts" />
import es6 = require("es6-promise");

import Iterator = require("./Iterator");

class RangeIterator extends Iterator {

    private from: Iterator;
    private to: Iterator;

    constructor(f: Iterator, to: Iterator) {
        super();
        this.from = f;
        this.to = to;
    }

    next(): Promise<any> {
        super.next();
        if(this.state === undefined) {
            return es6.Promise.all([this.from.next(), this.to.next()]).then((values) => {
                this.state = {
                    from: values[0].item,
                    to: values[1].item,
                    index: values[0].item
                };
                if(this.state.from === this.state.to) {
                    this.closed = true;
                }
                return es6.Promise.resolve(this.state.index);
            });
        } else {
            this.state.index++;
            if(this.state.from === this.state.to) {
                this.closed = true;
            }
            return es6.Promise.resolve(this.state.index);
        }
    }
};

export = RangeIterator;
