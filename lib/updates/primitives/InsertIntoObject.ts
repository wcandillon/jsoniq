/// <reference path="../../../typings/lodash/lodash.d.ts" />
import _ = require("lodash");
import jerr = require("../../errors");

import UpdatePrimitive = require("./UpdatePrimitive");

class InsertIntoObject extends UpdatePrimitive {
    pairs: {};

    constructor(target: string, ordPath: string[], pairs: {}) {
        super(target, ordPath);
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

    apply(): UpdatePrimitive {
        var target = this.getTarget();
        Object.keys(this.pairs).forEach((key) => {
            //It is a dynamic error if upd:applyUpdates causes an object to contain two pairs with the same name.
            if(target[key]) {
                throw new jerr.JNUP0006(key);
            } else {
                target[key] = this.pairs[key];
            }
        });
        return this;
    }
}

export = InsertIntoObject;
