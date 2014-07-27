'use strict';

var _ = require('lodash');
var Args = require('../args');

function UpdatePrimitive(target){
    this.target = target;
}

/*
 * jupd:insert-into-object($o as object(), $p as object())
 * Inserts all pairs of the object $p into the object $o.
 */
function InsertIntoObject(target, pairs){
    Args(arguments).check('Object', 'Object');
    UpdatePrimitive.call(this, target);
    this.pairs = pairs;
}
InsertIntoObject.prototype = _.create(UpdatePrimitive.prototype);
module.exports.InsertIntoObject = InsertIntoObject;

/*
 * jupd:insert-into-array($a as array(), $i as xs:integer, $c as item()*)
 * Inserts all items in the sequence $c before position $i into the array $a.
 */
function InsertIntoArray(target, position, items){
    Args(arguments).check('Object', 'Number', 'Array');
    UpdatePrimitive.call(this, target);
    this.position = position;
    this.items = items;
}
InsertIntoArray.prototype = _.create(UpdatePrimitive.prototype);
module.exports.InsertIntoArray = InsertIntoArray;

/*
 * jupd:delete-from-object($o as object(), $s as xs:string*)
 * Removes the pairs the names of which appear in $s from the object $o.
 */
function DeleteFromObject(target, pairs){
    Args(arguments).check('Object', ['Array', 'String']);
    UpdatePrimitive.call(this, target);
    this.pairs = pairs;
}
DeleteFromObject.prototype = _.create(UpdatePrimitive.prototype);
module.exports.DeleteFromObject = DeleteFromObject;

/*
 * jupd:delete-from-array($a as array(), $i as xs:integer)
 * Removes the item at position $i from the array $a (causes all following items in the array to move one position to the left).
 */
function DeleteFromArray(target, position){
    Args(arguments).check('Array', 'Number');
    UpdatePrimitive.call(this, target);
    this.position = position;
}
DeleteFromArray.prototype = _.create(UpdatePrimitive.prototype);
module.exports.DeleteFromArray = DeleteFromArray;

/*
 * jupd:replace-in-array($a as array(), $i as xs:integer, $v as item())
 * Replaces the item at position $i in the array $a with the item $v (do nothing if $i is not comprised between 1 and jdm:size($a)).
 */
function ReplaceInArray(target, position, item){
    Args(arguments).check('Array', 'Number');
    UpdatePrimitive.call(this, target);
    this.position = position;
    this.item = item;
}
ReplaceInArray.prototype = _.create(UpdatePrimitive.prototype);
module.exports.ReplaceInArray = ReplaceInArray;

/*
 * jupd:replace-in-object($o as object(), $n as xs:string, $v as item())
 * Replaces the value of the pair named $n in the object $o with the item $v (do nothing if there is no such pair).
 */
function ReplaceInObject(target, pair, value){
    Args(arguments).check('Object', 'String');
    UpdatePrimitive.call(this, target);
    this.pair = pair;
    this.value = value;
}
ReplaceInObject.prototype = _.create(UpdatePrimitive.prototype);
module.exports.ReplaceInObject = ReplaceInObject;

/*
 * jupd:rename-in-object($o as object(), $n as xs:string, $p as xs:string)
 * Renames the pair originally named $n in the object $o as $p (do nothing if there is no such pair).
 */
function RenameInObject(target, pairName, newPairName){
    Args(arguments).check('Object', 'String', 'String');
    UpdatePrimitive.call(this, target);
    this.pairName = pairName;
    this.newPairName = newPairName;
}
RenameInObject.prototype = _.create(UpdatePrimitive.prototype);
module.exports.RenameInObject = RenameInObject;