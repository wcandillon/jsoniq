/// <reference path="../../typings/tsd.d.ts" />

import Iterator = require("./iterators/Iterator");

class DynamicContext {

    private parent: DynamicContext;
    private variables: { [index: string]: Iterator };

    constructor(parent?: DynamicContext) {
        this.parent = parent;
    }

    getParent(): DynamicContext {
        return this.parent;
    }

    createContext(): DynamicContext {
        return new DynamicContext(this);
    }

    setVariable(ns: string, varName: string, value: Iterator): DynamicContext {
        this.variables[ns + "#" + varName] = value;
        return this;
    }

    getVariable(ns: string, varName: string): Iterator {
        var lookup = this.variables[ns + "#" + varName];
        if(lookup) {
            return lookup;
        } else if (this.parent) {
            return this.parent.getVariable(ns, varName);
        } else {
            return undefined;
        }
    }
}

export = DynamicContext;
