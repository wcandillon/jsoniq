import Position = require("../../../compiler/parsers/Position");

import DynamicContext = require("../../DynamicContext");

import Iterator = require("../Iterator");

import Clause = require("./Clause");
import Tuple = require("./Tuple");

import SourceMap = require("source-map");

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

    serialize(): SourceMap.SourceNode {
        var node = new SourceMap.SourceNode(this.pos.getStartLine() + 1, this.pos.getEndColumn() + 1, this.pos.getFileName());
         node
         .add("new r.WhereClause(")
         .add(super.serialize())
         .add(", ")
         .add(this.expr.serialize())
         .add(")");
        return node;
    }
}

export = WhereClause;
