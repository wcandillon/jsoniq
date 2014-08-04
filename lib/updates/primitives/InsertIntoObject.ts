/// <reference path="../../errors.ts" />
/// <reference path="../../stores/Store.ts" />
/// <reference path="../../../typings/lodash/lodash.d.ts" />
/// <reference path="./UpdatePrimitive.ts" />
import _ = require("lodash");
import UpdatePrimitive = require("./UpdatePrimitive");

class InsertIntoObject extends UpdatePrimitive {
    pairs: {};

    constructor(target: string, pairs: {}) {
        super(target);
        this.pairs = pairs;
    }

    merge(udp: InsertIntoObject): UpdatePrimitive {
        var keys = Object.keys(this.pairs);
        var newKeys = Object.keys(udp.pairs);
        var intersection = _.intersection(keys, newKeys);
        //An error jerr:JNUP0005 is raised if a collision occurs.
        if(intersection.length > 0) {
            throw new jerr.JNUP0005();
        } else {
            _.merge(this.pairs, udp.pairs);
        }
        return this;
    }

    apply(store: Store): UpdatePrimitive {
        var item = store.get(this.target);
        var that = this;
        Object.keys(this.pairs).forEach(function(key) {
            item[key] = that.pairs[key];
        });
        return this;
    }
}

export = InsertIntoObject;
