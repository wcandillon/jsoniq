/// <reference path="../../../typings/lodash/lodash.d.ts" />
import * as _ from "lodash";
//import jerr = from "../../errors");

import UpdatePrimitive from "./UpdatePrimitive";

import {IPUL} from "../IPUL";

export default class DeleteFromObject extends UpdatePrimitive {
    keys: string[];

    constructor(id: string, ordPath: string[], keys: string[]) {
        super(id, ordPath);
        this.keys = keys;
    }

    merge(udp: DeleteFromObject): UpdatePrimitive {
        this.keys = _.uniq(this.keys.concat(udp.keys));
        return this;
    }

    apply(): UpdatePrimitive {
        var target = this.getTarget();
        this.keys.forEach(function(key) {
            delete target[key];
        });
        return this;
    }

    invert(item: any, pul: IPUL): UpdatePrimitive {
        var pairs = {};
        this.keys.forEach((key) => {
            pairs[key] = item[key];
        });
        pul.insertIntoObject(this.id, this.ordPath, pairs);
        return this;
    }
}
