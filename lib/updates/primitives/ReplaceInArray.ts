/// <reference path="../../../typings/lodash/lodash.d.ts" />
//import _ = require("lodash");
//import jerr = require("../../errors");

import UpdatePrimitive = require("./UpdatePrimitive");

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
        target[this.position] = this.item;
        return this;
    }
}

export = ReplaceInArray;
