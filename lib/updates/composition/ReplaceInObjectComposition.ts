/// <reference path="../../../definitions/lodash/lodash.d.ts" />
import _ = require("lodash");

import Insert = require("../primitives/Insert");
import InsertIntoObject = require("../primitives/InsertIntoObject");
import ReplaceInObject = require("../primitives/ReplaceInObject");
import PUL = require("../PUL");
import UPComposition = require("./UPComposition");

class ReplaceInObjectComposition extends UPComposition {

    constructor(d0: PUL) {
        super(d0);
    }

    compose(u: ReplaceInObject): ReplaceInObjectComposition {
        var target = this.findAggregationTarget(u);
        if(target instanceof Insert) {
            this.insertAggregation(<Insert> target, u);
        } else if(target instanceof InsertIntoObject) {
            this.insertIntoObjectAggregation(<InsertIntoObject> target, u);
        } else if(target instanceof ReplaceInObject) {
            this.replaceInObjectAggregation(<ReplaceInObject> target, u);
        } else {
            this.renameInObjectAggregation(u);
            this.d0.replaceInObject(u.id, u.ordPath, u.key, u.item);
        }
        return this;
    }

    insertAggregation(ut: Insert, u: ReplaceInObject) {
        var item = this.find(ut.item, u.ordPath);
        item[u.key] = u.item;
    }

    insertIntoObjectAggregation(ut: InsertIntoObject, u: ReplaceInObject) {
        ut.pairs[u.key] = u.item;
    }

    replaceInObjectAggregation(ut: ReplaceInObject, u: ReplaceInObject) {
        var i = this.isSubsetOrEqual(ut.ordPath.concat(ut.key), u.ordPath);
        if(i > -2) {
            var item = this.find(ut.item, u.ordPath.concat(u.key).slice(i + 2));
            item[u.key] = u.item;
        } else {
            //Accumulation
            this.d0.replaceInObject(u.id, u.ordPath, u.key, u.item);
        }
    }

    renameInObjectAggregation(u: ReplaceInObject) {
        _.filter(this.d0.udps.renameInObject, { id: u.id }).forEach(ut => {
            var i = this.isSubsetOrEqual(ut.ordPath.concat(ut.newKey), u.ordPath.concat(u.key));
            if(i === u.ordPath.length) {
                u.key = ut.key;
            } else if(i > -1) {
                u.ordPath[i] = ut.key;
            }
        });
    }
}

export = ReplaceInObjectComposition;
