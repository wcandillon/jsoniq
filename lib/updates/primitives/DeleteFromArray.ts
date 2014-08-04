/// <reference path="../../errors.ts" />
/// <reference path="../../stores/Store.ts" />
/// <reference path="../../../typings/lodash/lodash.d.ts" />
/// <reference path="./UpdatePrimitive.ts" />
//import _ = require("lodash");
import UpdatePrimitive = require("./UpdatePrimitive");

class DeleteFromArray extends UpdatePrimitive {
    position: number;

    constructor(target: string, position: number) {
        super(target);
        this.position = position;
    }

    apply(store: Store): UpdatePrimitive {
        var item = store.get(this.target);
        item.splice(this.position, 1);
        return this;
    }
}

export = DeleteFromArray;
