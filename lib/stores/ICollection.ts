interface ICollection {
    insert(document: any, id?: string): ICollection;
    remove(id: string): ICollection;
    insertIntoObject(id: string, ordPath: string[], pairs: {}): ICollection;
    insertIntoArray(id: string, ordPath: string[], position: number, items: any[]): ICollection;
    deleteFromObject(id: string, ordPath: string[], keys: Array<string>): ICollection;
    deleteFromArray(id: string, ordPath: string[], position: number): ICollection;
    replaceInArray(id: string, ordPath: string[], position: number, item: any): ICollection;
    replaceInObject(id: string, ordPath: string[], key: string, item: any): ICollection;
    renameInObject(id: string, ordPath: string[], key: string, newKey: string): ICollection;
}

export = ICollection;
