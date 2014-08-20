/// <reference path="../../typings/lodash/lodash.d.ts" />
import _ = require("lodash");

import UpdatePrimitive  = require("./primitives/UpdatePrimitive");
import InsertIntoObject = require("./primitives/InsertIntoObject");
//import InsertIntoArray  = require("./primitives/InsertIntoArray");
import DeleteFromObject = require("./primitives/DeleteFromObject");
//import DeleteFromArray  = require("./primitives/DeleteFromArray");
import ReplaceInObject  = require("./primitives/ReplaceInObject");
//import ReplaceInArray   = require("./primitives/ReplaceInArray");
//import RenameInObject   = require("./primitives/RenameInObject");
import Insert           = require("./primitives/Insert");
import Remove           = require("./primitives/Remove");
import PUL = require("./PUL");

class Composer {

     private static isSubsetOrEqual(ordpath1: string[], ordpath2: string[], index?: number): number {
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
            return Composer.isSubsetOrEqual(ordpath1.slice(1), ordpath2, index + 1);
        }
        return -2;
    }

    private static omit(object: {}, keys: string[]): {} {
        keys.forEach(key => {
            delete object[key];
        });
        return object;
    }

    private static find(item: any, ordPath: string[]): any {
        if(ordPath.length === 0) {
            return item;
        }
        return Composer.find(item[ordPath[0]], ordPath.slice(1));
    }

    private static insertAcc(d0: PUL, udp: Insert) {
        var idx = _.findIndex(d0.udps.remove, { id: udp.id });
        if(idx > -1) {
            d0.udps.remove.splice(idx, 1);
        }
        d0.insert(udp.id, udp.item);
    }

    private static removeAcc(d0: PUL, udp: Remove) {
        var idx = _.findIndex(d0.udps.insert, { id: udp.id });
        if(idx > -1) {
            d0.udps.insert.splice(idx, 1);
            var handler = function(udps) {
                var idx = _.findIndex(udps, { id: udp.id });
                if(idx > -1) {
                    udps.splice(idx, 1);
                }
            };
            handler(d0.udps.insertIntoArray);
            handler(d0.udps.insertIntoObject);
            handler(d0.udps.deleteFromArray);
            handler(d0.udps.deleteFromObject);
            handler(d0.udps.renameInObject);
            handler(d0.udps.replaceInObject);
            handler(d0.udps.replaceInArray);
        } else {
            d0.remove(udp.id);
        }
    }

    private static findAggregationTarget(d0: PUL, udp: UpdatePrimitive): UpdatePrimitive {
        var matchById = { id: udp.id };
        var matchByIdAndOrdPath = { id: udp.id, ordPath: udp.ordPath };
        var idx = _.findIndex(d0.udps.insert, matchById);
        if(idx > -1) {
            return d0.udps.insert[idx];
        }

        idx = _.findIndex(d0.udps.insertIntoObject, matchByIdAndOrdPath);
        if(idx > -1) {
            return d0.udps.insertIntoObject[idx];
        }

        idx = _.findIndex(d0.udps.replaceInObject, matchById);
        if(idx > -1) {
            return d0.udps.replaceInObject[idx];
        }

        return undefined;
    }

    //RenameInObject Aggregation
    //The part of udp’s target URI that gets renamed by ut is reversed to its state before ut gets applied.
    //This information can be extracted from ut.
    //The modified udp is then appended to the composed PUL.
    private static renameInObjectAggregation(pul: PUL, udp: UpdatePrimitive) {
        _.filter(pul.udps.renameInObject, { id: udp.id }).forEach(ut => {
            var i = Composer.isSubsetOrEqual(ut.ordPath.concat(ut.newKey), udp.ordPath);
            if(i > -1) {
                udp.ordPath[i] = ut.key;
            }
        });
    }

    private static renameInObjectAggregationForDeleteFromObject(pul: PUL, udp: DeleteFromObject) {
        _.filter(pul.udps.renameInObject, { id: udp.id }).forEach(ut => {
            udp.keys.forEach((key, index) => {
                var i = Composer.isSubsetOrEqual(ut.ordPath.concat(ut.newKey), udp.ordPath.concat(key));
                if(i === index) {
                    udp.keys[index] = ut.key;
                } else if(i > -1) {
                    udp.ordPath[i] = ut.key;
                }
            });
        });
    }

    static compose(d0: PUL, d1: PUL, copy: boolean = false): PUL {

        if(copy === true) {
            d0 = (new PUL()).parse(d0.serialize());
            d1 = (new PUL()).parse(d1.serialize());
        }

        d0.normalize();
        d1.normalize();

        d1.udps.insert.forEach(udp => {
            Composer.insertAcc(d0, udp);
        });

        d1.udps.remove.forEach(udp => {
            Composer.removeAcc(d0, udp);
        });

        d1.udps.insertIntoObject.forEach(udp => {
            var ut = Composer.findAggregationTarget(d0, udp);
            if(ut instanceof Insert) {
                //Insert Aggregation
                //udp is applied on its target document in ut. udp is then discarded.
                _.merge(Composer.find((<Insert> ut).item, udp.ordPath), udp.pairs);
            } else if(ut instanceof InsertIntoObject) {
                //InsertIntoObject Aggregation
                //u is applied on the JSON object in ut that contains u’s target. u is then discarded.
                _.merge((<InsertIntoObject> ut).pairs, udp.pairs);
            } else if(ut instanceof ReplaceInObject) {
                //ReplaceInObject Aggregation
                //udp is applied on ut’s value. udp is then discarded
                var i = Composer.isSubsetOrEqual(ut.ordPath, udp.ordPath);
                if(i > -2) {
                    _.merge(Composer.find((<ReplaceInObject> ut).item, udp.ordPath.slice(i + 2)), udp.pairs);
                } else {
                    //Accumulation
                    d0.insertIntoObject(udp.id, udp.ordPath, udp.pairs);
                }
            } else {
                Composer.renameInObjectAggregation(d0, udp);
                //Accumulation
                d0.insertIntoObject(udp.id, udp.ordPath, udp.pairs);
            }
        });

        d1.udps.deleteFromObject.forEach(udp => {
            var ut = Composer.findAggregationTarget(d0, udp);
            if(ut instanceof Insert) {
                Composer.omit(Composer.find((<Insert> ut).item, udp.ordPath), udp.keys);
            } else if(ut instanceof InsertIntoObject) {
                Composer.omit((<InsertIntoObject> ut).pairs, udp.keys);
            } else if(ut instanceof ReplaceInObject) {
                var i = Composer.isSubsetOrEqual(ut.ordPath, udp.ordPath);
                if(i > -2) {
                    Composer.omit(Composer.find((<ReplaceInObject> ut).item, udp.ordPath.slice(i + 2)), udp.keys);
                } else {
                    d0.deleteFromObject(udp.id, udp.ordPath, udp.keys);
                }
            } else {
                Composer.renameInObjectAggregationForDeleteFromObject(d0, udp);
                d0.deleteFromObject(udp.id, udp.ordPath, udp.keys);
            }
        });

        d1.udps.replaceInObject.forEach(udp => {
            var item;
            var ut = Composer.findAggregationTarget(d0, udp);
            if(ut instanceof Insert) {
                item = Composer.find((<Insert> ut).item, udp.ordPath);
                item[udp.key] = udp.item;
            } else if(ut instanceof InsertIntoObject) {
                (<InsertIntoObject> ut).pairs[udp.key] = udp.item;
            } else if(ut instanceof ReplaceInObject) {
                var i = Composer.isSubsetOrEqual(ut.ordPath, udp.ordPath);
                if(i > -2) {
                    item = Composer.find((<ReplaceInObject> ut).item, udp.ordPath.slice(i + 2));
                    item[udp.key] = item;
                } else {
                    d0.replaceInObject(udp.id, udp.ordPath, udp.key, udp.item);
                }
            } else {
                Composer.renameInObjectAggregation(d0, udp);
                d0.replaceInObject(udp.id, udp.ordPath, udp.key, udp.item);
            }
        });

        d1.udps.renameInObject.forEach(udp => {
            var item;
            var ut = Composer.findAggregationTarget(d0, udp);
            if(ut instanceof Insert) {
                item = Composer.find((<Insert> ut).item, udp.ordPath);
                item[udp.newKey] = item[udp.key];
                Composer.omit(item, [udp.key]);
            } else if(ut instanceof InsertIntoObject) {
                (<InsertIntoObject> ut).pairs[udp.newKey] = (<InsertIntoObject> ut).pairs[udp.key];
                Composer.omit((<InsertIntoObject> ut).pairs, [udp.key]);
            } else if(ut instanceof ReplaceInObject) {
                var i = Composer.isSubsetOrEqual(ut.ordPath, udp.ordPath);
                if(i > -2) {
                    item = Composer.find((<ReplaceInObject> ut).item, udp.ordPath.slice(i + 2));
                    item[udp.newKey] = item;
                    Composer.omit(item, [udp.key]);
                } else {
                    d0.renameInObject(udp.id, udp.ordPath, udp.key, udp.newKey);
                }
            } else {
                Composer.renameInObjectAggregation(d0, udp);
                d0.renameInObject(udp.id, udp.ordPath, udp.key, udp.newKey);
            }
        });

        return d0.normalize();
    }
}

export = Composer;
