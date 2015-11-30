/// <reference path="../../../typings/lodash/lodash.d.ts" />
import * as _ from "lodash";

import Remove          from "../primitives/Remove";
import PUL             from "../PUL";
import UPComposition   from "./UPComposition";

export default class RemoveComposition extends UPComposition {

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
