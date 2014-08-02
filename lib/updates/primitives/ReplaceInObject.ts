/// <reference path="../../errors.ts" />
/// <reference path="../../stores/Store.ts" />
/// <reference path="../../../typings/lodash/lodash.d.ts" />
/// <reference path="./UpdatePrimitive.ts" />
//import _ = require("lodash");
import UpdatePrimitive = require("./UpdatePrimitive");

class ReplaceInObject extends UpdatePrimitive {
    key: string;
    item: any;

    constructor(target: string, key: string, item: any) {
        super(target);
        this.key = key;
        this.item = item;
    }

    apply(store: Store): UpdatePrimitive {
        var item = store.get(this.target);
        item[this.key] = this.item;
        return this;
    }
}

export = ReplaceInObject;
