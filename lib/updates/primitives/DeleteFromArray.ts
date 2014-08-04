/// <reference path="../../../typings/lodash/lodash.d.ts" />
//import _ = require("lodash");
//import jerr = require("../../errors");
import Store = require("../../stores/Store");
import UpdatePrimitive = require("./UpdatePrimitive");

class DeleteFromArray extends UpdatePrimitive {
    position: number;

    constructor(target: string, position: number) {
        super(target);
        this.position = position;
    }

    apply(store: Store): UpdatePrimitive {
        var item = store.get(this.target);
        item.splice(this.position, 1);
        return this;
    }
}

export = DeleteFromArray;
