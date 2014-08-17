/// <reference path="../../../typings/lodash/lodash.d.ts" />
//import _ = require("lodash");
import jerr = require("../../errors");

import Transaction = require("../../stores/Transaction");

import IPUL = require("../IPUL");

class UpdatePrimitive {
    public id: string;
    public ordPath: string[];
    private target: any;

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

    lockTarget(transaction: Transaction): UpdatePrimitive {
        var item = this.goTo(transaction.get(this.id), this.ordPath);
        if(!item) {
            throw new jerr.JNUP0008();
        } else {
            this.target = item;
        }
        return this;
    }

    getTarget(): any {
        return this.target;
    }

    apply(): UpdatePrimitive {
        throw new Error("This method is abstract");
    }

    merge(udp: UpdatePrimitive): UpdatePrimitive {
        throw new Error("This method is abstract");
    }

    invert(target: any, pul: IPUL): UpdatePrimitive {
        throw new Error("This method is abstract");
    }
}

export = UpdatePrimitive;
