interface Store {
    get(target: string): any;
    put(item: any, ref?: string): string;

    insertIntoObject(ref: string, ordPath: string[], pairs: {}): Store;
    insertIntoArray(ref: string, ordPath: string[], position: number, items: any[]): Store;
    deleteFromObject(ref: string, ordPath: string[], keys: string[]): Store;
    deleteFromArray(ref: string, ordPath: string[], position: number): Store;
    replaceInArray(ref: string, ordPath: string[], position: number, item: any): Store;
    replaceInObject(ref: string, ordPath: string[], key: string, item: any): Store;
    renameInObject(ref: string, ordPath: string[], key: string, newKey: string): Store;

    commit(): Store;
}
