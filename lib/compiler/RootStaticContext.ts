/// <reference path="../../typings/tsd.d.ts" />
import StaticContext from "./StaticContext";
import Position from "./parsers/Position";
import QName from "./QName";

export default class RootStaticContext extends StaticContext {

    private modules: QName[] = [];

    constructor(pos: Position) {
        super(null, pos);
    }

    getProlog(): string {
        return this.modules.map(module => {
            return `var ${module.getPrefix()} = require('${module.getURI()}');`;
        }).join("\n");
    }

    importModule(prefix: string, uri: string): StaticContext {
        this.modules.push(new QName(prefix, uri, ""));
        this.addNamespace(prefix, uri);
        return this;
    }
}
