'use strict';

var _ = require('lodash');
var Args = require('../args');

var jerr = require('../errors');

function UpdatePrimitive(target){
    this.target = target;
}

/*
 * jupd:insert-into-object($o as object(), $p as object())
 * Inserts all pairs of the object $p into the object $o.
 */
function InsertIntoObject(target, pairs){
    Args(arguments).check('String', 'Object');
    UpdatePrimitive.call(this, target);
    this.pairs = pairs;
}
InsertIntoObject.prototype = _.create(UpdatePrimitive.prototype);
InsertIntoObject.prototype.merge = function(udp){
    Args(arguments).check(InsertIntoObject);
    var keys = Object.keys(this.pairs);
    var newKeys = Object.keys(udp.pairs);
    var intersection = _.intersection(keys, newKeys);
    //An error jerr:JNUP0005 is raised if a collision occurs.
    if(intersection.length > 0) {
        throw new jerr.JNUP0005();
    } else {
        _.merge(this.pairs, udp.pairs);
    }
    return this;
};
InsertIntoObject.prototype.apply = function(store) {
    var item = store.get(this.target);
    var that = this;
    Object.keys(this.pairs).forEach(function(key){
        item[key] = that.pairs[key];
    });
    return this;
};
module.exports.InsertIntoObject = InsertIntoObject;

/*
 * jupd:insert-into-array($a as array(), $i as xs:integer, $c as item()*)
 * Inserts all items in the sequence $c before position $i into the array $a.
 */
function InsertIntoArray(target, position, items){
    Args(arguments).check('String', 'Number', 'Array');
    UpdatePrimitive.call(this, target);
    this.position = position;
    this.items = items;
}
InsertIntoArray.prototype = _.create(UpdatePrimitive.prototype);
InsertIntoArray.prototype.merge = function(udp){
    Args(arguments).check(InsertIntoArray);
    this.items.concat(udp.items);
    return this;
};
InsertIntoArray.prototype.apply = function(store) {
    var item = store.get(this.target);
    this.keys.forEach(function(key){
        delete item[key];
    });
    return this;
};
module.exports.InsertIntoArray = InsertIntoArray;

/*
 * jupd:delete-from-object($o as object(), $s as xs:string*)
 * Removes the pairs the names of which appear in $s from the object $o.
 */
function DeleteFromObject(target, keys){
    Args(arguments).check('String', ['Array', 'String']);
    UpdatePrimitive.call(this, target);
    this.keys = keys;
}
DeleteFromObject.prototype = _.create(UpdatePrimitive.prototype);
DeleteFromObject.prototype.merge = function(udp){
    Args(arguments).check(DeleteFromObject);
    this.keys = _.uniq(this.keys.concat(udp.keys));
    return this;
};
DeleteFromObject.prototype.apply = function(store) {
    var item = store.get(this.target);
    this.keys.forEach(function(key){
        delete item[key];
    });
    return this;
};
module.exports.DeleteFromObject = DeleteFromObject;

/*
 * jupd:delete-from-array($a as array(), $i as xs:integer)
 * Removes the item at position $i from the array $a (causes all following items in the array to move one position to the left).
 */
function DeleteFromArray(target, position){
    Args(arguments).check('String', 'Number');
    UpdatePrimitive.call(this, target);
    this.position = position;
}
DeleteFromArray.prototype = _.create(UpdatePrimitive.prototype);
DeleteFromArray.prototype.apply = function(store) {
    var item = store.get(this.target);
    item.splice(this.position, 1);
    return this;
};
module.exports.DeleteFromArray = DeleteFromArray;

/*
 * jupd:replace-in-array($a as array(), $i as xs:integer, $v as item())
 * Replaces the item at position $i in the array $a with the item $v (do nothing if $i is not comprised between 1 and jdm:size($a)).
 */
function ReplaceInArray(target, position, item){
    Args(arguments).check('String', 'Number');
    UpdatePrimitive.call(this, target);
    this.position = position;
    this.item = item;
}
ReplaceInArray.prototype = _.create(UpdatePrimitive.prototype);
RenameInObject.prototype.apply = function(store) {
    var item = store.get(this.target);
    item[this.position] = this.item;
    return this;
};
module.exports.ReplaceInArray = ReplaceInArray;

/*
 * jupd:replace-in-object($o as object(), $n as xs:string, $v as item())
 * Replaces the value of the pair named $n in the object $o with the item $v (do nothing if there is no such pair).
 */
function ReplaceInObject(target, key, value){
    Args(arguments).check('String', 'String');
    UpdatePrimitive.call(this, target);
    this.key = key;
    this.value = value;
}
ReplaceInObject.prototype = _.create(UpdatePrimitive.prototype);
ReplaceInObject.prototype.apply = function(store) {
    var item = store.get(this.target);
    item[this.key] = this.value;
    return this;
};
module.exports.ReplaceInObject = ReplaceInObject;

/*
 * jupd:rename-in-object($o as object(), $n as xs:string, $p as xs:string)
 * Renames the pair originally named $n in the object $o as $p (do nothing if there is no such pair).
 */
function RenameInObject(target, key, newKey){
    Args(arguments).check('String', 'String', 'String');
    UpdatePrimitive.call(this, target);
    this.key = key;
    this.newKey = newKey;
}
RenameInObject.prototype = _.create(UpdatePrimitive.prototype);
RenameInObject.prototype.apply = function(store) {
    var item = store.get(this.target);
    item[this.newKey] = item[this.key];
    delete item[this.key];
    return this;
};
module.exports.RenameInObject = RenameInObject;