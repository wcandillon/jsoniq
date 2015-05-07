/// <reference path="../../../typings/tsd.d.ts" />
import _ = require("lodash");

import Iterator = require("./Iterator");
import ItemIterator = require("./ItemIterator");

import DynamicContext = require("../DynamicContext");
import Position = require("../../compiler/parsers/Position");

export interface Tuple {
    [key: string]: Iterator;
}

export class Clause {

    protected position: Position;
    protected dctx: DynamicContext;
    protected parent: Clause;

    protected closed: boolean = false;
    protected state: any;

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

    merge(tuple: Tuple) {
        _.forEach(tuple, (value: Iterator, name: string) => {
            this.dctx.setVariable('', name, value);
        });
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
        var needsMerge = false;
        if(this.state === undefined) {
            this.state = this.parent.pull();
            needsMerge = true;
        }
        return this.state.then(tuple => {
            if(needsMerge) {
                this.merge(tuple);
            }
            return this.expr.next().then(item => {
                if(this.expr.isClosed() && !this.parent.isClosed()) {
                    this.state = undefined;
                    this.expr.reset();
                } else if(this.expr.isClosed() && this.parent.isClosed()) {
                    this.closed = true;
                } else {
                    this.state = Promise.resolve(tuple);
                }
                tuple[this.varName] = new ItemIterator(item);
                return Promise.resolve(tuple);
            });
        });
    }
}

export class ReturnIterator extends Iterator {

    private it: Iterator;
    private parent: Clause;

    constructor(position: Position, parent: Clause, it: Iterator) {
        super(position);
        this.parent = parent;
        this.it = it;
    }

    next(): Promise<any> {
        super.next();
        return this.parent.pull().then(tuple => {
            return this.it.next();
        });
    }

    isClosed(): boolean {
        return this.parent.isClosed();
    }
};
