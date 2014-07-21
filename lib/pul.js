'use strict';

var _ = require('lodash');

var PUL = function(){
    this.del = [];
    this.insert = [];
    this.insertIntoObject = [];
    this.deleteFromObject = [];
    this.replaceInObject = [];
    this.renameInObject = [];
    this.insertIntoArray = [];
    this.deleteFromArray = [];
    this.replaceInArray = [];
};

PUL.prototype.insertIntoObject = function(target, object){
    //this.insertIntoObject.push({});
};
/*

jupd:insert-into-object($o as object(), $p as object())
Inserts all pairs of the object $p into the object $o.
jupd:insert-into-array($a as array(), $i as xs:integer, $c as item()*)
Inserts all items in the sequence $c before position $i into the array $a.
jupd:delete-from-object($o as object(), $s as xs:string*)
Removes the pairs the names of which appear in $s from the object $o.
jupd:delete-from-array($a as array(), $i as xs:integer)
Removes the item at position $i from the array $a (causes all following items in the array to move one position to the left).
jupd:replace-in-array($a as array(), $i as xs:integer, $v as item())
Replaces the item at position $i in the array $a with the item $v (do nothing if $i is not comprised between 1 and jdm:size($a)).
jupd:replace-in-object($o as object(), $n as xs:string, $v as item())
Replaces the value of the pair named $n in the object $o with the item $v (do nothing if there is no such pair).
jupd:rename-in-object($o as object(), $n as xs:string, $p as xs:string)
*/

exports.module = PUL;