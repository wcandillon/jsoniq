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

/*
 * jupd:insert-into-object($o as object(), $p as object())
 * Inserts all pairs of the object $p into the object $o.
 */
PUL.prototype.insertIntoObject = function(target, pairs){
    insertIntoObject.push(new InsertIntoObject(target, pairs));
    return this;
};

/*
 * jupd:insert-into-array($a as array(), $i as xs:integer, $c as item()*)
 * Inserts all items in the sequence $c before position $i into the array $a.
 */
PUL.prototype.insertIntoArray = function(target, position, items){
    insertIntoArray.push(new InsertIntoArray(target, position, items));
    return this;
};

/*
 * jupd:delete-from-object($o as object(), $s as xs:string*)
 * Removes the pairs the names of which appear in $s from the object $o.
 */
PUL.prototype.deleteFromObject = function(target, pairs){
    deleteFromObject.push(new DeleteFromObject(target, pairs));
    return this;
};

/*
 * jupd:delete-from-array($a as array(), $i as xs:integer)
 * Removes the item at position $i from the array $a (causes all following items in the array to move one position to the left).
 */
PUL.prototype.deleteFromArray = function(target, position){
    deleteFromArray.push(new DeleteFromArray(target, position));
    return this;
};

/*
 * jupd:replace-in-array($a as array(), $i as xs:integer, $v as item())
 * Replaces the item at position $i in the array $a with the item $v (do nothing if $i is not comprised between 1 and jdm:size($a)).
 */
PUL.prototype.replaceInArray = function(target, position, item){
    replaceInArray.push(new ReplaceInArray(target, position, item));
    return this;
};

/*
 * jupd:replace-in-object($o as object(), $n as xs:string, $v as item())
 * Replaces the value of the pair named $n in the object $o with the item $v (do nothing if there is no such pair).
 */
PUL.prototype.replaceInObject = function(target, pair, value){
    replaceInObject.push(new ReplaceInObject(target, pair, value));
    return this;
};

/*
 * jupd:rename-in-object($o as object(), $n as xs:string, $p as xs:string)
 * Renames the pair originally named $n in the object $o as $p (do nothing if there is no such pair).
 */
PUL.prototype.renameInObject = function(target, pairName, newPairName){
    renameInObject.push(new RenameInObject(target, pairName, newPairName));
    return this;
};

module.exports = PUL;