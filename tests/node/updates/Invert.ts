/// <reference path="../../../typings/tsd.d.ts" />
require("jasmine2-pit");
import PUL = require("../../../lib/updates/PUL");
import MemoryStore = require("../../../lib/stores/memory/MemoryStore");
import MemoryTransaction = require("../../../lib/stores/memory/MemoryTransaction");

declare function pit(expectation: string, assertion?: (done: () => void) => any): void;

describe("Invert Operator", () => {

    pit("delete & insert", () => {
        var todos = [{
            id: 0,
            title: "Write thesis",
            complete: false
        }];

        var store = new MemoryStore();
        var id = store.put(todos);
        var pul = new PUL();
        pul
            .insertIntoArray(id, [], 1, [{ id: 1 }])
            .insertIntoObject(id, ["0"], { title: "More figures" })
            .deleteFromObject(id, ["0"], ["title"]);

        var invert = pul.invert(new MemoryTransaction(store.snapshot));
        return invert.then(invert => {
            return store.commitWith(pul).then(() => {
                var d1 = store.get(id);
                expect(d1[0].id).toBe(0);
                expect(d1[0].title).toBe("More figures");
                expect(d1[1].id).toBe(1);

                return store.commitWith(invert).then(() => {
                    var d0 = store.get(id);
                    expect(d0).toEqual(todos);
                });
            });
        });
    });

    pit("replaceInObject", () => {
        var todos = [{
            id: 0,
            title: "Write thesis",
            complete: false
        }];

        var store = new MemoryStore();
        var id = store.put(todos);
        var pul = new PUL();
        pul.replaceInObject(id, ["0"], "complete", true);
        pul.renameInObject(id, ["0"], "complete", "completed");

        var invert = pul.invert(new MemoryTransaction(store.snapshot));
        return invert.then(invert => {
            return store.commitWith(pul).then(() => {
                var d1 = store.get(id);
                expect(d1[0].completed).toBe(true);
                return store.commitWith(invert).then(() => {
                    var d0 = store.get(id);
                    expect(d0).toEqual(todos);
                });
            });
        });
    });

    pit("example 1", () => {
        var todos = [{
            id: 0,
            title: "Write thesis",
            complete: false
        }];

        var store = new MemoryStore();
        var id = store.put(todos);
        var ref = store.put({ user: "bar" });
        var pul = new PUL();
        pul
            .insertIntoArray(id, [], 1, [{ id: 1 }])
            .replaceInObject(id, ["0"], "complete", true)
            .renameInObject(id, ["0"], "complete", "completed")
            .insertIntoObject(id, ["0"], { title: "More figures" })
            .deleteFromObject(id, ["0"], ["title"]);
        pul.insert("hello", { user: "foo" });
        pul.remove(ref);

        var invert = pul.invert(new MemoryTransaction(store.snapshot));
        return invert.then(invert => {
            return store.commitWith(pul).then(() => {
                var d1 = store.get(id);
                expect(d1[0]["completed"]).toBe(true);
                expect(d1[0].complete).toBe(undefined);
                expect(d1[0].id).toBe(0);
                expect(d1[0].title).toBe("More figures");
                expect(d1[1].id).toBe(1);
                expect(store.get("hello")).toEqual({ user: "foo" });
                expect(() => { store.get(ref); }).toThrow();
                return store.commitWith(invert).then(() => {
                    var d0 = store.get(id);
                    expect(d0).toEqual(todos);
                    expect(() => { store.get("hello"); }).toThrow();
                    expect(store.get(ref)).toEqual({ user: "bar" });
                });
            });
        });
    });
});
