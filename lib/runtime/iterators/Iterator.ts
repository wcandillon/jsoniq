/// <reference path="../../../typings/tsd.d.ts" />
import _ = require("lodash");
import SourceMap = require("source-map");
import Position = require("../../compiler/parsers/Position");
//import StaticContext = require("../../compiler/StaticContext");
import DynamicContext = require("../DynamicContext");
import Item = require("../items/Item");

class Iterator {

    protected position: Position;
    protected dctx: DynamicContext;
    protected closed: boolean = false;

    protected emptySequence(): Promise<Item> {
        return Promise.resolve(undefined);
    }

    constructor(position: Position) {
        this.position = position;
    }

    next(): Promise<Item> {
        return this.emptySequence();
    }

    reset(): Iterator {
        this.closed = false;
        return this;
    }

    forEach(callback:  (item: Item) => void): Promise<any> {
        return this.next().then(item => {
            if(item !== undefined) {
                callback(item);
                return this.forEach(callback);
            }
        });
    }

    toString(): string {
        return JSON.stringify(this, null, 2);
    }

    setDynamicCtx(dctx: DynamicContext): Iterator {
        this.dctx = dctx;
        return this;
    }

    serialize(fileName: string): SourceMap.SourceNode {
        var chunk = _.template("new Position(<%= sl %>, <%= sc %>, <%= el %>, <%= ec %>)")(this.position);
        return new SourceMap.SourceNode(this.position.getStartLine() + 1, this.position.getEndColumn() + 1, fileName, chunk, "position");
    }
}

export = Iterator;
