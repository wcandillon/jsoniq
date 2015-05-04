/// <reference path="../../../typings/tsd.d.ts" />
interface Iterator {
    next(): { value?: any; done: boolean };
}

export = Iterator;
