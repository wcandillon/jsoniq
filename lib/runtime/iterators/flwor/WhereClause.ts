import Position = require("../../../compiler/parsers/Position");

import DynamicContext = require("../../DynamicContext");

import Iterator = require("../Iterator");

import Clause = require("./Clause");
import Tuple = require("./Tuple");

class WhereClause extends Clause {

    private expr: Iterator;
    private state: Promise<Tuple>;

    constructor(
        position: Position, expr: Iterator
    ) {
        super(position);
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

    setDynamicCtx(dctx: DynamicContext): Clause {
        super.setDynamicCtx(dctx);
        this.expr.setDynamicCtx(dctx);
        return this;
    }
}

export = WhereClause;
