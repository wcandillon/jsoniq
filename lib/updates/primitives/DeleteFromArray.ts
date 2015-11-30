/// <reference path="../../../typings/lodash/lodash.d.ts" />
//import _ from "lodash");
//import jerr from "../../errors");

import UpdatePrimitive from "./UpdatePrimitive";

import { IPUL } from "../IPUL";

export default class DeleteFromArray extends UpdatePrimitive {
    position: number;

    constructor(id: string, ordPath: string[], position: number) {
        super(id, ordPath);
        this.position = position;
    }

    apply(): UpdatePrimitive {
        var target = this.getTarget();
        target.splice(this.position, 1);
        return this;
    }

    invert(target: any, pul: IPUL): UpdatePrimitive {
        pul.insertIntoArray(this.id, this.ordPath, this.position, target);
        return this;
    }
}
