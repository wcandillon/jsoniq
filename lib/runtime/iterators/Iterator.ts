/// <reference path="../../../typings/tsd.d.ts" />
import Position = require("../../compiler/parsers/Position");
//import StaticContext = require("../../compiler/StaticContext");
//import DynamicContext = require("../DynamicContext");

import Item = require("../items/Item");

class Iterator {

    protected position: Position;

    protected closed: boolean = false;

    constructor(position: Position) {
        this.position = position;
    }

    next(): Promise<Item> {
        if(this.closed) {
            throw new Error("Iterator is closed.");
        }
        return Promise.resolve(new Item(undefined));
    }

    reset(): Iterator {
        this.closed = false;
        return this;
    }

    forEach(callback:  (item: Item) => void): Promise<any> {
        return this.next().then(item => {
            callback(item);
            if(!this.isClosed()) {
                return this.forEach(callback);
            }
        });
    }

    isClosed(): boolean {
        return this.closed;
    }

    toString(): string {
        return JSON.stringify(this, null, 2);
    }
}

export = Iterator;
