/// <reference path="../../../typings/tsd.d.ts" />
import SourceMap = require("source-map");

import Iterator = require("./Iterator");
import Position = require("../../compiler/parsers/Position");
import DynamicContext = require("../DynamicContext");
import Item = require("../items/Item");

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

    next(): Promise<Item> {
        if(this.closed) {
            return this.emptySequence();
        }
        return Promise.all([this.left.next(), this.right.next()]).then((values) => {
            this.closed = true;
            var left = values[0].get();
            var right = values[1].get();
            return Promise.resolve(new Item(left + (this.isPlus ? right : (- right))));
        });
    }

    reset(): Iterator {
        super.reset();
        this.left.reset();
        this.right.reset();
        return this;
    }

    setDynamicCtx(dctx: DynamicContext): AdditiveIterator {
        super.setDynamicCtx(dctx);
        this.left.setDynamicCtx(dctx);
        this.right.setDynamicCtx(dctx);
        return this;
    }

    serialize(fileName: string): SourceMap.SourceNode {
        var node = new SourceMap.SourceNode(this.position.getStartLine(), this.position.getEndColumn(), fileName);
        node
            .add("new AdditiveIterator(")
            .add(super.serialize(fileName))
            .add(", ")
            .add(this.left.serialize(fileName))
            .add(", ")
            .add(this.right.serialize(fileName))
            .add(", ")
            .add(JSON.stringify(this.isPlus))
            .add(")");
        return node;
    }
};

export = AdditiveIterator;
