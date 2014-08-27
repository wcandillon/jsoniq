/// <reference path="../../../definitions/node-uuid/node-uuid.d.ts" />
/// <reference path="../../../definitions/lodash/lodash.d.ts" />
/// <reference path="../../../definitions/es6-promise/es6-promise.d.ts" />
import _ = require("lodash");
import uuid = require("node-uuid");
import PUL = require("../../updates/PUL");
import UpdatePrimitives = require("../../updates/UpdatePrimitives");
import IStore = require("../IStore");
import ICollection = require("../ICollection");
import ICollections = require("../ICollections");
import Collection = require("../Collection");
import MemoryTransaction = require("./MemoryTransaction");

class MemoryStore implements IStore {

    snapshot: {} = {};

    private pul: PUL = new PUL();

    private collections: ICollections = {};

    constructor() {
        this.collections["main"] = new Collection("main", this.pul);
    }

    get(id: string): any {
        var result = this.snapshot[id];
        if(result) {
            return _.cloneDeep(result);
        } else {
            throw new Error("Item not found: " + id);
        }
    }

    put(item: any, id?: string): string {
        var ref = id ? id : uuid.v4();
        this.snapshot[ref] = item;
        return ref;
    }

    remove(id: string): MemoryStore {
        var item = this.snapshot[id];
        if(!item) {
            //TODO: throw proper error code
            throw new Error();
        }
        delete this.snapshot[id];
        return this;
    }

    getCollections(): string[] {
        return Object.keys(this.collections);
    }

    collection(name: string): ICollection {
        return this.collections[name];
    }

    status(): UpdatePrimitives {
        return this.pul.udps;
    }

    commitWith(pul: PUL): IStore {
        var transaction = new MemoryTransaction(_.cloneDeep(this.snapshot));
        pul.apply(transaction);
        this.snapshot = transaction.snapshot;
        return this;
    }

    commit(): Promise<IStore> {
        throw new Error("Not implemented!");
    }
}

export = MemoryStore;
