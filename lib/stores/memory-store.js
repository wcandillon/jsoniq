'use strict';

var _ = require('lodash');
var uuid = require('node-uuid');

var Store = require('./store').Store;
var Args = require('../args');

function MemoryStore(){
    Store.call(this);
    this.items = {};
}
MemoryStore.prototype = _.create(Store.prototype);

MemoryStore.prototype.get = function(target){
    Store.prototype.get.call(this, target);
    var tokens = target.split(':');
    var id = tokens[0];
    var ordPath = tokens[1];
    var item = this.items[id];
    if(item === undefined) {
        throw new Error('Item not found');
    }
    return this.find(item, ordPath ? ordPath : []);
};

MemoryStore.prototype.put = function(newItem){
    Store.prototype.put.call(this, newItem);
    var id = uuid.v4();
    this.items[id] = newItem;
    return id;
};

MemoryStore.prototype.commit = function(){
    this.pul.apply(this);
};

exports.MemoryStore = MemoryStore;