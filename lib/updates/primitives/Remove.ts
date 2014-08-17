/// <reference path="../../../typings/lodash/lodash.d.ts" />
//import _ = require("lodash");
//import jerr = require("../../errors");

import UpdatePrimitive = require("./UpdatePrimitive");

import IPUL = require("../IPUL");

class Delete extends UpdatePrimitive {
    id: string;

    constructor(id: string) {
        super("", []);
        this.id = id;
    }

    invert(target: any, pul: IPUL): UpdatePrimitive {
        pul.insert(this.id, target);
        return this;
    }
}

export = Delete;
