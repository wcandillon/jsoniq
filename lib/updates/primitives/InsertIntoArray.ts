/// <reference path="../../../typings/lodash/lodash.d.ts" />
//import _ = require("lodash");
//import jerr = require("../../errors");
import Store = require("../../stores/Store");
import UpdatePrimitive = require("./UpdatePrimitive");

class InsertIntoArray extends UpdatePrimitive {
    position: number;
    items: any[];

    constructor(target: string, position: number, items: any[]) {
        super(target);
        this.position = position;
        this.items = items;
    }

    merge(udp: InsertIntoArray): UpdatePrimitive {
        this.items.concat(udp.items);
        return this;
    }

    apply(store: Store): UpdatePrimitive {
        var item = store.get(this.target);
        var that = this;
        this.items.forEach(function(i) {
            item.splice(that.position, 0, i);
        });
        return this;
    }
}

export = InsertIntoArray;
