import UpdatePrimitive from "./UpdatePrimitive";

import { IPUL } from "../IPUL";

export default class InsertIntoArray extends UpdatePrimitive {
    position: number;
    items: any[];

    constructor(id: string, ordPath: string[], position: number, items: any[]) {
        super(id, ordPath);
        this.position = position;
        this.items = items;
    }

    merge(udp: InsertIntoArray): UpdatePrimitive {
        Array.prototype.splice.apply(this.items, [this.items.length, 0].concat(udp.items));
        return this;
    }

    apply(): UpdatePrimitive {
        var target = this.getTarget();
        this.items.forEach((i) => {
            target.splice(this.position, 0, i);
        });
        return this;
    }

    invert(item: any, pul: IPUL): UpdatePrimitive {
        pul.deleteFromArray(this.id, this.ordPath, this.position);
        return this;
    }
}
