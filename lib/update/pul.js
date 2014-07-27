'use strict';

//var _ = require('lodash');
var primitives = require('./primitives');

var InsertIntoObject = primitives.InsertIntoObject;
var InsertIntoArray = primitives.InsertIntoArray;
var DeleteFromObject = primitives.DeleteFromObject;
var DeleteFromArray = primitives.DeleteFromArray;
var ReplaceInArray = primitives.ReplaceInArray;
var ReplaceInObject = primitives.ReplaceInObject;
var RenameInObject = primitives.RenameInObject;

var insertIntoObject = [];
var insertIntoArray  = [];
var deleteFromObject = [];
var replaceInObject  = [];
var deleteFromArray  = [];
var replaceInArray   = [];
var renameInObject   = [];
    
var PUL = function(){};

PUL.prototype.parse = function(){
    
};

PUL.prototype.serialize = function(){
    
};

/*
 * jupd:insert-into-object($o as object(), $p as object())
 * Inserts all pairs of the object $p into the object $o.
 */
PUL.prototype.insertIntoObject = function(target, pairs){
    insertIntoObject.push(new InsertIntoObject(target, pairs));
    //Multiple UPs of this type with the same object target are merged into one UP with this target,
    //where the sources containing the pairs to insert are merged into one object.
    
    return this;
};

/*
 * jupd:insert-into-array($a as array(), $i as xs:integer, $c as item()*)
 * Inserts all items in the sequence $c before position $i into the array $a.
 */
PUL.prototype.insertIntoArray = function(target, position, items){
    insertIntoArray.push(new InsertIntoArray(target, position, items));
    //Multiple UPs of this type with the same (array,index) target are merged into one UP with this target,
    //where the items are merged in an implementation-dependent order.

    return this;
};

/*
 * jupd:delete-from-object($o as object(), $s as xs:string*)
 * Removes the pairs the names of which appear in $s from the object $o.
 */
PUL.prototype.deleteFromObject = function(target, pairs){
    deleteFromObject.push(new DeleteFromObject(target, pairs));
    //Multiple UPs of this type with the same object target are merged into one UP with this target,
    //where the selectors (names lists) are merged. Duplicate names are removed.
    return this;
};

/*
 * jupd:delete-from-array($a as array(), $i as xs:integer)
 * Removes the item at position $i from the array $a (causes all following items in the array to move one position to the left).
 */
PUL.prototype.deleteFromArray = function(target, position){
    deleteFromArray.push(new DeleteFromArray(target, position));
    //Multiple UPs of this type with the same (array,index) target are merged into one UP with this target.
    return this;
};

/*
 * jupd:replace-in-array($a as array(), $i as xs:integer, $v as item())
 * Replaces the item at position $i in the array $a with the item $v (do nothing if $i is not comprised between 1 and jdm:size($a)).
 */
PUL.prototype.replaceInArray = function(target, position, item){
    var newPrimitive = new ReplaceInArray(target, position, item);
    replaceInArray.forEach(function(primitive){
        primitive.validate(newPrimitive);
    });
    replaceInArray.push(newPrimitive);
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
    replaceInObject.forEach(function(primitive){
        primitive.validate(newPrimitive);
    });
    replaceInObject.push(newPrimitive);
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
    renameInObject.forEach(function(primitive){
        primitive.validate(newPrimitive);
    });
    renameInObject.push(newPrimitive);
    //The presence of multiple UPs of this type with the same (object,name) target raises an error.
    //If there is a delete on the same (object,name) target, the rename is omitted.
    return this;
};

module.exports = PUL;