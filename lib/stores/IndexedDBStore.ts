/// <reference path="../../definitions/lodash/lodash.d.ts" />
import _ = require("lodash");

import PUL = require("../updates/PUL");
import UpdatePrimitives = require("../updates/UpdatePrimitives");
import IStore = require("./IStore");

class IndexedDBStore implements IStore {

    private db: IDBDatabase;
    private pul: PUL = new PUL();

    open(name: string, version?: number): Promise<any> {
        return new Promise((resolve, reject) => {
            var request = indexedDB.open(name, version);

            request.onerror = function() {
                reject(request.error);
            };

            //request.onupgradeneeded = function() {};

            request.onsuccess = function() {
                this.db = request.result;
                resolve();
            };
        });
    }

    private mustBeOpened() {
        if(!this.db) {
            throw new Error("Database must be opened.");
        }
    }

    collections(): string[] {
        this.mustBeOpened();
        var names = [];
        _.forEach(this.db.objectStoreNames, name => {
            names.push(name);
        });
        return names;
    }

    collection(name: string): PUL {
        this.mustBeOpened();
        if(!this.db.objectStoreNames.contains(name)) {
            throw new Error("Collection " + name + " doesn't exist.");
        }
        this.pul.setPrefix(name);
        return this.pul;
    }

    status(): UpdatePrimitives {
        this.mustBeOpened();
        return this.pul.udps;
    }

    commit(): Promise<IStore> {
        this.mustBeOpened();
        return new Promise((resolve, reject) => {
            resolve(this);
        });
    }

}

export = IndexedDBStore;
