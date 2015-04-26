/// <reference path="../../../typings/node-uuid/node-uuid.d.ts" />
import uuid = require("node-uuid");

import ICollection = require("../ICollection");
import PUL = require("../../updates/PUL");

class MemoryCollection implements ICollection {

    private name: string;
    private pul: PUL;

    private getId(id: string): string {
        return this.name + ":" + id;
    }

    constructor(name: string, pul: PUL) {
        this.name = name;
        this.pul = pul;
    }

    insert(document: any, id?: string): ICollection {
        if(!id) {
            id = uuid.v4();
        }
        this.pul.insert(this.getId(id), document);
        return this;
    }

    remove(id: string): ICollection {
        this.pul.remove(this.getId(id));
        return this;
    }

    insertIntoObject(id: string, ordPath: string[], pairs: {}): ICollection {
        this.pul.insertIntoObject(this.getId(id), ordPath, pairs);
        return this;
    }

    insertIntoArray(id: string, ordPath: string[], position: number, items: any[]): ICollection {
        this.pul.insertIntoArray(this.getId(id), ordPath, position, items);
        return this;
    }

    deleteFromObject(id: string, ordPath: string[], keys: Array<string>): ICollection {
        this.pul.deleteFromObject(this.getId(id), ordPath, keys);
        return this;
    }

    deleteFromArray(id: string, ordPath: string[], position: number): ICollection {
        this.pul.deleteFromArray(this.getId(id), ordPath, position);
        return this;
    }

    replaceInArray(id: string, ordPath: string[], position: number, item: any): ICollection {
        this.pul.replaceInArray(this.getId(id), ordPath, position, item);
        return this;
    }

    replaceInObject(id: string, ordPath: string[], key: string, item: any): ICollection {
        this.pul.renameInObject(this.getId(id), ordPath, key, item);
        return this;
    }

    renameInObject(id: string, ordPath: string[], key: string, newKey: string): ICollection {
        this.pul.renameInObject(this.getId(id), ordPath, key, newKey);
        return this;
    }

    reset(): ICollection {
        this.pul.udps.forEach((udp, udps, index) => {
            if(index === 0) {
                _.remove(udps, value => {
                    var prefix = this.name + ":";
                    return value.substring(0, prefix.length) === prefix;
                });
            }
        });
        return this;
    }
}

export = MemoryCollection;
