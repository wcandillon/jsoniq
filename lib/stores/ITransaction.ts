export interface ITransaction {
    done(): Promise<any>;
    get(id: string): Promise<any>;
    put(id: string, item: any): ITransaction;
    remove(id: string): ITransaction;
}
