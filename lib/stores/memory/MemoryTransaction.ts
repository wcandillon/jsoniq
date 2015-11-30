import { ITransaction } from "../ITransaction";

export default class MemoryTransaction implements ITransaction {

    public snapshot: {} = {};

    constructor(snapshot: {}) {
        this.snapshot = snapshot;
    }

    done(): Promise<any> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve([]);
            }, 1);
        });
    }

    get(id: string): Promise<any> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.snapshot[id]);
            }, 1);
        });
    }

    put(id: string, item: any): ITransaction {
        this.snapshot[id] = item;
        return this;
    }

    remove(id: string): ITransaction {
        delete this.snapshot[id];
        return this;
    }
}
