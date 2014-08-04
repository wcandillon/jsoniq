/// <reference path="../../../typings/lodash/lodash.d.ts" />
//import _ = require("lodash");
//import jerr = require("../../errors");
import Transaction = require("../../stores/Transaction");

import UpdatePrimitive = require("./UpdatePrimitive");

class RenameInObject extends UpdatePrimitive {
    key: string;
    newKey: string;

    constructor(id: string, ordPath: string[], key: string, newKey: string) {
        super(id, ordPath);
        this.key = key;
        this.newKey = newKey;
    }

    apply(transaction: Transaction): UpdatePrimitive {
        var target = this.getTarget(transaction);
        target[this.newKey] = target[this.key];
        delete target[this.key];
        return this;
    }
}

export = RenameInObject;
