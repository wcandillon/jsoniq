/// <reference path="../../typings/tsd.d.ts" />
import _ = require("lodash");
import QName = require("./QName");

class StaticContext {

    private parent: StaticContext;
    private position: Position;
    private namespaces: QName[] = [];

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

    addNamespace(prefix: string, uri: string): StaticContext {
        this.namespaces.push(new QName(prefix, uri, ""));
        return this;
    }

    getNamespaceByPrefix(prefix: string): QName {
        var qname = _.find(this.namespaces, { prefix: prefix });
        if(!qname && this.parent) {
            return this.parent.getNamespaceByPrefix(prefix);
        }
        return qname;
    }

    addVariable(qname: QName): StaticContext {
        return this;
    }
}

export = StaticContext;
