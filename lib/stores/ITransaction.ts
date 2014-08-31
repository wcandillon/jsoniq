/// <reference path="../../definitions/es6-promise/es6-promise.d.ts" />
interface ITransaction {
    done(): Promise<any>;
    get(id: string): Promise<any>;
    put(id: string, item: any): ITransaction;
    remove(id: string): ITransaction;
}

export = ITransaction;
