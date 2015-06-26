//import _ = require("lodash");
import Position = require("../../../compiler/parsers/Position");

import Iterator = require("../Iterator");
import Item = require("../../items/Item");
import Clause = require("./Clause");
import RootClause = require("./RootClause");
import Tuple = require("./Tuple");
import DynamicContext = require("../../DynamicContext");
import SourceMap = require("source-map");

class FLWORIterator extends Iterator {

    private clauses: Clause[];
    private leafClause: Clause;
    private returnExpr: Iterator;
    private state: Promise<Tuple>;

    constructor(position: Position, clauses: Clause[], returnExpr: Iterator) {
        super(position);
        this.clauses = clauses;
        this.returnExpr = returnExpr;
    }

    next(): Promise<Item> {
        if(this.closed) {
            return this.emptySequence();
        }
        if(this.state === undefined) {
            this.state = this.leafClause.pull();
        }
        return this.state.then(tuple => {
            if(tuple === undefined) {
                this.closed = true;
                return this.emptySequence();
            }
            this.state = Promise.resolve(tuple);
            tuple.getVariableNames().forEach(varName => {
                this.dctx.setVariable("", varName, tuple.getVariable(varName));
            });
            return this.returnExpr.next().then(item => {
                if(item === undefined) {
                    this.state = undefined;
                    this.returnExpr.reset();
                    return this.next();
                }
                return Promise.resolve(item);
            });
        });
    }

    reset(): FLWORIterator {
        super.reset();
        this.returnExpr.reset();
        this.leafClause.reset();
        this.state = undefined;
        return this;
    }

    setDynamicCtx(dctx: DynamicContext): FLWORIterator {
        super.setDynamicCtx(dctx);
        var d = dctx;
        this.clauses.forEach(clause => {
            d = d.createContext();
            clause.setDynamicCtx(dctx);
        });
        this.returnExpr.setDynamicCtx(d);
        this.leafClause = new RootClause();
        this.clauses.forEach(clause => {
            clause.setParent(this.leafClause);
            this.leafClause = clause;
        });
        return this;
    }

    serialize(): SourceMap.SourceNode {
        var node = new SourceMap.SourceNode(this.position.getStartLine() + 1, this.position.getEndColumn() + 1, this.position.getFileName());
        node
            .add("new r.FLWORIterator(")
            .add(super.serialize())
            .add(", [");
        this.clauses.map((clause, i) => {
            var isLast = i === this.clauses.length - 1;
            node.add(clause.serialize());
            if(!isLast) {
                node.add(", ");
            }
        });
        node
            .add("], ")
            .add(this.returnExpr.serialize())
            .add(")");
        return node;
    }
}

export = FLWORIterator;
