/// <reference path="../../typings/tsd.d.ts" />
import UpdatePrimitives = require("../updates/UpdatePrimitives");
import ICollection = require("./ICollection");
import LogEntry = require("./LogEntry");

interface IStore {
    getCollections(): string[];
    collection(name: string): ICollection;
    status(): UpdatePrimitives;
    commit(): Promise<any>;
    init(): Promise<any>;
    clone(url: string): Promise<any>;
    log(from?: number, to?: number): Promise<LogEntry>;
    rebase(from: string, to?: string): Promise<any>;
    reset(to: string): Promise<any>;
    resetLocal(): IStore;
}

export = IStore;
