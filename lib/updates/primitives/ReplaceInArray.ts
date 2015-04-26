/// <reference path="../../../typings/lodash/lodash.d.ts" />
//import _ = require("lodash");
import jerr = require("../../errors");
import UpdatePrimitive = require("./UpdatePrimitive");

import IPUL = require("../IPUL");

class ReplaceInArray extends UpdatePrimitive {
    position: number;
    item: any;

    constructor(id: string, ordPath: string[], position: number, item: any) {
        super(id, ordPath);
        this.position = position;
        this.item = item;
    }

    apply(): UpdatePrimitive {
        var target = this.getTarget();
        if(target[this.position] === undefined) {
            throw new jerr.JNUP0016("" + this.position);
        }
        target[this.position] = this.item;
        return this;
    }

    invert(item: any, pul: IPUL): UpdatePrimitive {
        pul.deleteFromArray(this.id, this.ordPath, this.position);
        pul.insertIntoArray(this.id, this.ordPath, this.position, item);
        return this;
    }
}

export = ReplaceInArray;
