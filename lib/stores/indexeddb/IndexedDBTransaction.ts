/// <reference path="../../../typings/es6-promise/es6-promise.d.ts" />

import es6Promise = require("es6-promise");

import ITransaction = require("../ITransaction");

class IndexedDBTransaction implements ITransaction {

    private db: IDBDatabase;
    private txs: Promise<any>[] = [];

    constructor(db: IDBDatabase) {
        this.db = db;
    }

    done(): Promise<any> {
        return es6Promise.Promise.all(this.txs);
    }

    get(id: string): Promise<any> {
        return new es6Promise.Promise((resolve, reject) => {
            var segments = id.split(":");
            var objectStoreName = segments[0];
            var key = segments[1];
            var tx = this.db.transaction(objectStoreName, "readonly");
            var req =  tx.objectStore(objectStoreName).get(key);
            req.onsuccess = () => {
                resolve(req.result);
            };
            req.onerror = () => {
                reject(req.error);
            };
        });
    }

    put(id: string, item: any): ITransaction {
        var segments = id.split(":");
        var objectStoreName = segments[0];
        var key = segments[1];
        var tx = this.db.transaction(objectStoreName, "readwrite");
        this.txs.push(new es6Promise.Promise((resolve, reject) => {
            var objectStore = tx.objectStore(objectStoreName);
            objectStore.put(item, !objectStore.keyPath && objectStore["autoIncrement"] !== true ? key : undefined);
            tx.oncomplete = event => { resolve(event); };
            tx.onerror = event => { reject(event); };
        }));
        return this;
    }

    remove(id: string): ITransaction {
        var segments = id.split(":");
        var objectStoreName = segments[0];
        var key = segments[1];
        var tx = this.db.transaction(objectStoreName, "readwrite");
        this.txs.push(new es6Promise.Promise((resolve, reject) => {
            tx.objectStore(objectStoreName).delete(key);
            tx.oncomplete = event => { resolve(event); };
            tx.onerror = event => { reject(event); };
        }));
        return this;
    }
}

export = IndexedDBTransaction;
