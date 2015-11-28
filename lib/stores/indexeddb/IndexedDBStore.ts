/// <reference path="../../../typings/lodash/lodash.d.ts" />
import * as _ from "lodash";

import PUL from "../../updates/PUL";
import UpdatePrimitives from "../../updates/UpdatePrimitives";
import { IStore } from "../IStore";
import { ICollection } from "../ICollection";
import { ICollections } from "../ICollections";
import { ILogEntry } from "../ILogEntry";
import IndexedDBCollection from "./IndexedDBCollection";
import IndexedDBTransaction from "./IndexedDBTransaction";

var indexedDB = indexedDB || window["indexedDB"] || window["webkitIndexedDB"] ||
    window["mozIndexedDB"] || window["OIndexedDB"] || window["msIndexedDB"];

export default class IndexedDBStore implements IStore {

    private db: IDBDatabase;
    private pul: PUL = new PUL();
    private collections: ICollections = {};

    open(name: string, version?: number, onUpgrade?: (IDBVersionChangeEvent, IDBDatabase) => void): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            var request = indexedDB.open(name, version);

            request.onerror = () => {
                reject(request.error);
            };

            request.onupgradeneeded = (event) => {
                if(onUpgrade) {
                    onUpgrade(event, request.result);
                }
            };

            request.onsuccess = () => {
                this.db = request.result;
                _.forEach(this.db.objectStoreNames, name => {
                    this.collections[name] = new IndexedDBCollection(this.db.transaction(name, "readonly").objectStore(name), this.pul);
                });
                resolve(this.db);
            };
        });
    }

    private mustBeOpened() {
        if(!this.db) {
            throw new Error("Database must be opened.");
        }
    }

    getCollections(): string[] {
        this.mustBeOpened();
        return Object.keys(this.collections);
    }

    collection(name: string): ICollection {
        this.mustBeOpened();
        if(!this.collections[name]) {
            throw new Error("Collection " + name + " doesn't exist.");
        }
        return this.collections[name];
    }

    status(): UpdatePrimitives {
        this.mustBeOpened();
        return this.pul.udps;
    }

    commit(): Promise<any> {
        this.mustBeOpened();
        var tx = new IndexedDBTransaction(this.db);
        return this.pul.apply(tx);
    }

    resetLocal(): IndexedDBStore {
        _.forEach(this.collections, collection => {
            collection.reset();
        });
        return this;
    }

    init(): Promise<any> {
        throw new Error("Not implemented");
    }

    clone(url: string): Promise<any> {
        throw new Error("Not implemented");
    }

    log(from?: number, to?: number): Promise<ILogEntry> {
        throw new Error("Not implemented");
    }

    rebase(from: string, to?: string): Promise<any> {
        throw new Error("Not implemented");
    }

    reset(to: string): Promise<any> {
        throw new Error("Not implemented");
    }
}
