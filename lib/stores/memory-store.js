'use strict';

var _ = require('lodash');
var uuid = require('node-uuid');

var Store = require('./store').Store;

function MemoryStore(){
    Store.call(this);
    this.items = {};
}
MemoryStore.prototype = _.create(Store.prototype);

MemoryStore.prototype.get = function(id){
    Store.prototype.get.call(this, id);
    var item = this.items[id];
    if(item === undefined) {
        throw new Error('Item not found');
    }
    return item;
};

MemoryStore.prototype.put = function(newItem){
    Store.prototype.put.call(this, newItem);
    _.find(this.items, function(item){
        if(item === newItem) {
            throw new Error('Item has been inserted already');
        }
    });
    var id = uuid.v4();
    this.items[id] = newItem;
    return id;
};

exports.MemoryStore = MemoryStore;