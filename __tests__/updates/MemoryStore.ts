///<reference path='../../typings/jest/jest.d.ts'/>
/// <reference path="../../typings/node-uuid/node-uuid.d.ts" />
/// <reference path="../../typings/lodash/lodash.d.ts" />
jest.autoMockOff();
import _ = require("lodash");
import PUL = require("../../lib/updates/PUL");
import jerr = require("../../lib/errors");
import MemoryStore = require("../../lib/stores/MemoryStore");

describe("Memory Store", () => {

    it("simple test", () => {
        var store = new MemoryStore();

        expect(() => {
            store.get("a");
        }).toThrow();

        var object = {
            a: [1, 2],
            b: 2
        };

        var id = store.put(object);
        var obj = store.get(id);
        expect(_.isEqual(obj, object)).toBe(true);
    });

    it("Insert & delete", () => {
        var obj = { a: 1, b: { c: 1 } };
        var store = new MemoryStore();
        var id = store.put(obj);

        var pul = new PUL();
        pul.insert("hello", { z: 1 });
        pul.remove(id);
        store.commit(pul);

        expect(_.isEqual(store.get("hello"), { z: 1 })).toBe(true);
        expect(() => { store.get(id); }).toThrow();
    });

    it("simple update (1)", () => {
        var obj = { a: 1, b: { c: 1 } };
        var store = new MemoryStore();
        var id = store.put(obj);

        var pul = new PUL();
        pul
            .insertIntoObject(id, ["b"], { d: 1 })
            .deleteFromObject(id, ["b"], ["c"]);
        expect(obj.b["d"]).toBe(undefined);
        expect(obj.b.c).toBe(1);

        var serializedPUL = pul.serialize();
        store.commit(pul);

        obj = store.get(id);
        expect(obj.b["d"]).toBe(1);
        expect(obj.b.c).toBe(undefined);

        obj = { a: 1, b: { c: 1 } };
        store = new MemoryStore();
        store.put(obj, id);
        pul = new PUL();
        pul.parse(serializedPUL);
        store.commit(pul);

        obj = store.get(id);
        expect(obj.b["d"]).toBe(1);
        expect(obj.b.c).toBe(undefined);
    });

    it("simple update (2)", () => {
        var obj = { a: 1, b: { c: 1 } };
        var store = new MemoryStore();
        var id = store.put(obj);

        var pul = new PUL();
        pul.renameInObject(id, [], "a", "z");
        store.commit(pul);

        obj = store.get(id);
        expect(obj["z"]).toBe(1);
        expect(obj.a).toBe(undefined);
    });

    it("simple update (3)", () => {
        var obj = { a: 1, b: { c: 1 } };
        var store = new MemoryStore();
        var id = store.put(obj);

        var pul = new PUL();
        pul.renameInObject(id, [], "a", "z")
            .insertIntoObject(id, [], { a: 2 });

        store.commit(pul);

        obj = store.get(id);
        expect(obj.a).toBe(2);
        expect(obj["z"]).toBe(1);
    });

    it("simple update (4)", () => {
        var obj = { a: 1, b: { c: 1 } };
        var store = new MemoryStore();
        var id = store.put(obj);

        var pul = new PUL();
        pul.insertIntoObject(id, [], { z: 1 })
            .insertIntoObject(id, [], { a: 2 });

        //throws [JNUP0006] "a": pair to insert already exists in object
        expect(() => {
            try {
                store.commit(pul);
            } catch(e) {
                expect(e instanceof jerr.JNUP0006).toBe(true);
                throw e;
            }
        }).toThrow();

        //"An individual function may create an invalid JSON instance;
        // however, an updating query must produce a valid JSON instance once the entire query is evaluated,
        // or an error is raised and the entire update fails, leaving the instance in its original state."
        obj = store.get(id);
        expect(obj.a).toBe(1);
        expect(obj["z"]).toBe(undefined);
    });

    //http://try.zorba.io/queries/xquery/YLem0q2eDKwF7Yb9GyBKIwdUA20%3D
    //http://try.zorba.io/queries/xquery/J5QX9GgI64MnJlJ3IJ9vCUcCG8o%3D
    it("example", () => {
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
            .replaceInObject(id, ["0"], "complete", true)
            .renameInObject(id, ["0"], "complete", "completed")
            .insertIntoObject(id, ["0"], { title: "More figures" })
            .deleteFromObject(id, ["0"], ["title"]);
        store.commit(pul);

        todos = store.get(id);
        expect(todos[0]["completed"]).toBe(true);
        expect(todos[0].complete).toBe(undefined);
        expect(todos[0].id).toBe(0);
        expect(todos[0].title).toBe("More figures");
        expect(todos[1].id).toBe(1);
    });

    it("JNUP0008", () => {
        var obj = { a: 1, b: {} };

        var store = new MemoryStore();
        var id = store.put(obj);

        var pul = new PUL();
        pul.insertIntoObject(id, ["c"], { a: 1 });

        expect(() => {
            try {
                store.commit(pul);
            } catch(e) {
                expect(e instanceof jerr.JNUP0008).toBe(true);
                throw e;
            }
        }).toThrow();
    });

    //http://try.zorba.io/queries/xquery/ggGUhCUEuOUaVmfxjTOJ4ygDdas%3D
    it("rename & insert (1)", () => {
        var obj = { a: 1, b: {} };

        var store = new MemoryStore();
        var id = store.put(obj);
        var pul = new PUL();
        pul
            .insertIntoObject(id, ["b"], { a: 1 })
            .renameInObject(id, [], "b", "z");
        store.commit(pul);

        obj = store.get(id);
        expect(obj["z"]["a"]).toBe(1);
    });

    //http://try.zorba.io/queries/xquery/HdaN8mUvpAIlifs1CgBmz8gZhQo=
    it("rename & insert (2)", () => {
        var obj = { a: 1 };

        var store = new MemoryStore();
        var id = store.put(obj);
        var pul = new PUL();
        pul
            .insertIntoObject(id, [], { a: 1 })
            .renameInObject(id, [], "a", "b")
            .insert("myID", { z: 1 });

        store.commit(pul);

        obj = store.get(id);
        expect(obj.a).toBe(1);
        expect(obj["b"]).toBe(1);

        obj = store.get("myID");
        expect(obj["z"]).toBe(1);
    });

    //http://try.zorba.io/queries/xquery/D4xY%2FX8P10C1bTKtz6ZNnVRIwWs%3D
    it("[JNUP0016] selector cannot be resolved against supplied object", () => {
        var obj = { completed: true };
        var store = new MemoryStore();
        var id = store.put(obj);
        var pul = new PUL();
        pul.renameInObject(id, [], "completed", "complete");
        pul.replaceInObject(id, [], "complete", false);

        expect(() => {
            try {
                store.commit(pul);
            } catch(e) {
                expect(e instanceof jerr.JNUP0016).toBe(true);
                throw e;
            }
        }).toThrow();
    });
});
