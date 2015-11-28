/// <reference path="../../../../typings/tsd.d.ts" />
import * as _ from "lodash";
import PUL from "../../../../lib/updates/PUL";
import PULComposition from "../../../../lib/updates/composition/PULComposition";
import MemoryStore from "../../../../lib/stores/memory/MemoryStore";

export default class Common {
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

    private static loadSnapshot(store: MemoryStore, snapshot: {}) {
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

    static checkCompositionIntegrity(d0: PUL, d1: PUL, snapshot: {}): Promise<boolean> {
        d0.normalize();
        d1.normalize();

        var delta = PULComposition.compose(d0, d1, true);

        var store1 = new MemoryStore();
        Common.loadSnapshot(store1, snapshot);
        Common.debug(d0, store1.snapshot, false);
        return store1.commitWith(d0).then(() => {
            return store1.commitWith(d1);
        }).then(() => {
            var store2 = new MemoryStore();
            Common.loadSnapshot(store2, snapshot);
            return store2.commitWith(delta).then(() => {
                return Common.isEqual(store1.snapshot, store2.snapshot);
            });
        });
    }
}

