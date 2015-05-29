/// <reference path="../../../typings/tsd.d.ts" />
import Iterator = require("./Iterator");
import Position = require("../../compiler/parsers/Position");
import DynamicContext = require("../DynamicContext");
import Item = require("../items/Item");

class ComparisonIterator extends Iterator {

    private operator: string;
    private left: Iterator;
    private right: Iterator;

    constructor(position: Position, left: Iterator, right: Iterator, operator: string) {
        super(position);
        this.left = left;
        this.right = right;
        this.operator = operator;
    }

    next(): Promise<Item> {
        if(this.closed) {
            return this.emptySequence();
        }
        var valueOp: (left: any, right: any) => boolean;
        if(this.operator === "eq") {
            valueOp = function(left, right) {
                return left === right;
            };
        } else if(this.operator === "ne") {
            valueOp = function(left, right) {
                return left !== right;
            };
        } else if(this.operator === "lt" || this.operator === "<") {
            valueOp = function(left, right) {
                return left < right;
            };
        } else if(this.operator === "le") {
            valueOp = function(left, right) {
                return left <= right;
            };
        } else if(this.operator === "gt" || this.operator === ">") {
            valueOp = function(left, right) {
                return left > right;
            };
        } else if(this.operator === "ge") {
            valueOp = function(left, right) {
                return left >= right;
            };
        }
        if(valueOp) {
            this.closed = true;
            return Promise.all([this.left.next(), this.right.next()]).then(values => {
                var result = valueOp(values[0].get(), values[1].get());
                return Promise.resolve(new Item(result));
            });
        }
        throw new Error("Unknown operator: " + this.operator);
    }

    reset(): Iterator {
        super.reset();
        this.left.reset();
        this.right.reset();
        return this;
    }

    setDynamicCtx(dctx: DynamicContext): ComparisonIterator {
        super.setDynamicCtx(dctx);
        this.left.setDynamicCtx(dctx);
        this.right.setDynamicCtx(dctx);
        return this;
    }
};

export = ComparisonIterator;
