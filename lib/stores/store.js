'use strict';

var Args = require('../args');
var PUL = require('../updates/pul');

var serializeTarget = function(ref, ordPath){
    return [ref, ordPath.join('.')].join(':');
};

function Store(){
    this.history = [];
    this.pul = new PUL();
}

Store.prototype.find = function(item, ordPath) {
    if(ordPath.length === 0) {
        return item;
    }
    return this.find(item[ordPath[0]], ordPath.slice(1));
};

Store.prototype.get = function(){
    Args(arguments).check('String');
};

Store.prototype.put = function(){
    Args(arguments).check('String', Object);
};

Store.prototype.insertIntoObject = function(ref, ordPath, pairs) {
    Args(arguments).check('String', Array, Object);
    var target = serializeTarget(ref, ordPath);
    this.pul.insertIntoObject(target, pairs);
    return this;
};

Store.prototype.insertIntoArray = function(ref, ordPath, position, items) {
    Args(arguments).check('String', Array, 'Number', Object);
    var target = serializeTarget(ref, ordPath);
    this.pul.insertIntoArray(target, position, items);
    return this;
};

Store.prototype.deleteFromObject = function(ref, ordPath, keys){
    Args(arguments).check('String', Array, Object);
    var target = serializeTarget(ref, ordPath);
    this.pul.deleteFromObject(target, keys);
    return this;
};

Store.prototype.deleteFromArray = function(ref, ordPath, position){
    Args(arguments).check('String', Array, 'Number');
    var target = serializeTarget(ref, ordPath);
    this.pul.deleteFromArray(target, position);
    return this;
};

Store.prototype.replaceInArray = function(ref, ordPath, position, item){
    Args(arguments).check('String', Array, 'Number');
    var target = serializeTarget(ref, ordPath);
    this.pul.replaceInArray(target, position, item);
    return this;
};

Store.prototype.replaceInObject = function(ref, ordPath, key, value){
    Args(arguments).check('String', Array, 'String');
    var target = serializeTarget(ref, ordPath);
    this.pul.replaceInObject(target, key, value);
    return this;
};

Store.prototype.renameInObject = function(ref, ordPath, key, newKey){
    Args(arguments).check('String', Array, 'String', 'String');
    var target = serializeTarget(ref, ordPath);
    this.pul.renameInObject(target, key, newKey);
    return this;
};

exports.Store = Store;