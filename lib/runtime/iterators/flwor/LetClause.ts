import Position = require("../../../compiler/parsers/Position");

import DynamicContext = require("../../DynamicContext");

import Iterator = require("../Iterator");

import Clause = require("./Clause");
import Tuple = require("./Tuple");

import SourceMap = require("source-map");

class LetClause extends Clause {

    private varName: string;
    private expr: Iterator;
    private state: Promise<Tuple>;

    constructor(
        position: Position, varName: string, expr: Iterator
    ) {
        super(position);
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
            tuple.addVariable(this.varName, this.expr);
            tuple.getVariableNames().forEach(varName => {
                this.dctx.setVariable("", varName, tuple.getVariable(varName));
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

    setDynamicCtx(dctx: DynamicContext): Clause {
        super.setDynamicCtx(dctx);
        this.expr.setDynamicCtx(dctx);
        return this;
    }

    serialize(): SourceMap.SourceNode {
        var node = new SourceMap.SourceNode(this.pos.getStartLine() + 1, this.pos.getStartColumn() + 1, this.pos.getFileName());
        node
            .add("new r.LetClause(")
            .add(super.serialize())
            .add(", ")
            .add(JSON.stringify(this.varName))
            .add(", ")
            .add(this.expr.serialize())
            .add(")");
        return node;
    }
}

export = LetClause;
