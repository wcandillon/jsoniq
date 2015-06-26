/// <reference path="../../../typings/tsd.d.ts" />
import Iterator = require("./Iterator");
import Position = require("../../compiler/parsers/Position");
import DynamicContext = require("../DynamicContext");
import Item = require("../items/Item");
import SourceMap = require("source-map");

class ArrayIterator extends Iterator {

    private expr: Iterator;

    constructor(position: Position, expr: Iterator) {
        super(position);
        this.expr = expr;
    }

    next(): Promise<Item> {
        if(this.closed) {
            return this.emptySequence();
        }
        var array = [];
        this.closed = true;
        return this.expr.forEach(item => {
            array.push(item.get());
        }).then(() => {
            return Promise.resolve(new Item(array));
        });
    }

    reset(): Iterator {
        super.reset();
        this.expr.reset();
        return this;
    }

    setDynamicCtx(dctx: DynamicContext): ArrayIterator {
        super.setDynamicCtx(dctx);
        this.expr.setDynamicCtx(dctx);
        return this;
    }

    serialize(): SourceMap.SourceNode {
        var node = new SourceMap.SourceNode(this.position.getStartLine() + 1, this.position.getEndColumn() + 1, this.position.getFileName());
        node
            .add("new r.ArrayIterator(")
            .add(super.serialize())
            .add(", ")
            .add(this.expr.serialize())
            .add(")");
        return node;
    }
};

export = ArrayIterator;
