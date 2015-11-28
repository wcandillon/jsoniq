/// <reference path="../../typings/tsd.d.ts" />
import * as _ from "lodash";
import QName from "./QName";
import Variable from "./Variable";
import Position from "./parsers/Position";

export default class StaticContext {

    private parent: StaticContext;
    private position: Position;
    private namespaces: QName[] = [];
    private variables: Variable[] = [];
    private varRefs: QName[] = [];

    constructor(parent: StaticContext, position: Position) {
        this.parent = parent;
        this.position = position;
    }

    createContext(pos: Position): StaticContext {
        return new StaticContext(this, pos);
    }

    getPosition(): Position {
        return this.position;
    }

    setPosition(position: Position): StaticContext {
        this.position = position;
        return this;
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

    addVariable(v: Variable): StaticContext {
        this.variables.push(v);
        return this;
    }

    getUnusedVarRefs(): QName[] {
        return this.varRefs.filter(varRef => {
            return this.variables.filter(v => { return v.getPrefix() === varRef.getPrefix() && v.getLocalName() === varRef.getLocalName(); }).length === 0;
        });
    }

    getUnusedVariables(): Variable[] {
        return this.variables.filter(v => {
            return this.varRefs.filter(varRef => { return v.getPrefix() === varRef.getPrefix() && v.getLocalName() === varRef.getLocalName(); }).length === 0;
        });
    }

    addVarRefs(qnames: QName[]): StaticContext {
        this.varRefs = this.varRefs.concat(qnames);
        return this;
    }

    addVarRef(qname: QName): StaticContext {
        this.varRefs.push(qname);
        return this;
    }
}
