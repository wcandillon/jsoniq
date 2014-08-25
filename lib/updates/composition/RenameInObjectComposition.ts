/// <reference path="../../../definitions/lodash/lodash.d.ts" />
import _ = require("lodash");

import Insert = require("../primitives/Insert");
import InsertIntoObject = require("../primitives/InsertIntoObject");
import ReplaceInObject = require("../primitives/ReplaceInObject");
import RenameInObject = require("../primitives/RenameInObject");
import PUL = require("../PUL");
import UPComposition = require("./UPComposition");

class RenameInObjectComposition extends UPComposition {

    constructor(d0: PUL) {
        super(d0);
    }

    compose(u: RenameInObject): RenameInObjectComposition {
        var target = this.findAggregationTarget(u);
        if(target instanceof Insert) {
            this.insertAggregation(<Insert> target, u);
        } else if(target instanceof InsertIntoObject) {
            this.insertIntoObjectAggregation(<InsertIntoObject> target, u);
        } else if(target instanceof ReplaceInObject) {
            this.replaceInObjectAggregation(<ReplaceInObject> target, u);
        } else {
            this.renameInObjectAggregation(u);
            this.d0.renameInObject(u.id, u.ordPath, u.key, u.newKey);
        }
        return this;
    }

    insertAggregation(ut: Insert, u: RenameInObject) {
        var item = this.find(ut.item, u.ordPath);
        item[u.newKey] = item[u.key];
        this.omit(item, [u.key]);
    }

    insertIntoObjectAggregation(ut: InsertIntoObject, u: RenameInObject) {
        ut.pairs[u.newKey] = ut.pairs[u.key];
        this.omit(ut.pairs, [u.key]);
    }

    replaceInObjectAggregation(ut: ReplaceInObject, u: RenameInObject) {
        var i = this.isSubsetOrEqual(ut.ordPath, u.ordPath);
        if(i > -2) {
            var item = this.find(ut.item, u.ordPath.slice(i + 2));
            item[u.newKey] = item[u.key];
            this.omit(item, [u.key]);
        } else {
            //Accumulation
            this.d0.renameInObject(u.id, u.ordPath, u.key, u.newKey);
        }
    }

    renameInObjectAggregation(udp: RenameInObject) {
        _.filter(this.d0.udps.renameInObject, { id: udp.id }).forEach(ut => {
            var i = this.isSubsetOrEqual(ut.ordPath.concat(ut.newKey), udp.ordPath.concat(udp.key));
            if(i === udp.ordPath.length) {
                udp.key = ut.key;
            } else if(i > -1) {
                udp.ordPath[i] = ut.key;
            }
        });
    }
}

export = RenameInObjectComposition;
