/// <reference path="../../../typings/tsd.d.ts" />
import _ = require("lodash");
import Iterator = require("./Iterator");
import Position = require("../../compiler/parsers/Position");
import DynamicContext = require("../DynamicContext");
import Item = require("../items/Item");

class ObjectIterator extends Iterator {

    private pairs: Iterator[];

    constructor(position: Position, pairs: Iterator[]) {
        super(position);
        this.pairs = pairs;
    }

    next(): Promise<Item> {
        if(this.closed) {
            return this.emptySequence();
        }
        this.closed = true;
        var object = {};
        //console.log("Pairs:" + JSON.stringify(this.pairs, null, 2));
        //if(this.pairs.length === 0) {
        //    return Promise.resolve(new Item(object));
        //}
        return Promise.all(this.pairs.map(pair => { return pair.next(); })).then(pairs => {
            _.chain<Item[]>(pairs).filter(pair => { return pair !== undefined; }).forEach((pair: Item) => {
                _.chain(pair.get()).forEach((value, key) => {
                    object[key] = value;
                });
            });
            return Promise.resolve<Item>(new Item(object));
        });
    }

    reset(): Iterator {
        super.reset();
        this.pairs.forEach(pair => {
            pair.reset();
        });
        return this;
    }

    setDynamicCtx(dctx: DynamicContext): ObjectIterator {
        super.setDynamicCtx(dctx);
        this.pairs.forEach(it => {
            it.setDynamicCtx(dctx);
        });
        return this;
    }
};

export = ObjectIterator;
