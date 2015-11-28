/// <reference path="../../../typings/lodash/lodash.d.ts" />
import * as _ from "lodash";

import Insert from "../primitives/Insert";
import PUL from "../PUL";
import UPComposition from "./UPComposition";

export default class InsertComposition extends UPComposition {

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
