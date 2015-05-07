/// <reference path="../../../typings/tsd.d.ts" />
import Position = require("../../compiler/parsers/Position");
import StaticContext = require("../../compiler/StaticContext");
import DynamicContext = require("../DynamicContext");

class Iterator {

    protected position: Position;
    protected sctx: StaticContext;
    protected dctx: DynamicContext;

    protected closed: boolean = false;
    protected state: any;

    constructor(position: Position, sctx: StaticContext, dctx: DynamicContext) {
        this.position = position;
        this.sctx = sctx;
        this.dctx = dctx;
    }

    next(): Promise<any> {
        if(this.closed) {
            throw new Error("Iterator is closed.");
        }
        return null;
    }

    reset(): Iterator {
        this.state = undefined;
        this.closed = false;
        return this;
    }

    forEach(callback:  (item: any) => void): Iterator {
        this.next().then(item => {
            callback(item);
            if(!this.isClosed()) {
                this.forEach(callback);
            }
        });
        return this;
    }

    isClosed(): boolean {
        return this.closed;
    }
}

export = Iterator;
