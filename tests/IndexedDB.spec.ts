///<reference path='../definitions/jest/jest.d.ts'/>
///<reference path='../lib/updates/PUL.ts' />
var PUL = require("PUL");

describe("PUL", () => {
    it("Should build a simple PUL", () => {
        var pul = new PUL();
        pul
            .insertIntoObject("1", [], { b: 2 })
            .insertIntoArray("1", [], 0, ["a"])
            .deleteFromObject("1", [], ["a", "b"])
            .replaceInObject("1", [], "a", 1);
        expect(true).toBe(true);
    });
});
