/// <reference path="../../../typings/tsd.d.ts" />
import Position = require("../../compiler/parsers/Position");
//import StaticContext = require("../../compiler/StaticContext");
//import DynamicContext = require("../DynamicContext");

import Item = require("../items/Item");

class Iterator {

    protected position: Position;

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
}

export = Iterator;
