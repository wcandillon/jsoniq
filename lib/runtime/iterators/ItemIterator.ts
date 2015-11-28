/// <reference path="../../../typings/tsd.d.ts" />
import Iterator from "./Iterator";
import Item from "../items/Item";
import Position from "../../compiler/parsers/Position";

import * as SourceMap from "source-map";

export default class ItemIterator extends Iterator {

    private item: Item;

    constructor(position: Position, item: Item) {
        super(position);
        this.item = item;
    }

    serialize(): SourceMap.SourceNode {
        var node = new SourceMap.SourceNode(this.position.getStartLine() + 1, this.position.getStartColumn() + 1, this.position.getFileName());
        node
            .add("new r.ItemIterator(")
            .add(super.serialize())
            .add(", new r.Item(")
            .add(JSON.stringify(this.item.get()))
            .add("))");
        return node;
    }
}
