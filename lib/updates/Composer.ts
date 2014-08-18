/// <reference path="../../typings/lodash/lodash.d.ts" />
import _ = require("lodash");

import PUL = require("./PUL");

class Composer {

     private static isSubsetOrEqual(ordpath1: string[], ordpath2: string[], index?: number): number {
        if(ordpath1.length > ordpath2.length) {
            return -1;
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
        return -1;
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

    static compose(d0: PUL, d1: PUL, copy: boolean = false): PUL {

        if(copy === true) {
            d0 = (new PUL()).parse(d0.serialize());
        }

        d0.normalize();
        d1.normalize();

        d1.udps.insert.forEach(udp => {
            var idx = _.findIndex(d0.udps.remove, { id: udp.id });
            if(idx > -1) {
                d0.udps.remove.splice(idx, 1);
            }
            d0.udps.insert.push(udp);
        });

        d1.udps.remove.forEach(udp => {
            var handler = function(udps, fn?: Function) {
                var idx = _.findIndex(udps, { id: udp.id });
                if(idx > -1) {
                    udps.splice(idx, 1);
                }
                if(fn) {
                    fn(idx, d0, udp);
                }
            };

            handler(d0.udps.insert, (idx, d0, udp) => { if(idx === -1 ) { d0.udps.remove.push(udp); } });
            handler(d0.udps.insertIntoArray);
            handler(d0.udps.insertIntoObject);
            handler(d0.udps.deleteFromArray);
            handler(d0.udps.deleteFromObject);
            handler(d0.udps.renameInObject);
            handler(d0.udps.replaceInObject);
            handler(d0.udps.replaceInArray);
        });

        d1.udps.insertIntoObject.forEach(udp => {
            var idx, item, ut;
            var matchById = { id: udp.id };
            if((idx = _.findIndex(d0.udps.insert, matchById)) > -1) {
                //Insert Aggregation
                //udp is applied on its target document in ut. udp is then discarded.
                ut = d0.udps.insert[idx];
                item = Composer.find(ut.item, udp.ordPath);
                _.merge(item, udp.pairs);
            } else if((idx = _.findIndex(d0.udps.insertIntoObject, { id: udp.id, ordPath: udp.ordPath })) > -1) {
                //InsertIntoObject Aggregation
                //u is applied on the JSON object in ut that contains u’s target. u is then discarded.
                _.merge(d0.udps.insertIntoObject[idx].pairs, udp.pairs);
            } else if((idx = _.findIndex(d0.udps.replaceInObject, matchById)) > -1) {
                //ReplaceInObject Aggregation
                //udp is applied on ut’s value. udp is then discarded
                ut = d0.udps.replaceInObject[idx];
                var i = Composer.isSubsetOrEqual(ut.ordPath, udp.ordPath);
                if(i > -1) {
                    item = Composer.find(ut.item, udp.ordPath.slice(i + 2));
                    _.merge(item, udp.pairs);
                } else {
                    d0.udps.insertIntoObject.push(udp);
                }
            } else {
                //RenameInObject Aggregation
                //The part of udp’s target URI that gets renamed by ut is reversed to its state before ut gets applied.
                //This information can be extracted from ut.
                //The modified udp is then appended to the composed PUL.
                _.filter(d0.udps.renameInObject, matchById).forEach((ut) => {
                    var i = Composer.isSubsetOrEqual(ut.ordPath, udp.ordPath);
                    if(i > -1) {
                        udp.ordPath[i + 1] = ut.key;
                    }
                });
                //Accumulation
                d0.udps.insertIntoObject.push(udp);
            }
        });

        d1.udps.deleteFromObject.forEach(udp => {
            var idx, item, ut;
            var matchById = { id: udp.id };
            if((idx = _.findIndex(d0.udps.insert, matchById)) > -1) {
                //Insert Aggregation
                //udp is applied on its target document in ut. udp is then discarded.
                ut = d0.udps.insert[idx];
                item = Composer.find(ut.item, udp.ordPath);
                Composer.omit(item, udp.keys);
            } else if((idx = _.findIndex(d0.udps.insertIntoObject, { id: udp.id, ordPath: udp.ordPath })) > -1) {
                //InsertIntoObject Aggregation
                //u is applied on the JSON object in ut that contains u’s target. u is then discarded.
                Composer.omit(d0.udps.insertIntoObject[idx].pairs, udp.keys);
            } else if((idx = _.findIndex(d0.udps.replaceInObject, matchById)) > -1) {
                //ReplaceInObject Aggregation
                //udp is applied on ut’s value. udp is then discarded
                ut = d0.udps.replaceInObject[idx];
                var i = Composer.isSubsetOrEqual(ut.ordPath, udp.ordPath);
                if(i > -1) {
                    item = Composer.find(ut.item, udp.ordPath.slice(i + 2));
                    Composer.omit(item, udp.keys);
                } else {
                    d0.deleteFromObject(udp.id, udp.ordPath, udp.keys);
                }
            } else {
                //RenameInObject Aggregation
                //The part of udp’s target URI that gets renamed by ut is reversed to its state before ut gets applied.
                //This information can be extracted from ut.
                //The modified udp is then appended to the composed PUL.
                _.filter(d0.udps.renameInObject, matchById).forEach((ut) => {
                    var i = Composer.isSubsetOrEqual(ut.ordPath, udp.ordPath);
                    if(i > -1) {
                        udp.ordPath[i + 1] = ut.key;
                    }
                });
                //Accumulation
                d0.deleteFromObject(udp.id, udp.ordPath, udp.keys);
            }
        });

        d1.udps.replaceInObject.forEach(udp => {
            var idx, item, ut;
            var matchById = { id: udp.id };
            if((idx = _.findIndex(d0.udps.insert, matchById)) > -1) {
                //Insert Aggregation
                //udp is applied on its target document in ut. udp is then discarded.
                ut = d0.udps.insert[idx];
                item = Composer.find(ut.item, udp.ordPath);
                item[udp.key] = udp.item;
            } else if((idx = _.findIndex(d0.udps.insertIntoObject, { id: udp.id, ordPath: udp.ordPath })) > -1) {
                //InsertIntoObject Aggregation
                //u is applied on the JSON object in ut that contains u’s target. u is then discarded.
                d0.udps.insertIntoObject[idx].pairs[udp.key] = udp.key;
            } else if((idx = _.findIndex(d0.udps.replaceInObject, matchById)) > -1) {
                //ReplaceInObject Aggregation
                //udp is applied on ut’s value. udp is then discarded
                ut = d0.udps.replaceInObject[idx];
                var i = Composer.isSubsetOrEqual(ut.ordPath, udp.ordPath);
                if(i > -1) {
                    item = Composer.find(ut.item, udp.ordPath.slice(i + 2));
                    item[udp.key] = item;
                } else {
                    d0.replaceInObject(udp.id, udp.ordPath, udp.key, udp.item);
                }
            } else {
                //RenameInObject Aggregation
                //The part of udp’s target URI that gets renamed by ut is reversed to its state before ut gets applied.
                //This information can be extracted from ut.
                //The modified udp is then appended to the composed PUL.
                _.filter(d0.udps.renameInObject, matchById).forEach((ut) => {
                    var i = Composer.isSubsetOrEqual(ut.ordPath, udp.ordPath);
                    if(i > -1) {
                        udp.ordPath[i + 1] = ut.key;
                    }
                });
                //Accumulation
                d0.replaceInObject(udp.id, udp.ordPath, udp.key, udp.item);
            }
        });

        d1.udps.renameInObject.forEach(udp => {
            var idx, item, ut;
            var matchById = { id: udp.id };
            if((idx = _.findIndex(d0.udps.insert, matchById)) > -1) {
                //Insert Aggregation
                //udp is applied on its target document in ut. udp is then discarded.
                ut = d0.udps.insert[idx];
                item = Composer.find(ut.item, udp.ordPath);
                item[udp.newKey] = item[udp.key];
                Composer.omit(item, [udp.key]);
            } else if((idx = _.findIndex(d0.udps.insertIntoObject, { id: udp.id, ordPath: udp.ordPath })) > -1) {
                //InsertIntoObject Aggregation
                //u is applied on the JSON object in ut that contains u’s target. u is then discarded.
                d0.udps.insertIntoObject[idx].pairs[udp.newKey] = d0.udps.insertIntoObject[idx].pairs[udp.key];
                Composer.omit(d0.udps.insertIntoObject[idx].pairs, [udp.key]);
            } else if((idx = _.findIndex(d0.udps.replaceInObject, matchById)) > -1) {
                //ReplaceInObject Aggregation
                //udp is applied on ut’s value. udp is then discarded
                ut = d0.udps.replaceInObject[idx];
                var i = Composer.isSubsetOrEqual(ut.ordPath, udp.ordPath);
                if(i > -1) {
                    item = Composer.find(ut.item, udp.ordPath.slice(i + 2));
                    item[udp.newKey] = item;
                    Composer.omit(item, [udp.key]);
                } else {
                    d0.renameInObject(udp.id, udp.ordPath, udp.key, udp.newKey);
                }
            } else {
                //RenameInObject Aggregation
                //The part of udp’s target URI that gets renamed by ut is reversed to its state before ut gets applied.
                //This information can be extracted from ut.
                //The modified udp is then appended to the composed PUL.
                _.filter(d0.udps.renameInObject, matchById).forEach((ut) => {
                    var i = Composer.isSubsetOrEqual(ut.ordPath, udp.ordPath);
                    if(i > -1) {
                        udp.ordPath[i + 1] = ut.key;
                    }
                });
                //Accumulation
                d0.renameInObject(udp.id, udp.ordPath, udp.key, udp.newKey);
            }
        });

        //return d0.normalize();
        return d0;
    }
}

export = Composer;
