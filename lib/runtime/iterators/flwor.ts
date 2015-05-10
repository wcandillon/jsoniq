/// <reference path="../../../typings/tsd.d.ts" />
import _ = require("lodash");

import Iterator = require("./Iterator");
import ItemIterator = require("./ItemIterator");

import DynamicContext = require("../DynamicContext");
import Position = require("../../compiler/parsers/Position");

import Item = require("../items/Item");

export interface Tuple {
    [key: string]: Iterator;
}

export class Clause {

    protected position: Position;
    protected dctx: DynamicContext;
    protected parent: Clause;

    protected closed: boolean = false;

    constructor(position: Position, dctx: DynamicContext, parent: Clause) {
        this.position = position;
        this.dctx = dctx;
        this.parent = parent;
    }

    pull(): Promise<Tuple> {
        if(this.closed) {
            throw new Error("Stream has stopped");
        }
        return null;
    }

    materialize(tuples: Tuple[]): Promise<Tuple[]> {
        return this.pull().then(tuple => {
            tuples.push(tuple);
            if(this.closed) {
                return tuples;
            } else {
                return this.materialize(tuples);
            }
        });
    }

    materializes(): boolean {
        return false;
    }

    isClosed(): boolean {
        return this.closed;
    }
}

export class EmptyClause extends Clause {
    constructor() {
        super(null, null, null);
    }

    pull(): Promise<Tuple> {
        super.pull();
        this.closed = true;
        return Promise.resolve({});
    }
}

export class ForClause extends Clause {

    private varName: string;
    private allowEmpty: boolean;
    private positionalVar: string;
    private expr: Iterator;
    private state: { tuple: Promise<Tuple>; index: number };

    constructor(
        position: Position, dctx: DynamicContext, parent: Clause,
        varName: string, allowEmpty: boolean, positionalVar: string, expr: Iterator
    ) {
        super(position, dctx, parent);
        this.varName = varName;
        this.allowEmpty = allowEmpty;
        this.positionalVar = positionalVar;
        this.expr = expr;
    }

    pull(): Promise<Tuple> {
        super.pull();
        if(this.state === undefined) {
            this.state = {
                tuple: this.parent.pull(),
                index: 0
            };
        }
        return this.state.tuple.then(tuple => {
            return this.expr.next().then(item => {
                this.state.index++;
                tuple[this.varName] = new ItemIterator(item);
                if(this.positionalVar) {
                    tuple[this.positionalVar] = new ItemIterator(new Item(this.state.index));
                }
                //Add tuple to the dynamic context
                _.chain<Tuple>(tuple).forEach((it: Iterator, varName: string) => {
                    this.dctx.setVariable("", varName, it);
                });
                if(this.expr.isClosed() && !this.parent.isClosed()) {
                    this.state = undefined;
                    this.expr.reset();
                } else if(this.expr.isClosed() && this.parent.isClosed()) {
                    this.closed = true;
                } else {
                    this.state.tuple = Promise.resolve(tuple);
                }
                //console.log("for " + this.varName + " Tuple: " + JSON.stringify(tuple, null, 2));
                return Promise.resolve(tuple);
            });
        });
    }
}

export class ReturnIterator extends Iterator {

    private dctx: DynamicContext;
    private it: Iterator;
    private parent: Clause;
    private state: Promise<Tuple>;

    constructor(position: Position, dctx: DynamicContext, parent: Clause, it: Iterator) {
        super(position);
        this.dctx = dctx;
        this.parent = parent;
        this.it = it;
    }

    next(): Promise<Item> {
        super.next();
        if(this.state === undefined) {
            this.state = this.parent.pull();
        }
        return this.state.then(() => {
            return this.it.next().then(item => {
                //console.log(item.get());
                if(this.it.isClosed() && !this.parent.isClosed()) {
                    this.state = undefined;
                    this.it.reset();
                } else if(this.it.isClosed() && this.parent.isClosed()) {
                    this.closed = true;
                }
                return Promise.resolve(item);
            });
        });
    }

    reset(): Iterator {
        super.reset();
        this.state = undefined;
        this.it.reset();
        return this;
    }
};
