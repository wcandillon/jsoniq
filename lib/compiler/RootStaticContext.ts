/// <reference path="../../typings/tsd.d.ts" />
import StaticContext = require("./StaticContext");
import Position = require("./parsers/Position");
//import QName = require("./QName");

class RootStaticContext extends StaticContext {

    constructor(pos: Position) {
        super(null, pos);
    }
}

export = RootStaticContext;
