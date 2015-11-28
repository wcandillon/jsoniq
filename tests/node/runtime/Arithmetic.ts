/// <reference path="../../../typings/tsd.d.ts" />
import * as u from "./Utils";

describe("Test Arithmetic Operation: ", () => {

    it("add(1, 1)", () => {
        return u.expectQuery("1 + 1").toEqual([2]);
    });

    it("add(1, 1.5)", () => {
        return u.expectQuery("2 + 1.5").toEqual([3.5]);
    });

    it("multiple operations", () => {
        return u.expectQuery(
            "1 + 1 + 1 - 1 - 1 + 10 - 1, (1 to 5), (1, (), 2, 3), 20.1 idiv 1.678, 10 div 2, 2 * 5, true, false, \"Hello\", \"World\"",
            true
        ).toEqual([10, 1, 2, 3, 4, 5, 1, 2, 3, 11, 5, 10, true, false, "Hello", "World"]);
    });

    it("to(1, add(5, 1))", () => {
        return u.expectQuery("(1 to 5 + 1)").toEqual([1, 2, 3, 4, 5, 6]);
    });
});
