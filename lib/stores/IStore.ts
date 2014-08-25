/// <reference path="../../definitions/es6-promise/es6-promise.d.ts" />
import PUL = require("../updates/PUL");
import UpdatePrimitives = require("../updates/UpdatePrimitives");

interface IStore {
    collections(): string[];
    collection(name: string): PUL;
    status(): UpdatePrimitives;
    commit(): Promise<IStore>;
}

export = IStore;
