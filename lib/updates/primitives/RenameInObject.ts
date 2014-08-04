/// <reference path="../../../typings/lodash/lodash.d.ts" />
//import _ = require("lodash");
//import jerr = require("../../errors");
import Store = require("../../stores/Store");
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
