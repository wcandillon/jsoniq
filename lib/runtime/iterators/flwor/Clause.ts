import Position = require("../../../compiler/parsers/Position");
import DynamicContext = require("../../DynamicContext");

import Tuple = require("./Tuple");

class Clause {

    protected parent;
    protected pos: Position;
    protected dctx: DynamicContext;
    protected closed: boolean = false;

    constructor(pos:Position) {
        this.pos = pos;
    }

    pull(): Promise<Tuple> {
        throw new Error("Abstract Method.");
    }

    pullAll(tuples?: Tuple[]): Promise<Tuple[]> {
        tuples = tuples ? tuples : [];
        return this.pull().then(tuple => {
            if(tuple === undefined) {
                return Promise.resolve(tuples);
            } else {
                tuples.push(tuple);
                return this.pullAll(tuples);
            }
        });
    }

    emptyTuple(): Promise<Tuple> {
        return Promise.resolve(undefined);
    }

    setDynamicCtx(dctx:DynamicContext): Clause {
        this.dctx = dctx;
        return this;
    }

    setParent(parent: Clause): Clause {
        this.parent = parent;
        return this;
    }

    reset(): Clause {
        this.closed = false;
        return this;
    }
}

export = Clause;
