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

    pullAll(tuples?: Tuple[]): Promise<Tuple[]> {
        tuples = tuples ? tuples : [];
        return this.pull().then(tuple => {
            if(tuple === undefined) {
                return Promise.resolve(tuples);
            } else {
                return this.pullAll(tuples.concat(tuple));
            }
        });
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
            this.state = undefined;
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

export class OrderClause extends Clause {

    private specs: { expr: Iterator; ascending: boolean; emptyGreatest: boolean }[];
    private state: Tuple[];

    constructor(
        position: Position, dctx: DynamicContext, parent: Clause, specs: { expr: Iterator; ascending: boolean; emptyGreatest: boolean }[]
    ) {
        super(position, dctx, parent);
        this.specs = specs;
    }

    pull(): Promise<Tuple> {
        if(this.closed) {
            return this.emptyTuple();
        }
        if(this.state) {
            if(this.state.length === 0) {
                this.closed = true;
                return this.emptyTuple();
            } else {
                Promise.resolve(this.state.splice(0, 1));
            }
        }
        return new Promise<Tuple>((resolve, reject) => {
            this.parent.pullAll().then(tuples => {
                var promises = [];
                _.forEach(tuples, tuple => {
                    //TODO: generalize to the all spec list
                    promises.push(this.evalSpec(tuple, this.specs[0]));
                });
                Promise.all(promises).then(results => {
                    this.state = _.chain<{spec: any; tuple: Tuple}>(results).sortBy("spec").map(val => {
                        return val.tuple;
                    }).value();
                    //console.log("STATE: " + JSON.stringify(this.state));
                    resolve(Promise.resolve(this.state.splice(0, 1)[0]));
                });
            });
        });
    }

    private evalSpec(tuple: Tuple, spec: { expr: Iterator; ascending: boolean; emptyGreatest: boolean }): Promise<{ spec: any; tuple: Tuple }> {
        return new Promise<{ spec: any; tuple: Tuple }>((resolve, reject) => {
            //spec.expr.reset();
            _.chain<Tuple>(tuple).forEach((it: Iterator, varName: string) => {
                this.dctx.setVariable("", varName, it);
            });
            spec.expr.next().then(item => {
                console.log("ITEM " + item.get());
                resolve({
                    spec: item.get(),
                    tuple: tuple
                });
            });
        });
    }

    reset(): OrderClause {
        super.reset();
        this.parent.reset();
        this.state = undefined;
        return this;
    }
}

export class WhereClause extends Clause {

    private expr: Iterator;
    private state: Promise<Tuple>;

    constructor(
        position: Position, dctx: DynamicContext, parent: Clause, expr: Iterator
    ) {
        super(position, dctx, parent);
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
            this.expr.reset();
            if(tuple === undefined) {
                this.closed = true;
                return this.emptyTuple();
            }
            return this.expr.next().then(item => {
                this.state = undefined;
                if(item && item.get()) {
                    return tuple;
                } else {
                    return this.pull();
                }
            });
        });
    }

    reset(): WhereClause {
        super.reset();
        this.state = undefined;
        this.parent.reset();
        this.expr.reset();
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
