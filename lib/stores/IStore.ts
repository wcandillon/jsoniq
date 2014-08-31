/// <reference path="../../definitions/es6-promise/es6-promise.d.ts" />
import UpdatePrimitives = require("../updates/UpdatePrimitives");
import ICollection = require("./ICollection");

interface IStore {
    getCollections(): string[];
    collection(name: string): ICollection;
    status(): UpdatePrimitives;
    commit(): Promise<any>;
}

export = IStore;
