import ITransaction = require("../ITransaction");

class MemoryTransaction implements ITransaction {

    public snapshot: {} = {};

    constructor(snapshot: {}) {
        this.snapshot = snapshot;
    }

    get(id: string): any {
        return this.snapshot[id];
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
