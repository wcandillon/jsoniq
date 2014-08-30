import ITransaction = require("../ITransaction");

class IndexedDBTransaction implements ITransaction {

    private tx: IDBTransaction;

    constructor(tx: IDBTransaction) {
        this.tx = tx;
    }

    getTransaction(): IndexedDBTransaction {
        return this.tx;
    }

    get(id: string): any {
        var segments = id.split(":");
        var objectStoreName = segments[0];
        var key = segments[1];
        return this.tx.objectStore(objectStoreName).get(key);
    }

    put(id: string, item: any): ITransaction {
        var segments = id.split(":");
        var objectStoreName = segments[0];
        var key = segments[1];
        var objectStore = this.tx.objectStore(objectStoreName);
        objectStore.put(item, !objectStore.keyPath && objectStore["autoIncrement"] !== true ? key : undefined);
        return this;
    }

    remove(id: string): ITransaction {
        var segments = id.split(":");
        var objectStoreName = segments[0];
        var key = segments[1];
        this.tx.objectStore(objectStoreName).delete(key);
        return this;
    }
}

export = IndexedDBTransaction;
