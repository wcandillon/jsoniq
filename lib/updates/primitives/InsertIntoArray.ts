/// <reference path="../../../typings/lodash/lodash.d.ts" />
//import _ = require("lodash");
//import jerr = require("../../errors");
import UpdatePrimitive = require("./UpdatePrimitive");

class InsertIntoArray extends UpdatePrimitive {
    position: number;
    items: any[];

    constructor(id: string, ordPath: string[], position: number, items: any[]) {
        super(id, ordPath);
        this.position = position;
        this.items = items;
    }

    merge(udp: InsertIntoArray): UpdatePrimitive {
        this.items.concat(udp.items);
        return this;
    }

    apply(): UpdatePrimitive {
        var target = this.getTarget();
        this.items.forEach((i) => {
            target.splice(this.position, 0, i);
        });
        return this;
    }
}

export = InsertIntoArray;
