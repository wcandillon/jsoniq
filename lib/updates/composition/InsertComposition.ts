/// <reference path="../../../definitions/lodash/lodash.d.ts" />
import _ = require("lodash");

import Insert        = require("../primitives/Insert");
import PUL           = require("../PUL");
import UPComposition = require("./UPComposition");

class InsertComposition extends UPComposition {

    constructor(d0: PUL) {
        super(d0);
    }

    compose(u: Insert): InsertComposition {
        var idx =_.findIndex(this.d0.udps.remove, { id: u.id });
        if(idx > -1) {
            this.d0.udps.remove.splice(idx, 1);
        }
        this.d0.insert(u.id, u.item);
        return this;
    }
}

export = InsertComposition;
