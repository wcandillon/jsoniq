/// <reference path="../../../typings/lodash/lodash.d.ts" />
//import _ = require("lodash");
import * as jerr from "../../errors";
import UpdatePrimitive from "./UpdatePrimitive";

import { IPUL } from "../IPUL";

export default class ReplaceInObject extends UpdatePrimitive {
    key: string;
    item: any;

    constructor(id: string, ordPath: string[], key: string, item: any) {
        super(id, ordPath);
        this.key = key;
        this.item = item;
    }

    apply(): UpdatePrimitive {
        var target = this.getTarget();
        if(target[this.key] === undefined) {
            throw new jerr.JNUP0016(this.key);
        }
        target[this.key] = this.item;
        return this;
    }

    invert(item: any, pul: IPUL): UpdatePrimitive {
        pul.deleteFromObject(this.id, this.ordPath, [this.key]);
        var obj = {};
        obj[this.key] = item[this.key];
        pul.insertIntoObject(this.id, this.ordPath, obj);
        return this;
    }
}
