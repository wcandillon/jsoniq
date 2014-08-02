/// <reference path="../../errors.ts" />
/// <reference path="../../stores/Store.ts" />
/// <reference path="../../../typings/lodash/lodash.d.ts" />
/// <reference path="./UpdatePrimitive.ts" />
//import _ = require("lodash");
import UpdatePrimitive = require("./UpdatePrimitive");

class RenameInObject extends UpdatePrimitive {
    key: string;
    newKey: string;

    constructor(target: string, key: string, newKey: string) {
        super(target);
        this.key = key;
        this.newKey = newKey;
    }

    apply(store: Store): UpdatePrimitive {
        var item = store.get(this.target);
        item[this.newKey] = item[this.key];
        delete item[this.key];
        return this;
    }
}

export = RenameInObject;
