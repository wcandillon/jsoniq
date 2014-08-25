/// <reference path="../../../definitions/lodash/lodash.d.ts" />
//import _ = require("lodash");
//import jerr = require("../../errors");

import UpdatePrimitive = require("./UpdatePrimitive");

import IPUL = require("../IPUL");

class DeleteFromArray extends UpdatePrimitive {
    position: number;

    constructor(id: string, ordPath: string[], position: number) {
        super(id, ordPath);
        this.position = position;
    }

    apply(): UpdatePrimitive {
        var target = this.getTarget();
        target.splice(this.position, 1);
        return this;
    }

    invert(target: any, pul: IPUL): UpdatePrimitive {
        pul.insertIntoArray(this.id, this.ordPath, this.position, target);
        return this;
    }
}

export = DeleteFromArray;
