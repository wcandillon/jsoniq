import PUL = require("../updates/PUL");

class Store {

    get(id: string): any {
        throw new Error("abstract method");
    }

    put(item: any, id?: string): string {
        throw new Error("abstract method");
    }

    remove(id: string): Store {
        throw new Error("abstract method");
    }

    commit(pul: PUL): Store {
        throw new Error("abstract method");
    }
}

export = Store;
