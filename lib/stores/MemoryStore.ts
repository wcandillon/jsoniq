/// <reference path="../../typings/node-uuid/node-uuid.d.ts" />
/// <reference path="../../typings/lodash/lodash.d.ts" />
import _ = require("lodash");
import uuid = require("node-uuid");
import PUL = require("../updates/PUL");
import Store = require("./Store");
import Transaction = require("./Transaction");

class MemoryStore extends Store {
    snapshot: {} = {};

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

    commit(pul: PUL): Store {
        //"An individual function may create an invalid JSON instance;
        // however, an updating query must produce a valid JSON instance once the entire query is evaluated,
        // or an error is raised and the entire update fails, leaving the instance in its original state."
        var transaction = new Transaction(this);
        pul.apply(transaction);
        _.forEach(transaction.snapshot, (value, key) => {
            this.snapshot[key] = value;
        });
        return this;
    }
}

export = MemoryStore;
