'use strict';

var vows = require('vows');
var assert = require('assert');

var MemoryStore = require('../../lib/stores/memory-store').MemoryStore;
//var jerr = require('../../lib/errors');

vows.describe('Test MemoryStore').addBatch({
    'simple test': function(){
        var store = new MemoryStore();
        assert.throws(function () {
            store.get(1);
        }, Error);

        assert.throws(function () {
            store.get('a');
        }, Error);
        
        var object = {
            a: [1, 2],
            b: 2
        };
        
        var id = store.put(object);
        var obj = store.get(id);
        assert.equal(obj, object);
    },
    
    'simple update': function(){
        var obj = { a: 1, b: { c: 1 } };
        var store = new MemoryStore();
        var id = store.put(obj);
        store
        .insertIntoObject(id, ['b'], { d: 1 })
        .deleteFromObject(id, ['b'], ['c']);

        assert.equal(obj.b.d, undefined);
        assert.equal(obj.b.c, 1);

        store.commit();

        assert.equal(obj.b.d, 1);
        assert.equal(obj.b.c, undefined);
    }
}).export(module);