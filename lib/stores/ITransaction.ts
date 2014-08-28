interface ITransaction {
    get(id: string): any;
    put(id: string, item: any): ITransaction;
    remove(id: string): ITransaction;
}

export = ITransaction;
