///<reference path='../../../definitions/jest/jest.d.ts'/>
/// <reference path="../../../definitions/node-uuid/node-uuid.d.ts" />
/// <reference path="../../../definitions/lodash/lodash.d.ts" />
jest.autoMockOff();
import _ = require("lodash");
import PUL = require("../../../lib/updates/PUL");
import PULComposition = require("../../../lib/updates/composition/PULComposition");
//import jerr = require("../../lib/errors");
//import MemoryStore = require("../../../lib/stores/MemoryStore");
//import Transaction = require("../../../lib/stores/Transaction");

describe("Composition", () => {

    it("test copy", () => {
        var d0 = new PUL();
        var d1 = new PUL();

        var delta = PULComposition.compose(d0, d1);
        expect(delta === d0).toBe(true);

        delta = PULComposition.compose(d0, d1, true);
        expect(delta === d0).toBe(false);
        expect(_.isEqual(delta, d0)).toBe(true);
    });

    it("delete & insert (1)", () => {
        var d0 = new PUL();
        d0.insertIntoArray("1", [], 0, [{}]);
        d0.replaceInObject("1", [], "b", {});
        d0.insertIntoObject("1", [], { });

        var d1 = new PUL();
        d1.remove("1");

        var delta = PULComposition.compose(d0, d1);
        expect(delta.udps.insertIntoArray.length).toBe(0);
        expect(delta.udps.insertIntoObject.length).toBe(0);
        expect(delta.udps.deleteFromObject.length).toBe(0);
        expect(delta.udps.deleteFromArray.length).toBe(0);
        expect(delta.udps.replaceInObject.length).toBe(0);
        expect(delta.udps.replaceInArray.length).toBe(0);
        expect(delta.udps.renameInObject.length).toBe(0);
        expect(delta.udps.remove.length).toBe(1);
        expect(delta.udps.insert.length).toBe(0);
        expect(delta.udps.remove[0].id).toBe("1");
    });

    it("insert (1)", () => {
        //var store = new MemoryStore();
        var d0 = new PUL();
        d0.insert("1", { a: { b: { c: 1 } } });

        var d1 = new PUL();
        d1.insertIntoObject("1", ["a", "b"], { d: 1, e: 1 });

        var delta = PULComposition.compose(d0, d1);
        expect(delta.udps.insertIntoObject.length).toBe(0);
        expect(delta.udps.insert.length).toBe(1);
        expect(_.isEqual(delta.udps.insert[0].item.a.b, { c: 1, d: 1, e: 1 })).toBe(true);
    });

    it("insert (2)", () => {
        //var store = new MemoryStore();
        var d0 = new PUL();
        d0.insertIntoObject("1", ["a", "b"], { c: 1 });

        var d1 = new PUL();
        d1.insertIntoObject("1", ["a", "b"], { d: 1, e: 1 });

        var delta = PULComposition.compose(d0, d1);
        expect(delta.udps.insertIntoObject.length).toBe(1);
        expect(_.isEqual(delta.udps.insertIntoObject[0].pairs, { c: 1, d: 1, e: 1 })).toBe(true);
    });

    it("insert (3)", () => {
        var d0 = new PUL();
        d0.replaceInObject("1", ["a"], "b", { d: { e: 1 } });

        var d1 = new PUL();
        d1.insertIntoObject("1", ["a", "b", "d"], { f: 1 });

        var delta = PULComposition.compose(d0, d1);
        expect(delta.udps.replaceInObject.length).toBe(1);
        expect(delta.udps.replaceInObject[0].item.d.e).toBe(1);
        expect(delta.udps.replaceInObject[0].item.d.f).toBe(1);
    });

    it("insert (4)", () => {
        var d0 = new PUL();
        d0.remove("1");
        d0.remove("1");

        var d1 = new PUL();
        d1.insert("1", { a: 1 });

        var delta = PULComposition.compose(d0, d1);
        expect(delta.udps.remove.length).toBe(0);
        expect(delta.udps.insert.length).toBe(1);
    });

    it("insertIntoObject aggregation of renameInObject (1)", () => {
        var d0 = new PUL();
        d0.renameInObject("1", ["a", "b"], "c", "d");
        d0.renameInObject("1", ["a", "b", "c", "e"], "f", "g");

        var d1 = new PUL();
        d1.insertIntoObject("1", ["a", "b", "d"], { e: 1 });

        var delta = PULComposition.compose(d0, d1);
        expect(delta.udps.renameInObject.length).toBe(2);
        expect(delta.udps.insertIntoObject.length).toBe(1);
        expect(delta.udps.insertIntoObject[0].ordPath.join(".")).toBe("a.b.c");
    });

    it("insertIntoObject aggregation of replaceInObject (1)", () => {
        var d0 = new PUL();
        d0.replaceInObject("1", ["a", "b"], "c", { d: { e: 1 }});

        var d1 = new PUL();
        d1.insertIntoObject("1", ["a", "b", "c", "d"], { f: 1 });

        var delta = PULComposition.compose(d0, d1);
        expect(delta.udps.replaceInObject.length).toBe(1);
        expect(delta.udps.insertIntoObject.length).toBe(0);
        expect(_.isEqual(delta.udps.replaceInObject[0].item.d, { e: 1, f: 1 })).toBe(true);
    });

    it("delete (1)", () => {
        var d0 = new PUL();
        d0.insert("1", { a: { b: { c: 1, d: 1, e: 1 } } });

        var d1 = new PUL();
        d1.deleteFromObject("1", ["a", "b"], ["c", "d"]);

        var delta = PULComposition.compose(d0, d1);
        expect(delta.udps.deleteFromObject.length).toBe(0);
        expect(delta.udps.insert.length).toBe(1);
        expect(_.isEqual(delta.udps.insert[0].item.a.b, { e: 1 })).toBe(true);
    });

    it("delete (2)", () => {
        //var store = new MemoryStore();
        var d0 = new PUL();
        d0.deleteFromObject("1", ["a", "b"], ["e"]);

        var d1 = new PUL();
        d1.deleteFromObject("1", ["a", "b"], ["c", "d"]);

        var delta = PULComposition.compose(d0, d1);
        //console.log(JSON.stringify(delta.udps.deleteFromObject[0].keys, null, 2));
        expect(delta.udps.deleteFromObject.length).toBe(1);
        expect(_.isEqual(delta.udps.deleteFromObject[0].keys, ["e", "c", "d"])).toBe(true);
    });

    it("delete (3)", () => {
        //var store = new MemoryStore();
        var d0 = new PUL();
        d0.insertIntoObject("1", ["a", "b"], { c: 1, d: 1, e: 1 });

        var d1 = new PUL();
        d1.deleteFromObject("1", ["a", "b"], ["c", "d"]);

        var delta = PULComposition.compose(d0, d1);
        expect(delta.udps.insertIntoObject.length).toBe(1);
        expect(delta.udps.deleteFromObject.length).toBe(0);
        expect(_.isEqual(delta.udps.insertIntoObject[0].pairs, { e: 1 })).toBe(true);
    });
});
