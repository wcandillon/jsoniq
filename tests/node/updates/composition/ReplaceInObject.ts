require("jasmine2-pit");

import PUL from "../../../../lib/updates/PUL";
import PULComposition from "../../../../lib/updates/composition/PULComposition";
import Common from "./Common";

declare function pit(expectation: string, assertion?: (done: () => void) => any): void;

describe("RenameInObject Composition", () => {

    pit("Tests Aggregation with Insert", () => {
        var d0 = new PUL();
        d0.insert("1", { a: 1 });

        var d1 = new PUL();
        d1.replaceInObject("1", [], "a", 2);

        var delta = PULComposition.compose(d0, d1, true);
        expect(delta.udps.replaceInObject.length).toBe(0);
        expect(delta.udps.insert.length).toBe(1);
        expect(delta.udps.insert[0].item["a"]).toBe(2);

        return Common.checkCompositionIntegrity(d0, d1, {}).then(result => {
            expect(result).toBe(true);
        });
    });

    pit("Tests Aggregation with InsertIntoObject (1)", () => {
        var d0 = new PUL();
        d0.insertIntoObject("1", [], { a: 1 });

        var d1 = new PUL();
        d1.replaceInObject("1", [], "a", 2);

        var delta = PULComposition.compose(d0, d1, true);
        expect(delta.udps.replaceInObject.length).toBe(0);
        expect(delta.udps.insertIntoObject.length).toBe(1);
        expect(delta.udps.insertIntoObject[0].pairs["a"]).toBe(2);

        return Common.checkCompositionIntegrity(d0, d1, { "1": {} }).then(result => {
            expect(result).toBe(true);
        });
    });

    pit("Tests Aggregation with InsertIntoObject (2)", () => {
        var d0 = new PUL();
        d0.insertIntoObject("1", ["a"], { b: 1, d: 1 });

        var d1 = new PUL();
        d1.replaceInObject("1", ["a"], "b", 2);

        var delta = PULComposition.compose(d0, d1, true);
        expect(delta.udps.replaceInObject.length).toBe(0);
        expect(delta.udps.insertIntoObject.length).toBe(1);
        expect(
            Common.isEqual(delta.udps.insertIntoObject[0].pairs, { b: 2, d: 1 })
        ).toBe(true);

        return Common.checkCompositionIntegrity(d0, d1, { "1": { a: {} } }).then(result => {
            expect(result).toBe(true);
        });
    });

    pit("Tests Aggregation with ReplaceInObject (1)", () => {
        var d0 = new PUL();
        d0.replaceInObject("1", [], "a", { b: 1 });

        var d1 = new PUL();
        d1.replaceInObject("1", ["a"], "b", 2);

        var delta = PULComposition.compose(d0, d1, true);

        expect(delta.udps.replaceInObject.length).toBe(1);
        expect(
            Common.isEqual(delta.udps.replaceInObject[0].item, { b: 2 })
        ).toBe(true);

        return Common.checkCompositionIntegrity(d0, d1, { "1": { a: {} } }).then(result => {
            expect(result).toBe(true);
        });
    });

    pit("Tests Aggregation with ReplaceInObject (2)", () => {
        var d0 = new PUL();
        d0.replaceInObject("1", ["a"], "b", { c: 1 });

        var d1 = new PUL();
        d1.replaceInObject("1", ["a", "b"], "c", 2);

        var delta = PULComposition.compose(d0, d1, true);

        expect(delta.udps.replaceInObject.length).toBe(1);
        expect(
            Common.isEqual(delta.udps.replaceInObject[0].item, { c: 2 })
        ).toBe(true);

        return Common.checkCompositionIntegrity(d0, d1, { "1": { a: { b: 1 } } }).then(result => {
            expect(result).toBe(true);
        });
    });

    pit("Test Aggregation with RenameInObject (1)", () => {
        var d0 = new PUL();
        d0.renameInObject("1", [], "a", "b");

        var d1 = new PUL();
        d1.replaceInObject("1", ["b"], "c", 2);

        var delta = PULComposition.compose(d0, d1, true);
        expect(delta.udps.renameInObject.length).toBe(1);
        expect(delta.udps.replaceInObject.length).toBe(1);
        expect(delta.udps.replaceInObject[0].ordPath.join(".")).toBe("a");
        expect(
            Common.isEqual(delta.udps.replaceInObject[0].item, 2)
        ).toBe(true);

        return Common.checkCompositionIntegrity(d0, d1, { "1": { a: { c: 1 } } }).then(result => {
            expect(result).toBe(true);
        });
    });

    pit("Test Aggregation with RenameInObject (2)", () => {
        var d0 = new PUL();
        d0.renameInObject("1", ["a"], "c", "b");

        var d1 = new PUL();
        d1.replaceInObject("1", ["a"], "b", 2);

        var delta = PULComposition.compose(d0, d1, true);
        expect(delta.udps.renameInObject.length).toBe(1);
        expect(delta.udps.replaceInObject.length).toBe(1);
        expect(delta.udps.replaceInObject[0].ordPath.join(".")).toBe("a");
        expect(delta.udps.replaceInObject[0].key).toBe("c");

        return Common.checkCompositionIntegrity(d0, d1, { "1": { a: { c: { d: 2 } } } }).then(result => {
            expect(result).toBe(true);
        });
    });

    pit("Test Accumulation (1)", () => {
        var d0 = new PUL();
        d0.renameInObject("1", [], "a", "z");

        var d1 = new PUL();
        d1.replaceInObject("1", ["b"], "c", 2);

        var delta = PULComposition.compose(d0, d1, true);
        expect(delta.udps.renameInObject.length).toBe(1);
        expect(delta.udps.replaceInObject.length).toBe(1);
        expect(delta.udps.replaceInObject[0].ordPath.join(".")).toBe("b");

        return Common.checkCompositionIntegrity(d0, d1, { "1": { b: { c: 1 }, a: 1 } }).then(result => {
            expect(result).toBe(true);
        });
    });

});
