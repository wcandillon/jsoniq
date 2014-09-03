/// <reference path="../../../definitions/lodash/lodash.d.ts" />
import _ = require("lodash");

import ICollection = require("../ICollection");
import PUL = require("../../updates/PUL");

class IndexedDBCollection implements ICollection {

    private name: string;
    private keyPath: string;
    private pul: PUL;

    private keyMustBeProvided(): boolean {
        return !this.keyPath;
    }

    private keyCannotBeProvided(): boolean {
        return this.keyPath !== undefined;
    }

    //http://www.w3.org/TR/IndexedDB/#dfn-steps-for-extracting-a-key-from-a-value-using-a-key-path
    //TODO: string[] type for keypath is not supported yet.
    private getKey(value: any, keyPath?: string[]): any {
        if(!keyPath) {
            keyPath = this.keyPath.split(".");
        }
        if(keyPath.length === 0) {
            return value;
        }
        var current = keyPath[0];
        var remaining = keyPath.slice(1);
        if(current === "") {
            return value;
        }
        if(!_.isObject(value)) {
            return undefined;
        }
        return this.getKey(value[current], remaining);
    }

    private getId(id?: string, value?: any): string {
        if(id && value && this.keyCannotBeProvided()) {
            throw new Error("Key cannot be provided");
        } else if(!id && this.keyMustBeProvided()) {
            throw new Error("Key must be provided");
        }
        if(!id && value) {
            id = this.getKey(value);
            if(id === undefined) {
                throw new Error("Not key found for keyPath " + this.keyPath + " and object " + JSON.stringify(value));
            }
        }
        if(!id && !value) {
            throw new Error("At least the key or the value must be provided.");
        }
        return this.name + ":" + id;
    }

    constructor(store: IDBObjectStore, pul: PUL) {
        if(store["autoIncrement"] === true) {
            throw new Error("Auto-generated keys are not supported.");
        }
        this.name = store.name;
        this.keyPath = store.keyPath;
        this.pul = pul;
    }

    insert(document: any, id?: string): ICollection {
        this.pul.insert(this.getId(id, document), document);
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
                _.remove(udps, udp => {
                    var prefix = this.name + ":";
                    return udp.id.substring(0, prefix.length) === prefix;
                });
            }
        });
        return this;
    }
}

export = IndexedDBCollection;
