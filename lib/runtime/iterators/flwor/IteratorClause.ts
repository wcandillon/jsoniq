/// <reference path="../../../../typings/tsd.d.ts" />
import * as SourceMap from "source-map";

import Iterator from "../Iterator";

//TODO: Make abstract
export default class IteratorClause extends Iterator {

    serializeClause(clauses: IteratorClause[]): SourceMap.SourceNode {
        var chunk = _.template("new r.Position(<%= sl %>, <%= sc %>, <%= el %>, <%= ec %>, '<%= fileName %>')")(this.position);
        return new SourceMap.SourceNode(
            this.position.getStartLine() + 1, this.position.getStartColumn() + 1,
            this.position.getFileName(), chunk, "position"
        );
    }
}
