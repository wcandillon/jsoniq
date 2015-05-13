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
        return undefined;
    }

    reset(): Clause {
        this.closed = false;
        return this;
    }

    emptyTuple(): Promise<Tuple> {
        return Promise.resolve(undefined);
    }
}

export class EmptyClause extends Clause {
    constructor() {
        super(null, null, null);
    }

    pull(): Promise<Tuple> {
        if(this.closed) {
            return this.emptyTuple();
        }
        this.closed = true;
        return Promise.resolve({});
    }

    reset(): EmptyClause {
        super.reset();
        return this;
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
        if(this.closed) {
            return this.emptyTuple();
        }
        if(this.state === undefined) {
            this.state = {
                tuple: this.parent.pull(),
                index: 0
            };
        }
        return this.state.tuple.then(tuple => {
            if(tuple === undefined) {
                this.closed = true;
                if(this.allowEmpty) {
                    return Promise.resolve({});
                } else {
                    return this.emptyTuple();
                }
            }
            return this.expr.next().then(item => {
                this.state.tuple = Promise.resolve(tuple);
                if(item === undefined) {
                    this.state = undefined;
                    this.expr.reset();
                    return this.pull();
                } else {
                    this.state.index++;
                    tuple[this.varName] = new ItemIterator(item);
                    if(this.positionalVar !== undefined) {
                        tuple[this.positionalVar] = new ItemIterator(new Item(this.state.index));
                    }
                    //Add tuple to the dynamic context
                    _.chain<Tuple>(tuple).forEach((it: Iterator, varName: string) => {
                        this.dctx.setVariable("", varName, it);
                    });
                }
                return Promise.resolve(tuple);
            });
        });
    }

    reset(): ForClause {
        super.reset();
        this.state = undefined;
        this.parent.reset();
        this.expr.reset();
        return this;
    }
}

export class LetClause extends Clause {

    private varName: string;
    private expr: Iterator;
    private state: Promise<Tuple>;

    constructor(
        position: Position, dctx: DynamicContext, parent: Clause,
        varName: string, expr: Iterator
    ) {
        super(position, dctx, parent);
        this.varName = varName;
        this.expr = expr;
    }

    pull(): Promise<Tuple> {
        if(this.closed) {
            return this.emptyTuple();
        }

        if(this.state === undefined) {
            this.state = this.parent.pull();
        }

        return this.state.then(tuple => {
            if(tuple === undefined) {
                this.closed = true;
                return this.emptyTuple();
            }
            tuple[this.varName] = this.expr;
            //Add tuple to the dynamic context
            _.chain<Tuple>(tuple).forEach((it: Iterator, varName: string) => {
                this.dctx.setVariable("", varName, it);
            });
            this.state = this.parent.pull();
            return Promise.resolve(tuple);
        });
    }

    reset(): LetClause {
        super.reset();
        this.state = undefined;
        this.parent.reset();
        return this;
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
        if(this.closed) {
            return this.emptySequence();
        }
        if(this.state === undefined) {
            this.state = this.parent.pull();
        }
        return this.state.then(tuple => {
            if(tuple === undefined) {
                this.closed = true;
                return this.emptySequence();
            }
            this.state = Promise.resolve(tuple);
            return this.it.next().then(item => {
                if(item === undefined) {
                    this.state = undefined;
                    this.it.reset();
                    return this.next();
                }
                return Promise.resolve(item);
            });
        });
    }

    reset(): Iterator {
        super.reset();
        this.it.reset();
        this.parent.reset();
        this.state = undefined;
        return this;
    }
};
