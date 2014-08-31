/// <reference path="../../../definitions/es6-promise/es6-promise.d.ts" />
import es6Promise = require("es6-promise");

import ITransaction = require("../ITransaction");

class MemoryTransaction implements ITransaction {

    public snapshot: {} = {};

    constructor(snapshot: {}) {
        this.snapshot = snapshot;
    }

    done(): Promise<any> {
        return new es6Promise.Promise((resolve, reject) => {
            setTimeout(() => {
                resolve([]);
            }, 1);
        });
    }

    get(id: string): Promise<any> {
        return new es6Promise.Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.snapshot[id]);
            }, 1);
        });
    }

    put(id: string, item: any): ITransaction {
        this.snapshot[id] = item;
        return this;
    }

    remove(id: string): ITransaction {
        delete this.snapshot[id];
        return this;
    }
}

export = MemoryTransaction;
