/// <reference path="../../../typings/lodash/lodash.d.ts" />
//import _ = require("lodash");
//import jerr = require("../../errors");
import Transaction = require("../../stores/Transaction");

import UpdatePrimitive = require("./UpdatePrimitive");

class ReplaceInObject extends UpdatePrimitive {
    key: string;
    item: any;

    constructor(id: string, ordPath: string[], key: string, item: any) {
        super(id, ordPath);
        this.key = key;
        this.item = item;
    }

    apply(transaction: Transaction): UpdatePrimitive {
        var target = this.getTarget(transaction);
        target[this.key] = this.item;
        return this;
    }
}

export = ReplaceInObject;
