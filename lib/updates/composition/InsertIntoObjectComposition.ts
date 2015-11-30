/// <reference path="../../../typings/lodash/lodash.d.ts" />
import * as _ from "lodash";

import InsertIntoObject from "../primitives/InsertIntoObject";
import ReplaceInObject from "../primitives/ReplaceInObject";

import Insert from "../primitives/Insert";
import PUL from "../PUL";
import UPComposition from "./UPComposition";

export default class InsertIntoObjectComposition extends UPComposition {

    constructor(d0: PUL) {
        super(d0);
    }

    compose(u: InsertIntoObject): InsertIntoObjectComposition {
        var target = this.findAggregationTarget(u);
        if(target instanceof Insert) {
            this.insertAggregation(<Insert> target, u);
        } else if(target instanceof InsertIntoObject) {
            this.insertIntoObjectAggregation(<InsertIntoObject> target, u);
        } else if(target instanceof ReplaceInObject) {
            this.replaceInObjectAggregation(<ReplaceInObject> target, u);
        } else {
            this.renameInObjectAggregation(u);
            this.d0.insertIntoObject(u.id, u.ordPath, u.pairs);
        }
        return this;
    }

    insertAggregation(ut: Insert, u: InsertIntoObject) {
        _.merge(this.find(ut.item, u.ordPath), u.pairs);
    }

    insertIntoObjectAggregation(ut: InsertIntoObject, u: InsertIntoObject) {
        _.merge(ut.pairs, u.pairs);
    }

    replaceInObjectAggregation(ut: ReplaceInObject, u: InsertIntoObject) {
        var i = this.isSubsetOrEqual(ut.ordPath, u.ordPath);
        if(i > -2) {
            _.merge(this.find(ut.item, u.ordPath.slice(i + 2)), u.pairs);
        } else {
            //Accumulation
            this.d0.insertIntoObject(u.id, u.ordPath, u.pairs);
        }
    }
}
