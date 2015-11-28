import PUL from "../../../../lib/updates/PUL";
import PULComposition from "../../../../lib/updates/composition/PULComposition";

describe("DeleteFromArray Composition", () => {
    it("should throw an error", () => {
        var d0 = new PUL();
        d0.insertIntoArray("1", [], 1, [1]);

        var d1 = new PUL();
        d1.deleteFromArray("1", [], 1);

        expect(() => {
            PULComposition.compose(d0, d1);
        }).toThrow();
    });
});
