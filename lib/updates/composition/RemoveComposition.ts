/// <reference path="../../../typings/lodash/lodash.d.ts" />
import _ = require("lodash");

import Remove          = require("../primitives/Remove");
import PUL             = require("../PUL");
import UPComposition   = require("./UPComposition");

class RemoveComposition extends UPComposition {

    constructor(d0: PUL) {
        super(d0);
    }

    compose(u: Remove): RemoveComposition {
        var idx = _.findIndex(this.d0.udps.insert, { id: u.id });
        if(idx > -1) {
            this.d0.udps.insert.splice(idx, 1);
        } else {
            this.d0.remove(u.id);
        }
        return this;
    }
}

export = RemoveComposition;
