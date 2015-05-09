/// <reference path="../../typings/tsd.d.ts" />
import StaticContext = require("./StaticContext");

class RootStaticContext extends StaticContext {

    constructor() {
        super(null, null);
    }
}

export = RootStaticContext;
