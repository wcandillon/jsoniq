/// <reference path="../../../typings/tsd.d.ts" />
import _ = require("lodash");
import Iterator = require("./Iterator");
import Position = require("../../compiler/parsers/Position");

import Item = require("../items/Item");

class SequenceIterator extends Iterator {

    private its: Iterator[];
    private state: Iterator[];

    constructor(position: Position, its: Iterator[]) {
        super(position);
        this.its = its;
    }

    next(): Promise<Item> {
        super.next();
        if(this.state === undefined) {
            this.state = _.clone(this.its);
        }
        if(this.state.length === 0) {
            this.closed = true;
            return Promise.resolve(undefined);
        }
        if(this.state[0].isClosed()) {
            this.state.splice(0, 1);
        }
        return this.state[0].next().then(item => {
            if(this.state[0].isClosed() && this.state.length === 1) {
                this.closed = true;
            }
            return item;
        });
    }

    reset(): Iterator {
        super.reset();
        this.its.forEach(it => {
            it.reset();
        });
        this.state = undefined;
        return this;
    }
};

export = SequenceIterator;
