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
        var node = super.serialize();
        node.add("r.item([" + JSON.stringify(this.item.get()) + "])");
        return node;
    }
}
