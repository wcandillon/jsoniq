/// <reference path="../../../typings/lodash/lodash.d.ts" />
import _ = require("lodash");

import Insert = require("../primitives/Insert");
import InsertIntoObject = require("../primitives/InsertIntoObject");
import ReplaceInObject = require("../primitives/ReplaceInObject");
import PUL = require("../PUL");
import UPComposition = require("./UPComposition");

class InsertIntoObjectComposition extends UPComposition {

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
            this.renameInObjectAggregation(this.d0, u);
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

export = InsertIntoObjectComposition;
