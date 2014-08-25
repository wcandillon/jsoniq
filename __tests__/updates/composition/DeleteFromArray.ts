///<reference path='../../../definitions/jest/jest.d.ts'/>
///<reference path="../../../definitions/node-uuid/node-uuid.d.ts" />
///<reference path="../../../definitions/lodash/lodash.d.ts" />
import PUL = require("../../../lib/updates/PUL");
import PULComposition = require("../../../lib/updates/composition/PULComposition");

jest.autoMockOff();

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
