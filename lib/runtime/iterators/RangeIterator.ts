/// <reference path="../../../typings/tsd.d.ts" />

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
            return Promise.all([this.from.next(), this.to.next()]).then((values) => {
                this.state = {
                    from: values[0],
                    to: values[1],
                    index: values[0]
                };
                if(this.state.from === this.state.to) {
                    this.closed = true;
                }
                return Promise.resolve(this.state.index);
            });
        } else {
            this.state.index++;
            if(this.state.index === this.state.to) {
                this.closed = true;
            }
            return Promise.resolve(this.state.index);
        }
    }

    reset(): Iterator {
        this.from.reset();
        this.to.reset();
        return super.reset();
    }
};

export = RangeIterator;
