/// <reference path="../../../typings/lodash/lodash.d.ts" />
//import _ = require("lodash");
//import jerr = require("../../errors");

import UpdatePrimitive = require("./UpdatePrimitive");

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
}

export = DeleteFromArray;
