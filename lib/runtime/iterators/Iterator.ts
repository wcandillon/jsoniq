/// <reference path="../../../typings/tsd.d.ts" />
class Iterator {
    protected closed: boolean = false;
    protected state: any;

    next(): Promise<any> {
        if(this.closed) {
            throw new Error("Iterator is closed.");
        }
        return null;
    }

    public isClosed(): boolean {
        return this.closed;
    }
}

export = Iterator;
