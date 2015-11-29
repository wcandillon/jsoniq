/// <reference path="../../../typings/tsd.d.ts" />
import * as SourceMap from "source-map";
import Position from "../../compiler/parsers/Position";

//TODO: Make abstract
export default class Iterator {

    protected position: Position;

    constructor(position: Position) {
        this.position = position;
    }

    getPosition(): Position {
        return this.position;
    }

    toString(): string {
        return JSON.stringify(this, null, 2);
    }

//TODO: Make abstract
    serialize(): SourceMap.SourceNode {
        throw new Error("abstract method");
    }
}
