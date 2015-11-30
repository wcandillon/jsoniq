/// <reference path="../../../typings/lodash/lodash.d.ts" />
import * as _ from "lodash";

import UpdatePrimitive from "../primitives/UpdatePrimitive";
import PUL from "../PUL";

export default class UPComposition {
    d0: PUL;

    constructor(d0: PUL) {
        this.d0 = d0;
    }

    compose(u: UpdatePrimitive): UPComposition {
        throw new Error("method is abstract");
    }

    findAggregationTarget(udp: UpdatePrimitive): UpdatePrimitive {
        var matchById = { id: udp.id };
        var matchByIdAndOrdPath = { id: udp.id, ordPath: udp.ordPath };
        var idx = _.findIndex(this.d0.udps.insert, matchById);
        if(idx > -1) {
            return this.d0.udps.insert[idx];
        }

        idx = _.findIndex(this.d0.udps.insertIntoObject, matchByIdAndOrdPath);
        if(idx > -1) {
            return this.d0.udps.insertIntoObject[idx];
        }

        idx = _.findIndex(this.d0.udps.replaceInObject, matchById);
        if(idx > -1) {
            return this.d0.udps.replaceInObject[idx];
        }

        return undefined;
    }

    find(item: any, ordPath: string[]): any {
        if(ordPath.length === 0) {
            return item;
        }
        return this.find(item[ordPath[0]], ordPath.slice(1));
    }

    omit(object: {}, keys: string[]): {} {
        keys.forEach(key => {
            delete object[key];
        });
        return object;
    }

    isSubsetOrEqual(ordpath1: string[], ordpath2: string[], index?: number): number {
        if(ordpath1.length > ordpath2.length) {
            return -2;
        }
        if(index === undefined) {
            index = 0;
        }
        if(ordpath1.length === 0) {
            return index - 1;
        }
        if(ordpath1[0] === ordpath2[index]) {
            return this.isSubsetOrEqual(ordpath1.slice(1), ordpath2, index + 1);
        }
        return -2;
    }

    renameInObjectAggregation(udp: UpdatePrimitive) {
        _.filter(this.d0.udps.renameInObject, { id: udp.id }).forEach(ut => {
            var i = this.isSubsetOrEqual(ut.ordPath.concat(ut.newKey), udp.ordPath);
            if(i > -1) {
                udp.ordPath[i] = ut.key;
            }
        });
    }
}
