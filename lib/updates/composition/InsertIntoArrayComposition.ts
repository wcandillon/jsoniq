import InsertIntoArray = require("../primitives/InsertIntoArray");
import PUL = require("../PUL");
import UPComposition = require("./UPComposition");

class InsertIntoArrayComposition extends UPComposition {
    constructor(d0: PUL) {
        super(d0);
    }

    compose(u: InsertIntoArray): InsertIntoArrayComposition {
        throw new Error("Not implemented yet");
    }
}

export = InsertIntoArrayComposition;
