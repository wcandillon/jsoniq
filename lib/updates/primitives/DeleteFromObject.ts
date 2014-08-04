/// <reference path="../../../typings/lodash/lodash.d.ts" />
import _ = require("lodash");
//import jerr = require("../../errors");
import Transaction = require("../../stores/Transaction");

import UpdatePrimitive = require("./UpdatePrimitive");

class DeleteFromObject extends UpdatePrimitive {
    keys: string[];

    constructor(id: string, ordPath: string[], keys: string[]) {
        super(id, ordPath);
        this.keys = keys;
    }

    merge(udp: DeleteFromObject): UpdatePrimitive {
        this.keys = _.uniq(this.keys.concat(udp.keys));
        return this;
    }

    apply(transaction: Transaction): UpdatePrimitive {
        var target = this.getTarget(transaction);
        this.keys.forEach(function(key) {
            delete target[key];
        });
        return this;
    }
}

export = DeleteFromObject;
