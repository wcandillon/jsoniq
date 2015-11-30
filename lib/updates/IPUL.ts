export interface IPUL {

    parse(pul: string): IPUL;
    serialize();

    normalize(): IPUL;

    insertIntoObject(id: string, ordPath: string[], pairs: {}): IPUL;
    insertIntoArray(id: string, ordPath: string[], position: number, items: any[]): IPUL;
    deleteFromObject(id: string, ordPath: string[], keys: Array<string>): IPUL;
    deleteFromArray(id: string, ordPath: string[], position: number): IPUL;
    replaceInArray(id: string, ordPath: string[], position: number, item: any): IPUL;
    replaceInObject(id: string, ordPath: string[], key: string, item: any): IPUL;
    renameInObject(id: string, ordPath: string[], key: string, newKey: string): IPUL;
    insert(id: string, item: any): IPUL;
    remove(id: string): IPUL;
}
