require("jasmine2-pit");

import PUL from "../../../../lib/updates/PUL";
import PULComposition from "../../../../lib/updates/composition/PULComposition";
import Common from "./Common";

declare function pit(expectation: string, assertion?: (done: () => void) => any): void;

describe("Insert Composition", () => {

    pit("Tests Aggregation (1)", () => {
        var d0 = new PUL();
        d0.insert("1", { a: 1 });
        d0.remove("1");

        var d1 = new PUL();
        d1.insert("1", { a: 1 });

        var delta = PULComposition.compose(d0, d1, true);
        expect(delta.udps.remove.length).toBe(0);
        expect(delta.udps.insert.length).toBe(1);
        expect(delta.udps.insert[0].id).toBe("1");
        expect(delta.udps.insert[0].item.a).toBe(1);

        return Common.checkCompositionIntegrity(d0, d1, {}).then(result => {
            expect(result).toBe(true);
        });
    });

    pit("Tests Aggregation (2)", () => {
        var d0 = new PUL();
        d0.remove("1");

        var d1 = new PUL();
        d1.insert("1", { a: 1 });

        var delta = PULComposition.compose(d0, d1, true);
        expect(delta.udps.remove.length).toBe(0);
        expect(delta.udps.insert.length).toBe(1);
        expect(delta.udps.insert[0].id).toBe("1");
        expect(delta.udps.insert[0].item.a).toBe(1);

        return Common.checkCompositionIntegrity(d0, d1, {}).then(result => {
            expect(result).toBe(true);
        });
    });
});
