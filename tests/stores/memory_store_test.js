'use strict';

var vows = require('vows');
var assert = require('assert');

var MemoryStore = require('../../dist/stores/MemoryStore');
var PUL = require('../../dist/updates/PUL');
var jerr = require('../../dist/errors');

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
        assert.deepEqual(obj, object);
    },
    
    'simple update (1)': function(){
        var obj = { a: 1, b: { c: 1 } };
        var store = new MemoryStore();
        var id = store.put(obj);

        var pul = new PUL();
        pul
        .insertIntoObject(id, ['b'], { d: 1 })
        .deleteFromObject(id, ['b'], ['c']);
        assert.equal(obj.b.d, undefined);
        assert.equal(obj.b.c, 1);

        var serializedPUL = pul.serialize();
        store.commit(pul);

        obj = store.get(id);
        assert.equal(obj.b.d, 1);
        assert.equal(obj.b.c, undefined);

        obj = { a: 1, b: { c: 1 } };
        store = new MemoryStore();
        store.put(obj, id);
        pul = new PUL();
        pul.parse(serializedPUL);
        store.commit(pul);

        obj = store.get(id);
        assert.equal(obj.b.d, 1);
        assert.equal(obj.b.c, undefined);
    },
    
    'simple update (2)': function(){
        var obj = { a: 1, b: { c: 1 } };
        var store = new MemoryStore();
        var id = store.put(obj);

        var pul = new PUL();
        pul.renameInObject(id, [], 'a', 'z');
        store.commit(pul);

        obj = store.get(id);
        assert.equal(obj.z, 1);
        assert.equal(obj.a, undefined);
    },
    
    'simple update (3)': function(){
        var obj = { a: 1, b: { c: 1 } };
        var store = new MemoryStore();
        var id = store.put(obj);

        var pul = new PUL();
        pul.renameInObject(id, [], 'a', 'z')
        .insertIntoObject(id, [], { a: 2 });

        store.commit(pul);

        obj = store.get(id);
        assert.equal(obj.a, 2);
        assert.equal(obj.z, 1);
    },

    'simple update (4)': function(){
        var obj = { a: 1, b: { c: 1 } };
        var store = new MemoryStore();
        var id = store.put(obj);

        var pul = new PUL();
        pul.insertIntoObject(id, [], { z: 1 })
        .insertIntoObject(id, [], { a: 2 });

        //throws [JNUP0006] "a": pair to insert already exists in object
        assert.throws(function () {
            store.commit(pul);
        }, jerr.JNUP0006);

        //"An individual function may create an invalid JSON instance;
        // however, an updating query must produce a valid JSON instance once the entire query is evaluated,
        // or an error is raised and the entire update fails, leaving the instance in its original state."
        obj = store.get(id);
        assert.equal(obj.a, 1);
        assert.equal(obj.z, undefined);
    },

    //http://try.zorba.io/queries/xquery/YLem0q2eDKwF7Yb9GyBKIwdUA20%3D
    //http://try.zorba.io/queries/xquery/J5QX9GgI64MnJlJ3IJ9vCUcCG8o%3D
    'example': function(){
        var todos = [{
            id: 0,
            title: 'Write thesis',
            complete: false
        }];

        var store = new MemoryStore();
        var id = store.put(todos);
        var pul = new PUL();
        pul
            .insertIntoArray(id, [], 1, [{ id: 1 }])
            .replaceInObject(id, ['0'], 'complete', true)
            .renameInObject(id, ['0'], 'complete', 'completed')
            .insertIntoObject(id, ['0'], { title: 'More figures' })
            .deleteFromObject(id, ['0'], ['title']);
        store.commit(pul);

        todos = store.get(id);
        assert.equal(todos[0].completed, true);
        assert.equal(todos[0].complete, undefined);
        assert.equal(todos[0].id, 0);
        assert.equal(todos[0].title, 'More figures');
        assert.equal(todos[1].id, 1);
    },

    'JNUP0008': function(){
        var obj = { a: 1, b: {} };

        var store = new MemoryStore();
        var id = store.put(obj);

        var pul = new PUL();
        pul.insertIntoObject(id, ['c'], { a: 1 });

        assert.throws(function () {
            store.commit(pul);
        },  jerr.JNUP0008);

    },

    //http://try.zorba.io/queries/xquery/ggGUhCUEuOUaVmfxjTOJ4ygDdas%3D
    'rename & insert': function(){
        var obj = { a: 1, b: {} };

        var store = new MemoryStore();
        var id = store.put(obj);
        var pul = new PUL();
        pul
        .insertIntoObject(id, ['b'], { a: 1 })
        .renameInObject(id, [], 'b', 'z');

        store.commit(pul);

        obj = store.get(id);
        assert.equal(obj.z.a, 1);
    }
}).export(module);