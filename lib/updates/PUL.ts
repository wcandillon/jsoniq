/// <reference path="../../typings/lodash/lodash.d.ts" />
import _ = require("lodash");

import jerr = require("../errors");
import Transaction = require("../stores/Transaction");

import UpdatePrimitive  = require("./primitives/UpdatePrimitive");
import InsertIntoObject = require("./primitives/InsertIntoObject");
import InsertIntoArray  = require("./primitives/InsertIntoArray");
import DeleteFromObject = require("./primitives/DeleteFromObject");
import DeleteFromArray  = require("./primitives/DeleteFromArray");
import ReplaceInObject  = require("./primitives/ReplaceInObject");
import ReplaceInArray   = require("./primitives/ReplaceInArray");
import RenameInObject   = require("./primitives/RenameInObject");

import UpdatePrimitives   = require("./UpdatePrimitives");

class PUL {

    udps = new UpdatePrimitives();

    parse(pul: string): PUL {
        var newPul:PUL = JSON.parse(pul);
        this.udps.parse(newPul.udps);
        return this;
    }

    serialize(): string {
        return JSON.stringify(this);
    }

    apply(transaction: Transaction): PUL {
        //Normalize PUL
        this.normalize();

        var apply = (udp: UpdatePrimitive) => {
            var id = udp.id;
            var item = transaction.get(id);
            udp.apply(transaction);
            transaction.put(id, item);
        };

        //Apply updates
        //1. jupd:replace-in-object
        _.forEach(this.udps.replaceInObject, apply);

        //2. jupd:delete-from-object
        _.forEach(this.udps.deleteFromObject, apply);

        //3. jupd:rename-in-object
        _.forEach(this.udps.renameInObject, apply);

        //4. jupd:insert-into-object
        _.forEach(this.udps.insertIntoObject, apply);

        //The array update primitives, furthermore, are applied right-to-left with re- gard to their index.
        //This obviates the problem of indexes being shifted and/or becoming invalid due to deletions or insertions.
        //TODO: test
        //5. jupd:replace-in-array
        _.sortBy(this.udps.replaceInArray, "position");
        _.forEach(this.udps.replaceInArray, apply);

        //6. jupd:delete-from-array
        _.sortBy(this.udps.deleteFromArray, "position");
        _.forEach(this.udps.deleteFromArray, apply);

        //7. jupd:insert-into-array
        _.sortBy(this.udps.insertIntoArray, "position");
        _.forEach(this.udps.insertIntoArray, apply);

        return this;
    }

    normalize(): PUL {
        //TODO: remove in lambda
        var that = this;
        //If there is a delete on the same (array,index) target, the replace is omitted.
        _.forEach(this.udps.deleteFromArray, function(udp: DeleteFromArray) {
            <ReplaceInArray[]>_.remove(that.udps.replaceInArray, { id: udp.id, ordPath: udp.ordPath, position: udp.position });
        });
        //If there is a delete on the same (object,name) target, the replace is omitted.
        //If there is a delete on the same (object,name) target, the rename is omitted.
        _.forEach(this.udps.deleteFromObject, function(udp: DeleteFromObject) {
            _.forEach(udp.keys, function(key: string) {
                <ReplaceInObject[]>_.remove(that.udps.replaceInObject, { id: udp.id, ordPath: udp.ordPath, key: key });
                <RenameInObject[]>_.remove(that.udps.renameInObject, { id: udp.id, ordPath: udp.ordPath, key: key });
            });
        });
        return this;
    }

    /*
     * jupd:insert-into-object($o as object(), $p as object())
     * Inserts all pairs of the object $p into the object $o.
     */
    insertIntoObject(id: string, ordPath: string[], pairs: {}): PUL {
        var newUdp = new InsertIntoObject(id, ordPath, pairs);
        //Multiple UPs of this type with the same object target are merged into one UP with this target,
        //where the sources containing the pairs to insert are merged into one object.
        //An error jerr:JNUP0005 is raised if a collision occurs.
        var udp = _.find(this.udps.insertIntoObject, { id: id, ordPath: ordPath });
        if(udp) {
            udp.merge(newUdp);
        } else {
            this.udps.insertIntoObject.push(newUdp);
        }
        return this;
    }

    /*
     * jupd:insert-into-array($a as array(), $i as xs:integer, $c as item()*)
     * Inserts all items in the sequence $c before position $i into the array $a.
     */
    insertIntoArray(id: string, ordPath: string[], position: number, items: any[]): PUL {
        var newUdp = new InsertIntoArray(id, ordPath, position, items);
        //Multiple UPs of this type with the same (array,index) target are merged into one UP with this target,
        //where the items are merged in an implementation-dependent order.
        //Several inserts on the same array and selector (position) are equivalent to a unique insert on that array and selector with the content of those original inserts appended in an implementation-dependent order.
        var udp = _.find(this.udps.insertIntoArray, { id: id, ordPath: ordPath, position: position });
        if(udp) {
            udp.merge(newUdp);
        } else {
            this.udps.insertIntoArray.push(newUdp);
        }
        return this;
    }

    /*
     * jupd:delete-from-object($o as object(), $s as xs:string*)
     * Removes the pairs the names of which appear in $s from the object $o.
     */
    deleteFromObject(id: string, ordPath: string[], keys: Array<string>): PUL {
        var newUdp = new DeleteFromObject(id, ordPath, keys);
        //Multiple UPs of this type with the same object target are merged into one UP with this target,
        //where the selectors (names lists) are merged. Duplicate names are removed.
        var udp = _.find(this.udps.deleteFromObject, { id: id, ordPath: ordPath });
        if(udp) {
            udp.merge(newUdp);
        } else {
            this.udps.deleteFromObject.push(newUdp);
        }
        return this;
    }

    /*
     * jupd:delete-from-array($a as array(), $i as xs:integer)
     * Removes the item at position $i from the array $a (causes all following items in the array to move one position to the left).
     */
    deleteFromArray(id: string, ordPath: string[], position: number): PUL {
        var newUdp = new DeleteFromArray(id, ordPath, position);
        //Multiple UPs of this type with the same (array,index) target are merged into one UP with this target.
        var udp = _.find(this.udps.deleteFromArray, { id: id, ordPath: ordPath, position: position });
        if(!udp) {
            this.udps.deleteFromArray.push(newUdp);
        }
        return this;
    }

    /*
     * jupd:replace-in-array($a as array(), $i as xs:integer, $v as item())
     * Replaces the item at position $i in the array $a with the item $v (do nothing if $i is not comprised between 1 and jdm:size($a)).
     */
    replaceInArray(id: string, ordPath: string[], position: number, item: any): PUL {
        var newUdp = new ReplaceInArray(id, ordPath, position, item);
        //The presence of multiple UPs of this type with the same (array,index) target raises an error.
        var udp = _.find(this.udps.replaceInArray, { id: id, ordPath: ordPath, position: position });
        if(udp) {
            throw new jerr.JNUP0009();
        } else {
            this.udps.replaceInArray.push(newUdp);
        }
        return this;
    }

    /*
     * jupd:replace-in-object($o as object(), $n as xs:string, $v as item())
     * Replaces the value of the pair named $n in the object $o with the item $v (do nothing if there is no such pair).
     */
    replaceInObject(id: string, ordPath: string[], key: string, item: any): PUL {
        var newUdp = new ReplaceInObject(id, ordPath, key, item);
        //The presence of multiple UPs of this type with the same (array,index) target raises an error.
        var udp = _.find(this.udps.replaceInObject, { id: id, ordPath: ordPath, key: key });
        if(udp) {
            throw new jerr.JNUP0009();
        } else {
            this.udps.replaceInObject.push(newUdp);
        }
        return this;
    }

    /*
     * jupd:rename-in-object($o as object(), $n as xs:string, $p as xs:string)
     * Renames the pair originally named $n in the object $o as $p (do nothing if there is no such pair).
     */
    renameInObject(id: string, ordPath: string[], key: string, newKey: string): PUL {
        var newUdp = new RenameInObject(id, ordPath, key, newKey);
        //The presence of multiple UPs of this type with the same (object,name) target raises an error.
        //If there is a delete on the same (object,name) target, the rename is omitted.
        var udp = _.find(this.udps.renameInObject, { id: id, ordPath: ordPath, key: key });
        if(udp) {
            throw new jerr.JNUP0009();
        } else {
            this.udps.renameInObject.push(newUdp);
        }
        return this;
    }
}

export = PUL;
