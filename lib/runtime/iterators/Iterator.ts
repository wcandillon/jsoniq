/// <reference path="../../typings/tsd.d.ts" />
interface Iterator {

    next(): Promise<any>;
    closed(): boolean;
}

export = Iterator;