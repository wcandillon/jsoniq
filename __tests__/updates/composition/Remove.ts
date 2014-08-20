///<reference path='../../../typings/jest/jest.d.ts'/>
/// <reference path="../../../typings/node-uuid/node-uuid.d.ts" />
/// <reference path="../../../typings/lodash/lodash.d.ts" />
jest.autoMockOff();
//import _ = require("lodash");
import PUL = require("../../../lib/updates/PUL");
import Composer = require("../../../lib/updates/Composer");
import Common = require("./Common");
//import jerr = require("../../lib/errors");

describe("Remove Composition", () => {

    it("Tests Aggregation (1)", () => {

        var d0 = new PUL();
        d0.insert("1", { a: 1 });
        d0.insert("2", { a: 1 });

        var d1 = new PUL();
        d1.remove("1");

        var delta = Composer.compose(d0, d1, true);
        expect(delta.udps.insertIntoArray.length).toBe(0);
        expect(delta.udps.insertIntoObject.length).toBe(0);
        expect(delta.udps.deleteFromObject.length).toBe(0);
        expect(delta.udps.deleteFromArray.length).toBe(0);
        expect(delta.udps.replaceInObject.length).toBe(0);
        expect(delta.udps.replaceInArray.length).toBe(0);
        expect(delta.udps.renameInObject.length).toBe(0);
        expect(delta.udps.remove.length).toBe(0);
        expect(delta.udps.insert.length).toBe(1);
        expect(delta.udps.insert[0].id).toBe("2");
        expect(
            Common.isEqual(delta.udps.insert[0].item, { a: 1 })
        ).toBe(true);

        expect(
            Common.checkIntegrity(d0, d1, {})
        ).toBe(true);
    });

    it("Tests Aggregation (2)", () => {

        var d0 = new PUL();
        d0.insertIntoArray("1", ["a"], 0, [{}]);
        d0.replaceInObject("1", [], "b", {});
        d0.insertIntoObject("1", [], { f: 1 });
        d0.insert("2", { a: 1 });

        var d1 = new PUL();
        d1.remove("1");

        var delta = Composer.compose(d0, d1, true);
        expect(delta.udps.insertIntoArray.length).toBe(0);
        expect(delta.udps.insertIntoObject.length).toBe(0);
        expect(delta.udps.deleteFromObject.length).toBe(0);
        expect(delta.udps.deleteFromArray.length).toBe(0);
        expect(delta.udps.replaceInObject.length).toBe(0);
        expect(delta.udps.replaceInArray.length).toBe(0);
        expect(delta.udps.renameInObject.length).toBe(0);
        expect(delta.udps.remove.length).toBe(1);
        expect(delta.udps.insert.length).toBe(1);
        expect(delta.udps.insert[0].id).toBe("2");
        expect(
            Common.isEqual(delta.udps.insert[0].item, { a: 1 })
        ).toBe(true);

        expect(
            Common.checkIntegrity(d0, d1, { "1": { a: [], b: {} } })
        ).toBe(true);

    });
});
