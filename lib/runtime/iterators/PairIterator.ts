/// <reference path="../../../typings/tsd.d.ts" />
import Iterator = require("./Iterator");
import Position = require("../../compiler/parsers/Position");
import DynamicContext = require("../DynamicContext");
import Item = require("../items/Item");
import SourceMap = require("source-map");

class PairIterator extends Iterator {

    private key: Iterator;
    private value: Iterator;

    constructor(position: Position, key: Iterator, value: Iterator) {
        super(position);
        this.key = key;
        this.value = value;
    }

    next(): Promise<Item> {
        if(this.closed) {
            return this.emptySequence();
        }
        this.closed = true;
        var object = {};
        return this.key.next().then((key: Item) => {
            var values = [];
            return this.value.forEach(item => {
                values.push(item.get());
            }).then(() => {
                if(values.length > 1) {
                    object[key.get()] = values;
                } else {
                    object[key.get()] = values[0];
                }
                return Promise.resolve(new Item(object));
            });
        });
    }

    reset(): Iterator {
        super.reset();
        this.key.reset();
        this.value.reset();
        return this;
    }

    setDynamicCtx(dctx: DynamicContext): PairIterator {
        super.setDynamicCtx(dctx);
        this.key.setDynamicCtx(dctx);
        this.value.setDynamicCtx(dctx);
        return this;
    }

    serialize(): SourceMap.SourceNode {
        var node = new SourceMap.SourceNode(this.position.getStartLine() + 1, this.position.getEndColumn() + 1, this.position.getFileName());
        node
            .add("new r.PairIterator(")
            .add(super.serialize())
            .add(", ")
            .add(this.key.serialize())
            .add(", ")
            .add(this.value.serialize())
            .add(")");
        return node;
    }
};

export = PairIterator;
