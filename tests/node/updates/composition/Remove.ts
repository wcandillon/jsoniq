require("jasmine2-pit");

import PUL = require("../../../../lib/updates/PUL");
import PULComposition = require("../../../../lib/updates/composition/PULComposition");
import Common = require("./Common");

describe("Remove Composition", () => {

    pit("Tests Aggregation (1)", () => {

        var d0 = new PUL();
        d0.insert("1", { a: 1 });
        d0.insert("2", { a: 1 });

        var d1 = new PUL();
        d1.remove("1");

        var delta = PULComposition.compose(d0, d1, true);
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

        return Common.checkCompositionIntegrity(d0, d1, {}).then(result => {
            expect(result).toBe(true);
        });
    });

    pit("Tests Aggregation (2)", () => {

        var d0 = new PUL();
        d0.insertIntoArray("1", ["a"], 0, [{}]);
        d0.replaceInObject("1", [], "b", {});
        d0.insertIntoObject("1", [], { f: 1 });
        d0.insert("2", { a: 1 });

        var d1 = new PUL();
        d1.remove("1");

        var delta = PULComposition.compose(d0, d1, true);
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

        return Common.checkCompositionIntegrity(d0, d1, { "1": { a: [], b: {} } }).then(result => {
            expect(result).toBe(true);
        });
    });
});
