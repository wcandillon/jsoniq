/// <reference path="../../../typings/lodash/lodash.d.ts" />
//import _ = require("lodash");
//import jerr = require("../../errors");

import UpdatePrimitive from "./UpdatePrimitive";

import { IPUL } from "../IPUL";

export default class Insert extends UpdatePrimitive {
    id: string;
    item: any;

    constructor(id: string, item: any) {
        super("", []);
        this.id = id;
        this.item = item;
    }

    invert(target: any, pul: IPUL): UpdatePrimitive {
        pul.remove(this.id);
        return this;
    }
}
