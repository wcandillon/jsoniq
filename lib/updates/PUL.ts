/// <reference path="../../typings/lodash/lodash.d.ts" />
import _ = require("lodash");

import jerr = require("../errors");
import Store = require("../stores/Store");

import InsertIntoObject = require("./primitives/InsertIntoObject");
import InsertIntoArray  = require("./primitives/InsertIntoArray");
import DeleteFromObject = require("./primitives/DeleteFromObject");
import DeleteFromArray  = require("./primitives/DeleteFromArray");
import ReplaceInObject  = require("./primitives/ReplaceInObject");
import ReplaceInArray   = require("./primitives/ReplaceInArray");
import RenameInObject   = require("./primitives/RenameInObject");

class PUL {
    insertIntoObjectList : InsertIntoObject[] = [];
    insertIntoArrayList  : InsertIntoArray[]  = [];
    deleteFromObjectList : DeleteFromObject[] = [];
    deleteFromArrayList  : DeleteFromArray[]  = [];
    replaceInObjectList  : ReplaceInObject[]  = [];
    replaceInArrayList   : ReplaceInArray[]   = [];
    renameInObjectList   : RenameInObject[]   = [];

    parse(pul: string): PUL {
        var that = this;
        var newPul:PUL = JSON.parse(pul);
        newPul.insertIntoObjectList.forEach(function(udp) {
            that.insertIntoObject(udp.target, udp.pairs);
        });
        newPul.insertIntoArrayList.forEach(function(udp) {
            that.insertIntoArray(udp.target, udp.position, udp.items);
        });
        newPul.deleteFromObjectList.forEach(function(udp) {
            that.deleteFromObject(udp.target, udp.keys);
        });
        newPul.replaceInObjectList.forEach(function(udp) {
            that.replaceInObject(udp.target, udp.key, udp.item);
        });
        newPul.deleteFromArrayList.forEach(function(udp) {
            that.deleteFromArray(udp.target, udp.position);
        });
        newPul.replaceInArrayList.forEach(function(udp) {
            that.replaceInArray(udp.target, udp.position, udp.item);
        });
        newPul.renameInObjectList.forEach(function(udp) {
            that.renameInObject(udp.target, udp.key, udp.newKey);
        });
        return this;
    }

    serialize(): string {
        return JSON.stringify(this);
    }

    apply(store: Store): PUL {
        //Normalize PUL
        this.normalize();

        //Apply updates
        //1. jupd:replace-in-object
        _.forEach(this.replaceInObjectList, (udp: ReplaceInObject) => {
            udp.apply(store);
        });

        //2. jupd:delete-from-object
        _.forEach(this.deleteFromObjectList, (udp: DeleteFromObject) => {
            udp.apply(store);
        });

        //3. jupd:rename-in-object
        _.forEach(this.renameInObjectList, (udp: RenameInObject) => {
            udp.apply(store);
        });

        //4. jupd:insert-into-object
        _.forEach(this.insertIntoObjectList, (udp: InsertIntoObject) => {
            udp.apply(store);
        });

        //The array update primitives, furthermore, are applied right-to-left with re- gard to their index.
        //This obviates the problem of indexes being shifted and/or becoming invalid due to deletions or insertions.
        //5. jupd:replace-in-array
        _.sortBy(this.replaceInArrayList, "position");
        _.forEach(this.replaceInArrayList, (udp: ReplaceInArray) => {
            udp.apply(store);
        });

        //6. jupd:delete-from-array
        _.sortBy(this.deleteFromArrayList, "position");
        _.forEach(this.deleteFromArrayList, (udp: DeleteFromArray) => {
            udp.apply(store);
        });

        //7. jupd:insert-into-array
        _.sortBy(this.insertIntoArrayList, "position");
        _.forEach(this.insertIntoArrayList, (udp: InsertIntoArray) => {
            udp.apply(store);
        });

        return this;
    }

    normalize(): PUL {
        var that = this;
        //If there is a delete on the same (array,index) target, the replace is omitted.
        _.forEach(this.deleteFromArrayList, function(udp: DeleteFromArray) {
            <ReplaceInArray[]>_.remove(that.replaceInArrayList, { target: udp.target, position: udp.position });
        });
        //If there is a delete on the same (object,name) target, the replace is omitted.
        //If there is a delete on the same (object,name) target, the rename is omitted.
        _.forEach(this.deleteFromObjectList, function(udp: DeleteFromObject) {
            _.forEach(udp.keys, function(key: string) {
                <ReplaceInObject[]>_.remove(that.replaceInObjectList, { target: udp.target, key: key });
                <RenameInObject[]>_.remove(that.renameInObjectList, { target: udp.target, key: key });
            });
        });
        return this;
    }

    /*
     * jupd:insert-into-object($o as object(), $p as object())
     * Inserts all pairs of the object $p into the object $o.
     */
    insertIntoObject(target: string, pairs: {}): PUL {
        var newUdp = new InsertIntoObject(target, pairs);
        //Multiple UPs of this type with the same object target are merged into one UP with this target,
        //where the sources containing the pairs to insert are merged into one object.
        //An error jerr:JNUP0005 is raised if a collision occurs.
        var udp = _.find(this.insertIntoObjectList, { target: target });
        if(udp) {
            udp.merge(newUdp);
        } else {
            this.insertIntoObjectList.push(newUdp);
        }
        return this;
    }

    /*
     * jupd:insert-into-array($a as array(), $i as xs:integer, $c as item()*)
     * Inserts all items in the sequence $c before position $i into the array $a.
     */
    insertIntoArray(target: string, position: number, items: any[]): PUL {
        var newUdp = new InsertIntoArray(target, position, items);
        //Multiple UPs of this type with the same (array,index) target are merged into one UP with this target,
        //where the items are merged in an implementation-dependent order.
        //Several inserts on the same array and selector (position) are equivalent to a unique insert on that array and selector with the content of those original inserts appended in an implementation-dependent order.
        var udp = _.find(this.insertIntoArrayList, { target: target, position: position });
        if(udp) {
            udp.merge(newUdp);
        } else {
            this.insertIntoArrayList.push(newUdp);
        }
        return this;
    }

    /*
     * jupd:delete-from-object($o as object(), $s as xs:string*)
     * Removes the pairs the names of which appear in $s from the object $o.
     */
    deleteFromObject(target: string, keys: Array<string>): PUL {
        var newUdp = new DeleteFromObject(target, keys);
        //Multiple UPs of this type with the same object target are merged into one UP with this target,
        //where the selectors (names lists) are merged. Duplicate names are removed.
        var udp = _.find(this.deleteFromObjectList, { target: target });
        if(udp) {
            udp.merge(newUdp);
        } else {
            this.deleteFromObjectList.push(newUdp);
        }
        return this;
    }

    /*
     * jupd:delete-from-array($a as array(), $i as xs:integer)
     * Removes the item at position $i from the array $a (causes all following items in the array to move one position to the left).
     */
    deleteFromArray(target: string, position: number): PUL {
        var newUdp = new DeleteFromArray(target, position);
        //Multiple UPs of this type with the same (array,index) target are merged into one UP with this target.
        var udp = _.find(this.deleteFromArrayList, { target: target, position: position });
        if(!udp) {
            this.deleteFromArrayList.push(newUdp);
        }
        return this;
    }

    /*
     * jupd:replace-in-array($a as array(), $i as xs:integer, $v as item())
     * Replaces the item at position $i in the array $a with the item $v (do nothing if $i is not comprised between 1 and jdm:size($a)).
     */
    replaceInArray(target: string, position: number, item: any): PUL {
        var newUdp = new ReplaceInArray(target, position, item);
        //The presence of multiple UPs of this type with the same (array,index) target raises an error.
        var udp = _.find(this.replaceInArrayList, { target: target, position: position });
        if(udp) {
            throw new jerr.JNUP0009();
        } else {
            this.replaceInArrayList.push(newUdp);
        }
        return this;
    }

    /*
     * jupd:replace-in-object($o as object(), $n as xs:string, $v as item())
     * Replaces the value of the pair named $n in the object $o with the item $v (do nothing if there is no such pair).
     */
    replaceInObject(target: string, key: string, item: any): PUL {
        var newUdp = new ReplaceInObject(target, key, item);
        //The presence of multiple UPs of this type with the same (array,index) target raises an error.
        var udp = _.find(this.replaceInObjectList, { target: target, key: key });
        if(udp) {
            throw new jerr.JNUP0009();
        } else {
            this.replaceInObjectList.push(newUdp);
        }
        return this;
    }

    /*
     * jupd:rename-in-object($o as object(), $n as xs:string, $p as xs:string)
     * Renames the pair originally named $n in the object $o as $p (do nothing if there is no such pair).
     */
    renameInObject(target: string, key: string, newKey: string): PUL {
        var newUdp = new RenameInObject(target, key, newKey);
        //The presence of multiple UPs of this type with the same (object,name) target raises an error.
        //If there is a delete on the same (object,name) target, the rename is omitted.
        var udp = _.find(this.renameInObjectList, { target: target, key: key });
        if(udp) {
            throw new jerr.JNUP0009();
        } else {
            this.renameInObjectList.push(newUdp);
        }
        return this;
    }
}

export = PUL;
