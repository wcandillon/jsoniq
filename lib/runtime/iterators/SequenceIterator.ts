/// <reference path="../../../typings/tsd.d.ts" />
import _ = require("lodash");
import SourceMap = require("source-map");

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

    //
    serialize(): SourceMap.SourceNode {
        var node = new SourceMap.SourceNode(this.position.getStartLine() + 1, this.position.getStartColumn() + 1, this.position.getFileName());
        node
            .add("new r.SequenceIterator(")
            .add(super.serialize())
            .add(", [");
        this.its.forEach((it, index) => {
            node.add(it.serialize());
            if(index !== this.its.length - 1) {
                node.add(", ");
            }
        });
        node.add("])");
        return node;
    }
};

export = SequenceIterator;
