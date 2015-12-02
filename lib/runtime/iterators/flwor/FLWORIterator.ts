/// <reference path="../../../../typings/tsd.d.ts" />
import * as _ from "lodash";
import * as SourceMap from "source-map";

import Position from "../../../compiler/parsers/Position";
import IteratorClause from "./IteratorClause";
import OrderByIterator from "./OrderByIterator";
import ReturnTupleIterator from "./ReturnTupleIterator";
import Iterator from "../Iterator";

export default class FLWORIterator extends Iterator {

    private clauses: IteratorClause[];


    constructor(position: Position, clauses: Iterator[]) {
        super(position);
        this.clauses = <IteratorClause[]>clauses;
    }

    private isMaterializingClause(it: IteratorClause): boolean {
        return it instanceof OrderByIterator;
    }

    private serializeAsStream(node, clauses: IteratorClause[]): FLWORIterator {
        node.add("(function *(){")
            .add(clauses[0].serializeClause(clauses.slice(1)))
            .add("})()");
        return this;
    }

    private serializeChunk(
        node: SourceMap.SourceNode,
        left: IteratorClause[],
        op: IteratorClause[],
        right: IteratorClause[],
        remaining: any[]
    ): FLWORIterator {
        var bindings = {};
        left.forEach(clause => {
            if(clause.getBindingVar() !== undefined) {
                bindings[clause.getBindingVar()] = true;
            }
        });
        var leftIts = left.slice(1);
        leftIts.push(new ReturnTupleIterator(this.position, Object.keys(bindings)));
        node.add("(function *(){\n")
            .add("let tuples = (function *(){\n")
            .add(left[0].serializeClause(leftIts))
            //.add()
            .add("})();")
            .add(op[0].serializeClause(op.slice(1)))
            .add("for(let tuple of tuples){\n");
        _.forEach(bindings, (v, varName) => {
            node.add(`let $${varName} = tuple['$${varName}'];\n`);
        });
        node.add(right[0].serializeClause(right.slice(1)))
            .add("\n}\n})()");

        if(remaining.length > 0) {
            this.serializeChunk(node, remaining[0], remaining[1], remaining[2], remaining.slice(3));
        }

        return this;
    }

    serialize(): SourceMap.SourceNode {
        var chunks = [[]];
        this.clauses.forEach((clause, index) => {
            var prev = this.clauses[index - 1];
            var next = this.clauses[index + 1];
            if(this.isMaterializingClause(clause) && !this.isMaterializingClause(prev)) {
                chunks.push([]);
                chunks[chunks.length - 1].push(clause);
                if(!this.isMaterializingClause(next)) {
                    chunks.push([]);
                }
            } else {
                chunks[chunks.length - 1].push(clause);
            }
        });

        var node = super.serialize("flwor");
        if(chunks.length > 1) {
            this.serializeChunk(node, chunks[0], chunks[1], chunks[2], chunks.slice(3));
        } else {
            this.serializeAsStream(node, this.clauses);
        }
        return node;

    }
}
