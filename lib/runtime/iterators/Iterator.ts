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

    isClosed(): boolean {
        return this.closed;
    }

    forEach(callback:  (item: any) => void): Iterator {
        this.next().then(item => {
            callback(item);
            if(!this.isClosed()) {
                this.forEach(callback);
            }
        });
        return this;
    }
}

export = Iterator;
