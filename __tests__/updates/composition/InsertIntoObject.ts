///<reference path='../../../definitions/jest/jest.d.ts'/>
/// <reference path="../../../definitions/node-uuid/node-uuid.d.ts" />
/// <reference path="../../../definitions/lodash/lodash.d.ts" />
jest.autoMockOff();
//import _ = require("lodash");
import PUL = require("../../../lib/updates/PUL");
import PULComposition = require("../../../lib/updates/composition/PULComposition");
import Common = require("./Common");
//import jerr = require("../../lib/errors");

describe("InsertIntoObject Composition", () => {

    it("Tests Aggregation with Insert", () => {
        var d0 = new PUL();
        d0.insert("1", { a: 1 });

        var d1 = new PUL();
        d1.insertIntoObject("1", [], { b: 1 });

        var delta = PULComposition.compose(d0, d1, true);
        expect(delta.udps.insertIntoObject.length).toBe(0);
        expect(delta.udps.insert.length).toBe(1);
        expect(delta.udps.insert[0].item["a"]).toBe(1);
        expect(delta.udps.insert[0].item["b"]).toBe(1);

        expect(
            Common.checkCompositionIntegrity(d0, d1, {})
        ).toBe(true);
    });

    it("Tests Aggregation with InsertIntoObject", () => {
        var d0 = new PUL();
        d0.insertIntoObject("1", ["a"], { b: 1 });

        var d1 = new PUL();
        d1.insertIntoObject("1", ["a"], { c: 1 });

        var delta = PULComposition.compose(d0, d1, true);
        expect(delta.udps.insertIntoObject.length).toBe(1);
        expect(delta.udps.insertIntoObject[0].pairs["b"]).toBe(1);
        expect(delta.udps.insertIntoObject[0].pairs["c"]).toBe(1);

        expect(
            Common.checkCompositionIntegrity(d0, d1, { "1": { a: {} } })
        ).toBe(true);
    });

    it("Tests Aggregation with ReplaceInObject", () => {
        var d0 = new PUL();
        d0.replaceInObject("1", [], "a", { b: 1 });

        var d1 = new PUL();
        d1.insertIntoObject("1", ["a"], { c: 1 });

        var delta = PULComposition.compose(d0, d1, true);

        expect(delta.udps.insertIntoObject.length).toBe(0);
        expect(delta.udps.replaceInObject.length).toBe(1);
        expect(delta.udps.replaceInObject[0].key).toBe("a");
        expect(delta.udps.replaceInObject[0].item["b"]).toBe(1);
        expect(delta.udps.replaceInObject[0].item["c"]).toBe(1);

        expect(
            Common.checkCompositionIntegrity(d0, d1, { "1": { a: {} } })
        ).toBe(true);
    });

    it("Test Aggregation with RenameInObject", () => {
        var d0 = new PUL();
        d0.renameInObject("1", [], "a", "b");

        var d1 = new PUL();
        d1.insertIntoObject("1", ["b"], { c: 1 });

        var delta = PULComposition.compose(d0, d1, true);
        expect(delta.udps.renameInObject.length).toBe(1);
        expect(delta.udps.insertIntoObject.length).toBe(1);
        expect(delta.udps.insertIntoObject[0].ordPath.join(".")).toBe("a");

        expect(
            Common.checkCompositionIntegrity(d0, d1, { "1": { a: {} } })
        ).toBe(true);
    });

    it("Test Accumulation (1)", () => {
        var d0 = new PUL();
        d0.renameInObject("1", [], "c", "d");

        var d1 = new PUL();
        d1.insertIntoObject("1", ["a"], { c: 1 });

        var delta = PULComposition.compose(d0, d1, true);
        expect(delta.udps.renameInObject.length).toBe(1);
        expect(delta.udps.insertIntoObject.length).toBe(1);
        expect(delta.udps.insertIntoObject[0].ordPath.join(".")).toBe("a");

        expect(
            Common.checkCompositionIntegrity(d0, d1, { "1": { a: {}, c: 1 } })
        ).toBe(true);
    });

});
