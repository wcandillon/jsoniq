'use strict';

var _ = require('lodash');
var Args = require('../args');

var primitives = require('./primitives');

var InsertIntoObject = primitives.InsertIntoObject;
var InsertIntoArray = primitives.InsertIntoArray;
var DeleteFromObject = primitives.DeleteFromObject;
var DeleteFromArray = primitives.DeleteFromArray;
var ReplaceInArray = primitives.ReplaceInArray;
var ReplaceInObject = primitives.ReplaceInObject;
var RenameInObject = primitives.RenameInObject;

var PUL = function(){
    this.upds = {
        insertIntoObject : [],
        insertIntoArray  : [],
        deleteFromObject : [],
        replaceInObject  : [],
        deleteFromArray  : [],
        replaceInArray   : [],
        renameInObject   : []
    };
};

PUL.prototype.parse = function(pul){
    Args(arguments).check('String');
    var that = this;
    pul = JSON.parse(pul);
    pul.insertIntoObject.forEach(function(udp){
        that.insertIntoObject(udp.target, udp.pairs);
    });
    pul.insertIntoArray.forEach(function(udp){
        that.insertIntoArray(udp.target, udp.position, udp.items);
    });
    pul.deleteFromObject.forEach(function(udp){
        that.deleteFromObject(udp.target, udp.pairs);
    });
    pul.replaceInObject.forEach(function(udp){
        that.replaceInObject(udp.target, udp.pair, udp.value);
    });
    pul.deleteFromArray.forEach(function(udp){
        that.deleteFromArray(udp.target, udp.position);
    });
    pul.replaceInArray.forEach(function(udp){
        that.replaceInArray(udp.target, udp.position, udp.item);
    });
    pul.renameInObject.forEach(function(udp){
        that.renameInObject(udp.target, udp.pairName, udp.newPairName);
    });
};

PUL.prototype.serialize = function(){
    return JSON.stringify(this.upds);
};

/*
 * jupd:insert-into-object($o as object(), $p as object())
 * Inserts all pairs of the object $p into the object $o.
 */
PUL.prototype.insertIntoObject = function(target, pairs) {
    var newUpd = new InsertIntoObject(target, pairs);
    //Multiple UPs of this type with the same object target are merged into one UP with this target,
    //where the sources containing the pairs to insert are merged into one object.
    //An error jerr:JNUP0005 is raised if a collision occurs.
    var upd = _.find(this.upds.insertIntoObject, { target: target });
    if(upd) {
        upd.merge(newUpd);
    } else {
        this.upds.insertIntoObject.push(newUpd);
    }
    return this;
};

/*
 * jupd:insert-into-array($a as array(), $i as xs:integer, $c as item()*)
 * Inserts all items in the sequence $c before position $i into the array $a.
 */
PUL.prototype.insertIntoArray = function(target, position, items) {
    var newUpd = new InsertIntoArray(target, position, items);
    //Multiple UPs of this type with the same (array,index) target are merged into one UP with this target,
    //where the items are merged in an implementation-dependent order.
    //Several inserts on the same array and selector (position) are equivalent to a unique insert on that array and selector with the content of those original inserts appended in an implementation-dependent order.
    var upd = _.find(this.upds.insertIntoArray, { target: target, position: position });
    if(upd) {
        upd.merge(newUpd);
    } else {
        this.upds.insertIntoArray.push(newUpd);
    }
    return this;
};

/*
 * jupd:delete-from-object($o as object(), $s as xs:string*)
 * Removes the pairs the names of which appear in $s from the object $o.
 */
PUL.prototype.deleteFromObject = function(target, pairs){
    this.upds.deleteFromObject.push(new DeleteFromObject(target, pairs));
    //Multiple UPs of this type with the same object target are merged into one UP with this target,
    //where the selectors (names lists) are merged. Duplicate names are removed.
    return this;
};

/*
 * jupd:delete-from-array($a as array(), $i as xs:integer)
 * Removes the item at position $i from the array $a (causes all following items in the array to move one position to the left).
 */
PUL.prototype.deleteFromArray = function(target, position){
    this.upds.deleteFromArray.push(new DeleteFromArray(target, position));
    //Multiple UPs of this type with the same (array,index) target are merged into one UP with this target.
    return this;
};

/*
 * jupd:replace-in-array($a as array(), $i as xs:integer, $v as item())
 * Replaces the item at position $i in the array $a with the item $v (do nothing if $i is not comprised between 1 and jdm:size($a)).
 */
PUL.prototype.replaceInArray = function(target, position, item){
    var newPrimitive = new ReplaceInArray(target, position, item);
    this.upds.replaceInArray.forEach(function(primitive){
        primitive.validate(newPrimitive);
    });
    this.upds.replaceInArray.push(newPrimitive);
    //The presence of multiple UPs of this type with the same (array,index) target raises an error.
    //If there is a delete on the same (array,index) target, the replace is omitted.
    return this;
};

/*
 * jupd:replace-in-object($o as object(), $n as xs:string, $v as item())
 * Replaces the value of the pair named $n in the object $o with the item $v (do nothing if there is no such pair).
 */
PUL.prototype.replaceInObject = function(target, pair, value){
    var newPrimitive = new ReplaceInObject(target, pair, value);
    this.upds.replaceInObject.forEach(function(primitive){
        primitive.validate(newPrimitive);
    });
    this.upds.replaceInObject.push(newPrimitive);
    //The presence of multiple UPs of this type with the same (object,name) target raises an error.
    //If there is a delete on the same (object,name) target, the replace is omitted.
    return this;
};

/*
 * jupd:rename-in-object($o as object(), $n as xs:string, $p as xs:string)
 * Renames the pair originally named $n in the object $o as $p (do nothing if there is no such pair).
 */
PUL.prototype.renameInObject = function(target, pairName, newPairName){
    var newPrimitive = new RenameInObject(target, pairName, newPairName);
    this.upds.renameInObject.forEach(function(primitive){
        primitive.validate(newPrimitive);
    });
    this.upds.renameInObject.push(newPrimitive);
    //The presence of multiple UPs of this type with the same (object,name) target raises an error.
    //If there is a delete on the same (object,name) target, the rename is omitted.
    return this;
};

module.exports = PUL;
