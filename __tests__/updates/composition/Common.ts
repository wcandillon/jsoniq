///<reference path='../../../typings/jest/jest.d.ts'/>
/// <reference path="../../../typings/lodash/lodash.d.ts" />
jest.autoMockOff();
import _ = require("lodash");
import PUL = require("../../../lib/updates/PUL");
import Composer = require("../../../lib/updates/Composer");
import Store = require("../../../lib/stores/Store");
import MemoryStore = require("../../../lib/stores/MemoryStore");

class Common {
    private static debug(pul: PUL, snapshot: {}, show: boolean) {
        if(show) {
            if(pul) {
                console.log("PUL ==========");
                console.log(JSON.stringify(pul.udps, null, 2));
            }
            console.log("Snapshot ==========");
            console.log(JSON.stringify(snapshot, null, 2));
        }
    }

    private static loadSnapshot(store: Store, snapshot: {}) {
        Object.keys(snapshot).forEach(key => {
            store.put(snapshot[key], key);
        });
    }

    static isEqual(obj1: {}, obj2: {}): boolean {
        var result = _.isEqual(obj1, obj2);
        if(!result) {
            console.log("Objects are not equal");
            console.log("Obj1 ==========");
            console.log(JSON.stringify(obj1, null, 2));
            console.log("Obj2 ==========");
            console.log(JSON.stringify(obj2, null, 2));
        }
        return result;
    }

    static checkIntegrity(d0: PUL, d1: PUL, snapshot: {}): boolean {
        d0.normalize();
        d1.normalize();

        var delta = Composer.compose(d0, d1, true);

        var store1 = new MemoryStore();
        Common.loadSnapshot(store1, snapshot);
        Common.debug(d0, store1.snapshot, false);
        store1.commit(d0);
        Common.debug(d1, store1.snapshot, false);
        store1.commit(d1);
        Common.debug(undefined, store1.snapshot, false);

        var store2 = new MemoryStore();
        Common.loadSnapshot(store2, snapshot);
        store2.commit(delta);

        return Common.isEqual(store1.snapshot, store2.snapshot);
    }
}

export = Common;

