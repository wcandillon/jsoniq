/// <reference path="../../../typings/tsd.d.ts" />
import * as _ from "lodash";
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
        var chunk = _.template("new r.Position(<%= sl %>, <%= sc %>, <%= el %>, <%= ec %>, '<%= fileName %>')")(this.position);
        return new SourceMap.SourceNode(
            this.position.getStartLine() + 1, this.position.getStartColumn() + 1,
            this.position.getFileName(), chunk, "position"
        );
    }
}
