/// <reference path="../../typings/node-uuid/node-uuid.d.ts" />
import uuid = require("node-uuid");
import PUL = require("../updates/PUL");
import Store = require("./Store");

class MemoryStore implements Store {
    pul: PUL = new PUL();
    items: {} = {};

    private getTarget(ref: string, ordPath: string[]): string {
        return [ref, ordPath.join(".")].join(":");
    }

    private find(item: any, ordPath: string[]): any {
        if(ordPath.length === 0) {
            return item;
        } else {
            return this.find(item[ordPath[0]], ordPath.slice(1));
        }
    }

    get(ref: string): any {
        var segments = ref.split(":");
        var target = segments[0];
        var ordPath = segments[1] ? segments[1].split(".") : [];
        var result = this.find(this.items[target], ordPath);
        if(result) {
            return result;
        } else {
            throw new Error("Item not found: " + ref);
        }
    }

    put(item: any, ref?: string): string {
        ref = ref ? ref : uuid.v4();
        this.items[ref] = item;
        return ref;
    }

    insertIntoObject(ref: string, ordPath: string[], pairs: {}): Store {
        var target = this.getTarget(ref, ordPath);
        this.pul.insertIntoObject(target, pairs);
        return this;
    }

    insertIntoArray(ref: string, ordPath: string[], position: number, items: any[]): Store {
        var target = this.getTarget(ref, ordPath);
        this.pul.insertIntoArray(target, position, items);
        return this;
    }

    deleteFromObject(ref: string, ordPath: string[], keys: string[]): Store {
        var target = this.getTarget(ref, ordPath);
        this.pul.deleteFromObject(target, keys);
        return this;
    }

    deleteFromArray(ref: string, ordPath: string[], position: number): Store {
        var target = this.getTarget(ref, ordPath);
        this.pul.deleteFromArray(target, position);
        return this;
    }

    replaceInArray(ref: string, ordPath: string[], position: number, item: any): Store {
        var target = this.getTarget(ref, ordPath);
        this.pul.replaceInArray(target, position, item);
        return this;
    }

    replaceInObject(ref: string, ordPath: string[], key: string, item: any): Store {
        var target = this.getTarget(ref, ordPath);
        this.pul.replaceInObject(target, key, item);
        return this;
    }

    renameInObject(ref: string, ordPath: string[], key: string, newKey: string): Store {
        var target = this.getTarget(ref, ordPath);
        this.pul.renameInObject(target, key, newKey);
        return this;
    }

    commit(): Store {
        this.pul.apply(this);
        return this;
    }
}

export = MemoryStore;
