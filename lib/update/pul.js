'use strict';

var _ = require('lodash');
var Args = require('../args');

var primitives = require('./primitives');
var jerr = require('../errors');

var InsertIntoObject = primitives.InsertIntoObject;
var InsertIntoArray = primitives.InsertIntoArray;
var DeleteFromObject = primitives.DeleteFromObject;
var DeleteFromArray = primitives.DeleteFromArray;
var ReplaceInArray = primitives.ReplaceInArray;
var ReplaceInObject = primitives.ReplaceInObject;
var RenameInObject = primitives.RenameInObject;

var PUL = function(){
    this.udps = {
        insertIntoObject : [],
        insertIntoArray  : [],
        deleteFromObject : [],
        replaceInObject  : [],
        deleteFromArray  : [],
        replaceInArray   : [],
        renameInObject   : []
    };
};

PUL.prototype.normalize = function(){
    var that = this;
    //If there is a delete on the same (array,index) target, the replace is omitted.
    this.udps.deleteFromArray.forEach(function(udp){
        _.remove(that.udps.replaceInArray, { target: udp.target, position: udp.position });
    });
    //If there is a delete on the same (object,name) target, the replace is omitted.
    //If there is a delete on the same (object,name) target, the rename is omitted.
    this.udps.deleteFromObject.forEach(function(udp){
        udp.pairs.forEach(function(pair){
            _.remove(that.udps.replaceInObject, { target: udp.target, pair: pair });
            _.remove(that.udps.renameInObject, { target: udp.target, key: pair });
        });
    });
    return this;
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
        that.renameInObject(udp.target, udp.key, udp.newKey);
    });
    return this;
};

PUL.prototype.serialize = function(){
    return JSON.stringify(this.udps);
};

/*
 * jupd:insert-into-object($o as object(), $p as object())
 * Inserts all pairs of the object $p into the object $o.
 */
PUL.prototype.insertIntoObject = function(target, pairs) {
    var newUdp = new InsertIntoObject(target, pairs);
    //Multiple UPs of this type with the same object target are merged into one UP with this target,
    //where the sources containing the pairs to insert are merged into one object.
    //An error jerr:JNUP0005 is raised if a collision occurs.
    var udp = _.find(this.udps.insertIntoObject, { target: target });
    if(udp) {
        udp.merge(newUdp);
    } else {
        this.udps.insertIntoObject.push(newUdp);
    }
    return this;
};

/*
 * jupd:insert-into-array($a as array(), $i as xs:integer, $c as item()*)
 * Inserts all items in the sequence $c before position $i into the array $a.
 */
PUL.prototype.insertIntoArray = function(target, position, items) {
    var newUdp = new InsertIntoArray(target, position, items);
    //Multiple UPs of this type with the same (array,index) target are merged into one UP with this target,
    //where the items are merged in an implementation-dependent order.
    //Several inserts on the same array and selector (position) are equivalent to a unique insert on that array and selector with the content of those original inserts appended in an implementation-dependent order.
    var udp = _.find(this.udps.insertIntoArray, { target: target, position: position });
    if(udp) {
        udp.merge(newUdp);
    } else {
        this.udps.insertIntoArray.push(newUdp);
    }
    return this;
};

/*
 * jupd:delete-from-object($o as object(), $s as xs:string*)
 * Removes the pairs the names of which appear in $s from the object $o.
 */
PUL.prototype.deleteFromObject = function(target, pairs){
    var newUdp = new DeleteFromObject(target, pairs);
    //Multiple UPs of this type with the same object target are merged into one UP with this target,
    //where the selectors (names lists) are merged. Duplicate names are removed.
    var udp = _.find(this.udps.deleteFromObject, { target: target });
    if(udp) {
        udp.merge(newUdp);
    } else {
        this.udps.deleteFromObject.push(newUdp);
    }
    return this;
};

/*
 * jupd:delete-from-array($a as array(), $i as xs:integer)
 * Removes the item at position $i from the array $a (causes all following items in the array to move one position to the left).
 */
PUL.prototype.deleteFromArray = function(target, position){
    var newUdp = new DeleteFromArray(target, position);
    //Multiple UPs of this type with the same (array,index) target are merged into one UP with this target.
    var udp = _.find(this.udps.deleteFromArray, { target: target, position: position });
    if(!udp) {
        this.udps.deleteFromArray.push(newUdp);
    }
    return this;
};

/*
 * jupd:replace-in-array($a as array(), $i as xs:integer, $v as item())
 * Replaces the item at position $i in the array $a with the item $v (do nothing if $i is not comprised between 1 and jdm:size($a)).
 */
PUL.prototype.replaceInArray = function(target, position, item){
    var newUdp = new ReplaceInArray(target, position, item);
    //The presence of multiple UPs of this type with the same (array,index) target raises an error.
    var udp = _.find(this.udps.replaceInArray, { target: target, position: position });
    if(udp) {
        throw new jerr.JNUP0009();
    } else {
        this.udps.replaceInArray.push(newUdp);
    }
    return this;
};

/*
 * jupd:replace-in-object($o as object(), $n as xs:string, $v as item())
 * Replaces the value of the pair named $n in the object $o with the item $v (do nothing if there is no such pair).
 */
PUL.prototype.replaceInObject = function(target, pair, value){
    var newUdp = new ReplaceInObject(target, pair, value);
    //The presence of multiple UPs of this type with the same (array,index) target raises an error.
    var udp = _.find(this.udps.replaceInObject, { target: target, pair: pair });
    if(udp) {
        throw new jerr.JNUP0009();
    } else {
        this.udps.replaceInObject.push(newUdp);
    }
    return this;
};

/*
 * jupd:rename-in-object($o as object(), $n as xs:string, $p as xs:string)
 * Renames the pair originally named $n in the object $o as $p (do nothing if there is no such pair).
 */
PUL.prototype.renameInObject = function(target, key, newKey){
    var newUdp = new RenameInObject(target, key, newKey);
    //The presence of multiple UPs of this type with the same (object,name) target raises an error.
    //If there is a delete on the same (object,name) target, the rename is omitted.
    var udp = _.find(this.udps.renameInObject, { target: target, key: key });
    if(udp) {
        throw new jerr.JNUP0009();
    } else {
        this.udps.renameInObject.push(newUdp);
    }
    return this;
};

module.exports = PUL;
