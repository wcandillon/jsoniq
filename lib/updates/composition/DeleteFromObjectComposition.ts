/// <reference path="../../../typings/lodash/lodash.d.ts" />
import _ = require("lodash");

import Insert = require("../primitives/Insert");
import InsertIntoObject = require("../primitives/InsertIntoObject");
import ReplaceInObject = require("../primitives/ReplaceInObject");
import DeleteFromObject = require("../primitives/DeleteFromObject");
import PUL = require("../PUL");
import UPComposition = require("./UPComposition");

class DeleteFromObjectComposition extends UPComposition {

    constructor(d0: PUL) {
        super(d0);
    }

    compose(u: DeleteFromObject): DeleteFromObjectComposition {
        var target = this.findAggregationTarget(u);
        if(target instanceof Insert) {
            this.insertAggregation(<Insert> target, u);
        } else if(target instanceof InsertIntoObject) {
            this.insertIntoObjectAggregation(<InsertIntoObject> target, u);
        } else if(target instanceof ReplaceInObject) {
            this.replaceInObjectAggregation(<ReplaceInObject> target, u);
        } else {
            this.renameInObjectAggregation(this.d0, u);
            this.d0.deleteFromObject(u.id, u.ordPath, u.keys);
        }
        return this;
    }

    insertAggregation(ut: Insert, u: DeleteFromObject) {
        this.omit(this.find(ut.item, u.ordPath), u.keys);
    }

    insertIntoObjectAggregation(ut: InsertIntoObject, u: DeleteFromObject) {
        this.omit(ut.pairs, u.keys);
    }

    replaceInObjectAggregation(ut: ReplaceInObject, u: DeleteFromObject) {
        var i = this.isSubsetOrEqual(ut.ordPath, u.ordPath);
        if(i > -2) {
            this.omit(this.find(ut.item, u.ordPath.slice(i + 2)), u.keys);
        } else {
            //Accumulation
            this.d0.deleteFromObject(u.id, u.ordPath, u.keys);
        }
    }

    renameInObjectAggregation(pul: PUL, udp: DeleteFromObject) {
        _.filter(pul.udps.renameInObject, { id: udp.id }).forEach(ut => {
            udp.keys.forEach((key, index) => {
                var i = this.isSubsetOrEqual(ut.ordPath.concat(ut.newKey), udp.ordPath.concat(key));
                if(i === index) {
                    udp.keys[index] = ut.key;
                } else if(i > -1) {
                    udp.ordPath[i] = ut.key;
                }
            });
        });
    }
}

export = DeleteFromObjectComposition;
