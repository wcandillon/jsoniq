/// <reference path="../../../typings/tsd.d.ts" />

import Iterator = require("./Iterator");
import ItemIterator = require("./ItemIterator");

import DynamicContext = require("../DynamicContext");

export interface Tuple {
    [key: string]: Iterator;
}

export class Clause {

    protected closed: boolean = false;
    protected state: any;
    protected parent: Clause;

    constructor(parent: Clause) {
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
        super(null);
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

    constructor(parent: Clause, varName: string, allowEmpty: boolean, positionalVar: string, expr: Iterator) {
        super(parent);
        this.varName = varName;
        this.allowEmpty = allowEmpty;
        this.positionalVar = positionalVar;
        this.expr = expr;
    }

    pull(): Promise<Tuple> {
        super.pull();
        if(this.state === undefined) {
            this.state = this.parent.pull();
            this.expr.reset();
        }
        return this.state.then(tuple => {
            return this.expr.next().then(item => {
                if(this.expr.isClosed() && !this.parent.isClosed()) {
                    this.state = undefined;
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

    constructor(parent: Clause, it: Iterator) {
        super();
        this.parent = parent;
        this.it = it;
    }

    next(): Promise<any> {
        super.next();
        return this.parent.pull().then(tuple => {
            return (new ItemIterator(1)).next();
        });
    }

    isClosed(): boolean {
        return this.parent.isClosed();
    }
};
