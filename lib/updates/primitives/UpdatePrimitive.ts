/// <reference path="../../../typings/lodash/lodash.d.ts" />
//import _ = require("lodash");
//import jerr = require("../../errors");
import Store = require("../../stores/Store");

class UpdatePrimitive {
    target: string;

    constructor(target: string) {
        this.target = target;
    }

    apply(store: Store): UpdatePrimitive {
        throw new Error("This method is abstract");
    }

    merge(udp: UpdatePrimitive): UpdatePrimitive {
        throw new Error("This method is abstract");
    }

    inverse(store: Store): UpdatePrimitive[] {
        throw new Error("This method is abstract");
    }
}

export = UpdatePrimitive;
