import ReplaceInArray = require("../primitives/ReplaceInArray");
import PUL = require("../PUL");
import UPComposition = require("./UPComposition");

class ReplaceInArrayComposition extends UPComposition {
    constructor(d0: PUL) {
        super(d0);
    }

    compose(u: ReplaceInArray): ReplaceInArrayComposition {
        throw new Error("Not implemented yet");
    }
}

export = ReplaceInArrayComposition;
