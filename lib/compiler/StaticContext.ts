/// <reference path="../../typings/tsd.d.ts" />

class StaticContext {

    private parent: StaticContext;
    private position: Position;

    constructor(parent: StaticContext, position: Position) {
        this.parent = parent;
        this.position = position;
    }

    createContext(): StaticContext {
        return new StaticContext(this, undefined);
    }

    getParent(): StaticContext {
        return this.parent;
    }
}

export = StaticContext;
