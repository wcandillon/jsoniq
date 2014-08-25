/// <reference path="../../definitions/lodash/lodash.d.ts" />
import es6Promise = require("es6-promise");
import _ = require("lodash");

import PUL = require("../updates/PUL");
import UpdatePrimitives = require("../updates/UpdatePrimitives");
import IStore = require("./IStore");

var indexedDB = indexedDB || window["indexedDB"] || window["webkitIndexedDB"] ||
    window["mozIndexedDB"] || window["OIndexedDB"] || window["msIndexedDB"];

class IndexedDBStore implements IStore {

    private db: IDBDatabase;
    private pul: PUL = new PUL();

    open(name: string, version?: number): Promise<IDBDatabase> {
        return new es6Promise.Promise((resolve, reject) => {
            var request = indexedDB.open(name, version);

            request.onerror = () => {
                reject(request.error);
            };

            request.onupgradeneeded = () => {
                console.log("Error: We need an upgrade!!");
            };

            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
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
        this.pul.setCollectionPrefix(name);
        return this.pul;
    }

    status(): UpdatePrimitives {
        this.mustBeOpened();
        return this.pul.udps;
    }

    commit(): Promise<IStore> {
        this.mustBeOpened();
        return new es6Promise.Promise((resolve, reject) => {
            resolve(this);
        });
    }
}

export = IndexedDBStore;
