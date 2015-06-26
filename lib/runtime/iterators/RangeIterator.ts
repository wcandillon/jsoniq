/// <reference path="../../../typings/tsd.d.ts" />

import Iterator = require("./Iterator");
import Position = require("../../compiler/parsers/Position");
import DynamicContext = require("../DynamicContext");
import Item = require("../items/Item");
import SourceMap = require("source-map");

class RangeIteratorState {
    from: number;
    to: number;
    index: number
}

class RangeIterator extends Iterator {

    private from: Iterator;
    private to: Iterator;
    private state: RangeIteratorState;

    constructor(position: Position, f: Iterator, to: Iterator) {
        super(position);
        this.from = f;
        this.to = to;
    }

    next(): Promise<Item> {
        if(this.closed) {
            return this.emptySequence();
        }
        if(this.state === undefined) {
            return Promise.all([this.from.next(), this.to.next()]).then((values) => {
                this.state = {
                    from: values[0].get(),
                    to: values[1].get(),
                    index: values[0].get()
                };
                if(this.state.from === this.state.to) {
                    this.closed = true;
                }
                return Promise.resolve(new Item(this.state.index));
            });
        } else {
            this.state.index++;
            if(this.state.index === this.state.to) {
                this.closed = true;
            }
            return Promise.resolve(new Item(this.state.index));
        }
    }

    reset(): Iterator {
        this.from.reset();
        this.to.reset();
        this.state = undefined;
        return super.reset();
    }

    setDynamicCtx(dctx: DynamicContext): RangeIterator {
        super.setDynamicCtx(dctx);
        this.from.setDynamicCtx(dctx);
        this.to.setDynamicCtx(dctx);
        return this;
    }

    serialize(): SourceMap.SourceNode {
        var node = new SourceMap.SourceNode(this.position.getStartLine() + 1, this.position.getEndColumn() + 1, this.position.getFileName());
        node
            .add("new r.RangeIterator(")
            .add(super.serialize())
            .add(", ")
            .add(this.from.serialize())
            .add(", ")
            .add(this.to.serialize())
            .add(")");
        return node;
    }
};

export = RangeIterator;
