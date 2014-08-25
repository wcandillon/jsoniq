/// <reference path="../../../definitions/lodash/lodash.d.ts" />
//import _ = require("lodash");
//import jerr = require("../../errors");

import UpdatePrimitive = require("./UpdatePrimitive");

import IPUL = require("../IPUL");

class Insert extends UpdatePrimitive {
    id: string;
    item: any;

    constructor(id: string, item: any) {
        super("", []);
        this.id = id;
        this.item = item;
    }

    invert(target: any, pul: IPUL): UpdatePrimitive {
        pul.remove(this.id);
        return this;
    }
}

export = Insert;
