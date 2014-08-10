//import jerr = require("../errors");

import Store = require("./Store");

class Transaction {

    private store: Store;
    public snapshot: {} = {};

    constructor(store: Store) {
        this.store = store;
    }

    get(id: string): any {
        var result = this.snapshot[id];
        if(!result) {
            var item = this.store.get(id);
            this.put(id, item);
            return item;
        } else {
            return result;
        }
    }

    put(id: string, item: any): Transaction {
        this.snapshot[id] = item;
        return this;
    }
}

export = Transaction;
