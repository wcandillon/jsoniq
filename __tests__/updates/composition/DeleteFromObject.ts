///<reference path='../../../typings/jest/jest.d.ts'/>
/// <reference path="../../../typings/node-uuid/node-uuid.d.ts" />
/// <reference path="../../../typings/lodash/lodash.d.ts" />
jest.autoMockOff();
//import _ = require("lodash");
import PUL = require("../../../lib/updates/PUL");
import PULComposition = require("../../../lib/updates/composition/PULComposition");
import Common = require("./Common");
//import jerr = require("../../lib/errors");

describe("InsertIntoObject Composition", () => {

    it("Tests Aggregation with Insert (1)", () => {
        var d0 = new PUL();
        d0.insert("1", { a: 1 });

        var d1 = new PUL();
        d1.deleteFromObject("1", [], ["a"]);

        var delta = PULComposition.compose(d0, d1, true);
        expect(delta.udps.deleteFromObject.length).toBe(0);
        expect(delta.udps.insert.length).toBe(1);
        expect(Object.keys(delta.udps.insert[0].item).length).toBe(0);

        expect(
            Common.checkCompositionIntegrity(d0, d1, {})
        ).toBe(true);
    });

    it("Tests Aggregation with Insert (2)", () => {
        var d0 = new PUL();
        d0.insert("1", { a: 1, b: 1 });

        var d1 = new PUL();
        d1.deleteFromObject("1", [], ["a"]);

        var delta = PULComposition.compose(d0, d1, true);
        expect(delta.udps.deleteFromObject.length).toBe(0);
        expect(delta.udps.insert.length).toBe(1);
        expect(
            Common.isEqual(delta.udps.insert[0].item, { b: 1 })
        ).toBe(true);

        expect(
            Common.checkCompositionIntegrity(d0, d1, {})
        ).toBe(true);
    });

    it("Tests Aggregation with InsertIntoObject (1)", () => {
        var d0 = new PUL();
        d0.insertIntoObject("1", ["a"], { b: 1, c: 1 });

        var d1 = new PUL();
        d1.deleteFromObject("1", ["a"], ["b"]);

        var delta = PULComposition.compose(d0, d1, true);
        expect(delta.udps.insertIntoObject.length).toBe(1);
        expect(delta.udps.deleteFromObject.length).toBe(0);
        expect(

            Common.isEqual(delta.udps.insertIntoObject[0].pairs, { c: 1 })
        ).toBe(true);

        expect(
            Common.checkCompositionIntegrity(d0, d1, { "1": { a: {} } })
        ).toBe(true);
    });

    it("Tests Aggregation with InsertIntoObject (2)", () => {
        var d0 = new PUL();
        d0.insertIntoObject("1", ["a"], { b: 1 });

        var d1 = new PUL();
        d1.deleteFromObject("1", ["a"], ["b"]);

        var delta = PULComposition.compose(d0, d1, true);
        expect(delta.udps.insertIntoObject.length).toBe(0);
        expect(delta.udps.deleteFromObject.length).toBe(0);

        expect(
            Common.checkCompositionIntegrity(d0, d1, { "1": { a: {} } })
        ).toBe(true);
    });

    it("Tests Aggregation with ReplaceInObject", () => {
        var d0 = new PUL();
        d0.replaceInObject("1", [], "a", { b: 1 });

        var d1 = new PUL();
        d1.deleteFromObject("1", ["a"], ["b"]);

        var delta = PULComposition.compose(d0, d1, true);

        expect(delta.udps.deleteFromObject.length).toBe(0);
        expect(delta.udps.replaceInObject.length).toBe(1);
        expect(delta.udps.replaceInObject[0].key).toBe("a");
        expect(
            Common.isEqual(delta.udps.replaceInObject[0].item, {})
        ).toBe(true);

        expect(
            Common.checkCompositionIntegrity(d0, d1, { "1": { a: {} } })
        ).toBe(true);
    });

    it("Test Aggregation with RenameInObject", () => {
        var d0 = new PUL();
        d0.renameInObject("1", [], "a", "b");

        var d1 = new PUL();
        d1.deleteFromObject("1", [], ["b"]);

        var delta = PULComposition.compose(d0, d1, true);

        expect(delta.udps.renameInObject.length).toBe(0);
        expect(delta.udps.deleteFromObject.length).toBe(1);
        expect(delta.udps.deleteFromObject[0].keys.join(".")).toBe("a");

        expect(
            Common.checkCompositionIntegrity(d0, d1, { "1": { a: {} } })
        ).toBe(true);
    });

    it("Test Accumulation (1)", () => {
        var d0 = new PUL();
        d0.renameInObject("1", [], "c", "d");

        var d1 = new PUL();
        d1.deleteFromObject("1", [], ["a"]);

        var delta = PULComposition.compose(d0, d1, true);
        expect(delta.udps.renameInObject.length).toBe(1);
        expect(delta.udps.deleteFromObject.length).toBe(1);
        expect(delta.udps.deleteFromObject[0].keys.join(".")).toBe("a");

        expect(
            Common.checkCompositionIntegrity(d0, d1, { "1": { a: {}, c: 1 } })
        ).toBe(true);
    });
});
