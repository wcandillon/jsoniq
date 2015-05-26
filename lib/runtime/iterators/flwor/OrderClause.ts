import _ = require("lodash");

import Position = require("../../../compiler/parsers/Position");

import DynamicContext = require("../../DynamicContext");

import Iterator = require("../Iterator");

import Clause = require("./Clause");
import Tuple = require("./Tuple");

class OrderClause extends Clause {

    private specs: { expr: Iterator; ascending: boolean; emptyGreatest: boolean }[];
    private state: Tuple[];

    constructor(
        position: Position, specs: { expr: Iterator; ascending: boolean; emptyGreatest: boolean }[]
    ) {
        super(position);
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
                _.forEach(tuples, (tuple: Tuple) => {
                    //TODO: generalize to the all spec list
                    promises.push(this.evalSpec(tuple, this.specs[0]));
                });
                return Promise.all(promises).then(results => {
                    console.log(results.length);
                    console.log(results);
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

    setDynamicCtx(dctx: DynamicContext): Clause {
        super.setDynamicCtx(dctx);
        this.specs.forEach(spec => {
            spec.expr.setDynamicCtx(dctx);
        });
        return this;
    }
}

export = OrderClause;
