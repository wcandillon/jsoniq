/// <reference path="../../../typings/tsd.d.ts" />
import * as SourceMap from "source-map";
import Position from "../../compiler/parsers/Position";

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

    serialize(symbol?: string): SourceMap.SourceNode {
        return new SourceMap.SourceNode(
            this.position.getStartLine() + 1,
            this.position.getStartColumn(),
            this.position.getFileName(),
            undefined,
            symbol ? symbol : "it"
        );
    }
}
