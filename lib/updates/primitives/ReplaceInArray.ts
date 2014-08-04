/// <reference path="../../errors.ts" />
/// <reference path="../../stores/Store.ts" />
/// <reference path="../../../typings/lodash/lodash.d.ts" />
/// <reference path="./UpdatePrimitive.ts" />
//import _ = require("lodash");
import UpdatePrimitive = require("./UpdatePrimitive");

class ReplaceInArray extends UpdatePrimitive {
    position: number;
    item: any;

    constructor(target: string, position: number, item: any) {
        super(target);
        this.position = position;
        this.item = item;
    }

    apply(store: Store): UpdatePrimitive {
        var item = store.get(this.target);
        item[this.position] = this.item;
        return this;
    }
}

export = ReplaceInArray;
