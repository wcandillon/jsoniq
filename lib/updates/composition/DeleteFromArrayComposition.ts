import DeleteFromArray = require("../primitives/DeleteFromArray");
import PUL = require("../PUL");
import UPComposition = require("./UPComposition");

class DeleteFromArrayComposition extends UPComposition {
    constructor(d0: PUL) {
        super(d0);
    }

    compose(u: DeleteFromArray): DeleteFromArrayComposition {
        throw new Error("Not implemented yet");
    }
}

export = DeleteFromArrayComposition;
