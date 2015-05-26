import _ = require("lodash");

import Position = require("../../../compiler/parsers/Position");

import DynamicContext = require("../../DynamicContext");
import Item = require("../../items/Item");

import Iterator = require("../Iterator");
import ItemIterator = require("../ItemIterator");

import Clause = require("./Clause");
import Tuple = require("./Tuple");

class ForClause extends Clause {

    private varName: string;
    private allowEmpty: boolean;
    private positionalVar: string;
    private expr: Iterator;
    private state: { tuple: Promise<Tuple>; index: number };

    constructor(
        position: Position, varName: string, allowEmpty: boolean, positionalVar: string, expr: Iterator
    ) {
        super(position);
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
                    //TODO: return {};
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
                //TODO: return tuple
                return Promise.resolve(tuple);
            });
        });
    }

    setDynamicCtx(dctx: DynamicContext): Clause {
        super.setDynamicCtx(dctx);
        this.expr.setDynamicCtx(dctx);
        return this;
    }

    reset(): ForClause {
        super.reset();
        this.state = undefined;
        this.parent.reset();
        this.expr.reset();
        return this;
    }
}

export = ForClause;
