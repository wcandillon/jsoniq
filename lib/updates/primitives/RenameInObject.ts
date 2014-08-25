import jerr = require("../../errors");
import UpdatePrimitive = require("./UpdatePrimitive");

import IPUL = require("../IPUL");

class RenameInObject extends UpdatePrimitive {
    key: string;
    newKey: string;

    constructor(id: string, ordPath: string[], key: string, newKey: string) {
        super(id, ordPath);
        this.key = key;
        this.newKey = newKey;
    }

    apply(): UpdatePrimitive {
        var target = this.getTarget();
        if(target[this.newKey] !== undefined) {
            throw new jerr.JNUP0006(this.newKey);
        }
        if(target[this.key] === undefined) {
            throw new jerr.JNUP0016(this.key);
        }
        target[this.newKey] = target[this.key];
        delete target[this.key];
        return this;
    }

    invert(item: any, pul: IPUL): UpdatePrimitive {
        pul.deleteFromObject(this.id, this.ordPath, [this.newKey]);
        var obj = {};
        obj[this.key] = item[this.key];
        pul.insertIntoObject(this.id, this.ordPath, obj);
        return this;
    }
}

export = RenameInObject;
