/// <reference path="../../../typings/lodash/lodash.d.ts" />
//import _ = require("lodash");
import jerr = require("../../errors");

import Transaction = require("../../stores/Transaction");

class UpdatePrimitive {
    public id: string;
    public ordPath: string[];

    constructor(id: string, ordPath: string[]) {
        this.id = id;
        this.ordPath = ordPath;
    }

    private goTo(item: any, ordPath: string[]): any {
        if(ordPath.length === 0) {
            return item;
        } else {
            return this.goTo(item[this.ordPath[0]], ordPath.slice(1));
        }
    }

    getTarget(transaction: Transaction): any {
        var item = this.goTo(transaction.get(this.id), this.ordPath);
        if(!item) {
            throw new jerr.JNUP0008();
        } else {
            return item;
        }
    }

    apply(transaction: Transaction): UpdatePrimitive {
        throw new Error("This method is abstract");
    }

    merge(udp: UpdatePrimitive): UpdatePrimitive {
        throw new Error("This method is abstract");
    }

    inverse(item: any): UpdatePrimitive[] {
        throw new Error("This method is abstract");
    }
}

export = UpdatePrimitive;
