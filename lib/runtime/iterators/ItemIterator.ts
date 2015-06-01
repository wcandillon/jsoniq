/// <reference path="../../../typings/tsd.d.ts" />
import Iterator = require("./Iterator");

import Item = require("../items/Item");
import Position = require("../../compiler/parsers/Position");

import SourceMap = require("source-map");

class ItemIterator extends Iterator {

    private item: Item;

    constructor(position: Position, item: Item) {
        super(position);
        this.item = item;
    }

    next(): Promise<Item> {
        if(this.closed) {
            return this.emptySequence();
        }
        this.closed = true;
        return Promise.resolve(this.item);
    }

    serialize(fileName: string): SourceMap.SourceNode {
        var node = new SourceMap.SourceNode(this.position.getStartLine(), this.position.getEndColumn(), fileName);
        node
            .add("new ItemIterator(")
            .add(JSON.stringify(this.item.get()))
            .add(")");
        return node;
    }
};

export = ItemIterator;
