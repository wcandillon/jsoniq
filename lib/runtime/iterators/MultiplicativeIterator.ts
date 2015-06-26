/// <reference path="../../../typings/tsd.d.ts" />
import Iterator = require("./Iterator");
import Position = require("../../compiler/parsers/Position");
import DynamicContext = require("../DynamicContext");
import Item = require("../items/Item");
import SourceMap = require("source-map");

class MultiplicativeIterator extends Iterator {

    private operator: string;
    private left: Iterator;
    private right: Iterator;

    constructor(position: Position, right: Iterator, left: Iterator, operator: string) {
        super(position);
        this.left = left;
        this.right = right;
        this.operator = operator;
    }

    next(): Promise<Item> {
        if(this.closed) {
            return this.emptySequence();
        }
        return Promise.all([this.left.next(), this.right.next()]).then<Item>((values) => {
            this.closed = true;
            var left = values[0].get();
            var right = values[1].get();
            var result: number;
            if(this.operator === "*") {
                result = left * right;
            } else if(this.operator === "div") {
                result = left / right;
            } else if(this.operator === "idiv") {
                result = Math.floor(left / right);
            } else if(this.operator === "mod") {
                result = left % right;
            }
            return Promise.resolve<Item>(new Item(result));
        });
    }

    reset(): Iterator {
        super.reset();
        this.left.reset();
        this.right.reset();
        return this;
    }

    setDynamicCtx(dctx: DynamicContext): MultiplicativeIterator {
        super.setDynamicCtx(dctx);
        this.left.setDynamicCtx(dctx);
        this.right.setDynamicCtx(dctx);
        return this;
    }

    serialize(): SourceMap.SourceNode {
        var node = new SourceMap.SourceNode(this.position.getStartLine() + 1, this.position.getStartColumn() + 1, this.position.getFileName());
        node
            .add("new r.MultiplicativeIterator(")
            .add(super.serialize())
            .add(", ")
            .add(this.right.serialize())
            .add(", ")
            .add(this.left.serialize())
            .add(", ")
            .add(JSON.stringify(this.operator))
            .add(")");
        return node;
    }
};

export = MultiplicativeIterator;
