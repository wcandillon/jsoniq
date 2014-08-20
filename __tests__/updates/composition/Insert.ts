///<reference path='../../../typings/jest/jest.d.ts'/>
/// <reference path="../../../typings/node-uuid/node-uuid.d.ts" />
/// <reference path="../../../typings/lodash/lodash.d.ts" />
jest.autoMockOff();
//import _ = require("lodash");
import PUL = require("../../../lib/updates/PUL");
import Composer = require("../../../lib/updates/Composer");
import Common = require("./Common");
//import jerr = require("../../lib/errors");

describe("Insert Composition", () => {

    it("Tests Aggregation (1)", () => {
        var d0 = new PUL();
        d0.insert("1", { a: 1 });
        d0.remove("1");

        var d1 = new PUL();
        d1.insert("1", { a: 1 });

        var delta = Composer.compose(d0, d1, true);
        expect(delta.udps.remove.length).toBe(0);
        expect(delta.udps.insert.length).toBe(1);
        expect(delta.udps.insert[0].id).toBe("1");
        expect(delta.udps.insert[0].item.a).toBe(1);

        expect(
            Common.checkIntegrity(d0, d1, { "1": {} })
        ).toBe(true);
    });

    it("Tests Aggregation (2)", () => {
        var d0 = new PUL();
        d0.remove("1");

        var d1 = new PUL();
        d1.insert("1", { a: 1 });

        var delta = Composer.compose(d0, d1, true);
        expect(delta.udps.remove.length).toBe(0);
        expect(delta.udps.insert.length).toBe(1);
        expect(delta.udps.insert[0].id).toBe("1");
        expect(delta.udps.insert[0].item.a).toBe(1);

        expect(
            Common.checkIntegrity(d0, d1, { "1": {} })
        ).toBe(true);
    });
});
