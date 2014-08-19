///<reference path="../../typings/jest/jest.d.ts"/>
/// <reference path="../../typings/node-uuid/node-uuid.d.ts" />
/// <reference path="../../typings/lodash/lodash.d.ts" />
jest.autoMockOff();
import _ = require("lodash");
import PUL = require("../../lib/updates/PUL");
//import jerr = require("../lib/errors");
import MemoryStore = require("../../lib/stores/MemoryStore");
import Transaction = require("../../lib/stores/Transaction");

describe("Invert Operator", () => {

    it("delete & insert", () => {
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

        var invert = pul.invert(new Transaction(store));

        store.commit(pul);
        var d1 = store.get(id);
        expect(d1[0].id).toBe(0);
        expect(d1[0].title).toBe("More figures");
        expect(d1[1].id).toBe(1);

        store.commit(invert);
        var d0 = store.get(id);
        expect(_.isEqual(d0, todos));
    });

    it("replaceInObject", () => {
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

        var invert = pul.invert(new Transaction(store));
        //console.log(JSON.stringify(JSON.parse(invert.serialize()), null, 2));

        store.commit(pul);
        var d1 = store.get(id);
        expect(d1[0].completed).toBe(true);

        store.commit(invert);
        var d0 = store.get(id);
        expect(_.isEqual(d0, todos)).toBe(true);
    });

    it("example 1", () => {
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

        var invert = pul.invert(new Transaction(store));
        //console.log(JSON.stringify(JSON.parse(invert.serialize()), null, 2));

        store.commit(pul);
        var d1 = store.get(id);
        expect(d1[0]["completed"]).toBe(true);
        expect(d1[0].complete).toBe(undefined);
        expect(d1[0].id).toBe(0);
        expect(d1[0].title).toBe("More figures");
        expect(d1[1].id).toBe(1);
        expect(_.isEqual(store.get("hello"), { user: "foo" })).toBe(true);
        expect(() => { store.get(ref); }).toThrow();

        store.commit(invert);
        var d0 = store.get(id);
        //console.log(JSON.stringify(d0, null, 2));
        //console.log("=======");
        //console.log(JSON.stringify(todos, null, 2));
        //console.log(_.isEqual(d0, todos));
        expect(_.isEqual(d0, todos)).toBe(true);
        expect(() => { store.get("hello"); }).toThrow();
        expect(_.isEqual(store.get(ref), { user: "bar" }));
    });
});
