/// <reference path="../../typings/tsd.d.ts" />
import UpdatePrimitives from "../updates/UpdatePrimitives";
import { ICollection } from "./ICollection";
import { ILogEntry } from "./ILogEntry";

export interface IStore {
    getCollections(): string[];
    collection(name: string): ICollection;
    status(): UpdatePrimitives;
    commit(): Promise<any>;
    init(): Promise<any>;
    clone(url: string): Promise<any>;
    log(from?: number, to?: number): Promise<ILogEntry>;
    rebase(from: string, to?: string): Promise<any>;
    reset(to: string): Promise<any>;
    resetLocal(): IStore;
}
