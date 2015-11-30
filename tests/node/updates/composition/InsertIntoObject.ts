require("jasmine2-pit");

import PUL from "../../../../lib/updates/PUL";
import PULComposition from "../../../../lib/updates/composition/PULComposition";
import Common from "./Common";

declare function pit(expectation: string, assertion?: (done: () => void) => any): void;

describe("InsertIntoObject Composition", () => {

    pit("Tests Aggregation with Insert", () => {
        var d0 = new PUL();
        d0.insert("1", { a: 1 });

        var d1 = new PUL();
        d1.insertIntoObject("1", [], { b: 1 });

        var delta = PULComposition.compose(d0, d1, true);
        expect(delta.udps.insertIntoObject.length).toBe(0);
        expect(delta.udps.insert.length).toBe(1);
        expect(delta.udps.insert[0].item["a"]).toBe(1);
        expect(delta.udps.insert[0].item["b"]).toBe(1);

        return Common.checkCompositionIntegrity(d0, d1, {}).then(result => {
            expect(result).toBe(true);
        });
    });

    pit("Tests Aggregation with InsertIntoObject", () => {
        var d0 = new PUL();
        d0.insertIntoObject("1", ["a"], { b: 1 });

        var d1 = new PUL();
        d1.insertIntoObject("1", ["a"], { c: 1 });

        var delta = PULComposition.compose(d0, d1, true);
        expect(delta.udps.insertIntoObject.length).toBe(1);
        expect(delta.udps.insertIntoObject[0].pairs["b"]).toBe(1);
        expect(delta.udps.insertIntoObject[0].pairs["c"]).toBe(1);

        return Common.checkCompositionIntegrity(d0, d1, { "1": { a: {} } }).then(result => {
            expect(result).toBe(true);
        });
    });

    pit("Tests Aggregation with ReplaceInObject", () => {
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

        return Common.checkCompositionIntegrity(d0, d1, { "1": { a: {} } }).then(result => {
            expect(result).toBe(true);
        });
    });

    pit("Test Aggregation with RenameInObject", () => {
        var d0 = new PUL();
        d0.renameInObject("1", [], "a", "b");

        var d1 = new PUL();
        d1.insertIntoObject("1", ["b"], { c: 1 });

        var delta = PULComposition.compose(d0, d1, true);
        expect(delta.udps.renameInObject.length).toBe(1);
        expect(delta.udps.insertIntoObject.length).toBe(1);
        expect(delta.udps.insertIntoObject[0].ordPath.join(".")).toBe("a");

        return Common.checkCompositionIntegrity(d0, d1, { "1": { a: {} } }).then(result => {
            expect(result).toBe(true);
        });
    });

    pit("Test Accumulation (1)", () => {
        var d0 = new PUL();
        d0.renameInObject("1", [], "c", "d");

        var d1 = new PUL();
        d1.insertIntoObject("1", ["a"], { c: 1 });

        var delta = PULComposition.compose(d0, d1, true);
        expect(delta.udps.renameInObject.length).toBe(1);
        expect(delta.udps.insertIntoObject.length).toBe(1);
        expect(delta.udps.insertIntoObject[0].ordPath.join(".")).toBe("a");

        return Common.checkCompositionIntegrity(d0, d1, { "1": { a: {}, c: 1 } }).then(result => {
            expect(result).toBe(true);
        });
    });

});
