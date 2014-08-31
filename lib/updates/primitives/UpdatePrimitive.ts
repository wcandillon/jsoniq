/// <reference path="../../../definitions/lodash/lodash.d.ts" />
/// <reference path="../../../definitions/es6-promise/es6-promise.d.ts" />
import jerr = require("../../errors");

import ITransaction = require("../../stores/ITransaction");

import IPUL = require("../IPUL");

class UpdatePrimitive {
    public id: string;
    public ordPath: string[];
    private target: any;
    private document: any;

    constructor(id: string, ordPath: string[]) {
        this.id = id;
        this.ordPath = ordPath;
    }

    private goTo(item: any, ordPath: string[]): any {
        if(ordPath.length === 0) {
            return item;
        } else {
            return this.goTo(item[ordPath[0]], ordPath.slice(1));
        }
    }

    lockTarget(transaction: ITransaction): Promise<any> {
        return transaction.get(this.id).then(document => {
            this.document = document;
            var item = this.goTo(this.document, this.ordPath);
            if(!item) {
                throw new jerr.JNUP0008();
            } else {
                this.target = item;
            }
        });
    }

    getDocument(): any {
        return this.document;
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
