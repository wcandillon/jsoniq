/// <reference path="../../typings/tsd.d.ts" />
import StaticContext from "./StaticContext";
import Position from "./parsers/Position";

export default class RootStaticContext extends StaticContext {

    constructor(pos: Position) {
        super(null, pos);
    }
}
