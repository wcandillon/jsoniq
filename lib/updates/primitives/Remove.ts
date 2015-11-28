/// <reference path="../../../typings/lodash/lodash.d.ts" />
import UpdatePrimitive from "./UpdatePrimitive";

import { IPUL } from "../IPUL";

export default class Delete extends UpdatePrimitive {
    id: string;

    constructor(id: string) {
        super("", []);
        this.id = id;
    }

    invert(target: any, pul: IPUL): UpdatePrimitive {
        pul.insert(this.id, target);
        return this;
    }
}
