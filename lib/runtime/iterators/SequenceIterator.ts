/// <reference path="../../../typings/tsd.d.ts" />
import _ = require("lodash");
import Iterator = require("./Iterator");
import Position = require("../../compiler/parsers/Position");
import DynamicContext = require("../DynamicContext");
import Item = require("../items/Item");

class SequenceIterator extends Iterator {

    private its: Iterator[];
    private state: Iterator[];

    constructor(position: Position, its: Iterator[]) {
        super(position);
        this.its = its;
    }

    next(): Promise<Item> {
        if((this.state && this.state.length === 0) || this.its.length === 0) {
            this.closed = true;
        }

        if(this.closed) {
            return this.emptySequence();
        }

        if(this.state === undefined) {
            this.state = _.clone(this.its);
        }

        return this.state[0].next().then(item => {
            if(item === undefined) {
                this.state.splice(0, 1);
                if(this.state.length > 0) {
                    return this.state[0].next();
                }
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

    setDynamicCtx(dctx: DynamicContext): SequenceIterator {
        super.setDynamicCtx(dctx);
        this.its.forEach(it => {
            it.setDynamicCtx(dctx);
        });
        return this;
    }

    serialize(): {} {
        return {
            __className: 'SequenceIterator',
            arguments: [
                super.serialize(),
                this.its.map(it => { return it.serialize(); })
            ]
        };
    }
};

export = SequenceIterator;
