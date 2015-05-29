/// <reference path="../../typings/tsd.d.ts" />
import StaticContext = require("./StaticContext");
//import QName = require("./QName");

class RootStaticContext extends StaticContext {

    constructor() {
        super(null, null);
    }
}

export = RootStaticContext;
