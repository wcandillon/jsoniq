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
                return Promise.resolve(this.state.splice(0, 1)[0]);
            }
        }
        return new Promise<Tuple>((resolve, reject) => {
            this.parent.pullAll().then(tuples => {
                var promises = [];
                var asc = this.specs[0].ascending;
                //var empty = this.specs[0].emptyGreatest;
                tuples.forEach(tuple => {
                    //TODO: generalize to the all spec list
                    promises.push(this.evalSpec(tuple, this.specs[0]));
                });
                return Promise.all(promises).then(results => {
                    var sequence = _.chain<{spec: any; tuple: Tuple}>(results).sortBy("spec");
                    if(!asc) {
                        sequence = sequence.reverse();
                    }
                    this.state = sequence.map(val => {
                        return val.tuple;
                    }).value();
                    resolve(Promise.resolve(this.state.splice(0, 1)[0]));
                }).catch(error => {
                    console.error(error.stack);
                    reject(error);
                });
            });
        });
    }

    private evalSpec(tuple: Tuple, spec: { expr: Iterator; ascending: boolean; emptyGreatest: boolean }): Promise<{ spec: any; tuple: Tuple }> {
        return new Promise<{ spec: any; tuple: Tuple }>((resolve, reject) => {
            tuple.getVariableNames().forEach(varName => {
                this.dctx.setVariable("", varName, tuple.getVariable(varName));
            });
            spec.expr.reset();
            spec.expr.next().then(item => {
                resolve({
                    spec: item.get(),
                    tuple: tuple
                });
            }).catch(error => {
                console.error(error.stack);
                reject(error);
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