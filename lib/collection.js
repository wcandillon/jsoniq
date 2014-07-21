'use strict';

var _ = require('lodash');
var uuid = require('node-uuid');

var Collection = function(name){
    this.name = name;
    this.collection = {};
};

Collection.prototype.list = function(){
    return this.collection;
};

Collection.prototype.get = function(id){
    return this.collection[id];
};

Collection.prototype.insert = function(object){
    var id = uuid.v4();
    object._id = id;
    this.collection[id] = object;
};

Collection.prototype.remove = function(id){
    delete this.collection[id];
};

exports.module = Collection;