'use strict';

var vows = require('vows');
var assert = require('assert');
var uuid = require('node-uuid');

var PUL = require('../../lib/update/pul');
var jerr = require('../../lib/errors');

vows.describe('Test Building PUL').addBatch({
    'simple PUL': function(){
        assert.doesNotThrow(function () {
            var pul = new PUL();
            pul
            .insertIntoObject(uuid.v4(), { b: 2 })
            .insertIntoArray(uuid.v4(), 0, ['a'])
            .deleteFromObject(uuid.v4(), ['a', 'b'])
            .replaceInObject(uuid.v4(), 'a', 1);
        });
    },
    
    'Two or more ReplaceInObject primitives have the same target object and selector.': function(){
        //Objects have different identity
        assert.doesNotThrow(function () {
            var pul = new PUL();
            pul
            .replaceInObject(uuid.v4(), 'a', 1)
            .replaceInObject(uuid.v4(), 'a', 2);
        });
        
        //Objects have the same identity
        assert.throws(function () {
            var target = uuid.v4();
            var pul = new PUL();
            pul
            .replaceInObject(target, 'a', 1)
            .replaceInObject(target, 'a', 2);
        }, Error);
    },
    
    'Two or more RenameInObject primitives have the same target object and selector.': function(){
        //Objects have different identity
        assert.doesNotThrow(function () {
            var pul = new PUL();
            pul
            .renameInObject(uuid.v4(), 'a', 'b')
            .renameInObject(uuid.v4(), 'a', 'b');
        });
        
        //Objects have the same identity
        assert.throws(function () {
            var target = { a: 1 };
            var pul = new PUL();
            pul
            .renameInObject(target, 'a', 'b')
            .renameInObject(target, 'a', 'c');
        }, Error);
    },
    
    'Two or more ReplaceInArray primitives have the same target object and selector.': function(){
        //Objects have different identity
        assert.doesNotThrow(function () {
            var pul = new PUL();
            pul
            .replaceInArray(uuid.v4(), 1, 'b')
            .replaceInArray(uuid.v4(), 1, 'a');
        });
        
        //Objects have the same identity
        assert.throws(function () {
            var target = uuid.v4();
            var pul = new PUL();
            pul
            .replaceInArray(target, 1, 'b')
            .replaceInArray(target, 1, 'c');
        }, Error);
    },
    
    'insertIntoObject() Normalization': function(){
        //Multiple UPs of this type with the same object target are merged into one UP with this target,
        //where the sources containing the pairs to insert are merged into one object.
        var target = uuid.v4();
        var pul = new PUL();
        pul
        .insertIntoObject(target, { a: 1, b: 2})
        .insertIntoObject(target, { c: 3 })
        .insertIntoObject(target, { d: 4 });
        assert.equal(pul.upds.insertIntoObject.length, 1, 'Should contain a single insertIntoObject primitive');
        assert.equal(pul.upds.insertIntoObject[0].pairs.a, 1);
        assert.equal(pul.upds.insertIntoObject[0].pairs.b, 2);
        assert.equal(pul.upds.insertIntoObject[0].pairs.c, 3);
        assert.equal(pul.upds.insertIntoObject[0].pairs.d, 4);
        
        //An error jerr:JNUP0005 is raised if a collision occurs.
        assert.throws(function () {
            var pul = new PUL();
            pul
            .insertIntoObject(target, { a: 1, b: 2 })
            .insertIntoObject(target, { b: 3, c: 3 })
            .insertIntoObject(target, { c: 3, d: 4 });
        }, jerr.JNUP0005);
    },
    
    'InsertIntoArray() Normalization': function(){
        //Multiple UPs of this type with the same (array,index) target are merged into one UP with this target,
        //where the items are merged in an implementation-dependent order.
        //Several inserts on the same array and selector (position) are equivalent to a unique insert on that array and selector with the content of those original inserts appended in an implementation-dependent order.
        var target = uuid.v4();
        var pul = new PUL();
        pul
        .insertIntoArray(target, 1, ['a'])
        .insertIntoArray(target, 0, ['a'])
        .insertIntoArray(target, 0, ['a']);
        assert.equal(pul.upds.insertIntoArray.length, 2, 'Should contain two insertIntoArray primitives');
    },
    
    
    'Test PUL parsing and serialization': function(){
        var pul = new PUL();
        pul
        .insertIntoObject(uuid.v4(), { a: 1 })
        .insertIntoArray(uuid.v4(), 0, [1, 2])
        .deleteFromObject(uuid.v4(), ['a'])
        .replaceInObject(uuid.v4(), 'a', 1)
        .deleteFromArray(uuid.v4(), 0)
        .replaceInArray(uuid.v4(), 0, 1)
        .renameInObject(uuid.v4(), 'a', 'b');

        var serializedPUL = pul.serialize();
        var pul1 = new PUL();
        pul1.parse(serializedPUL);
        var pul2 = new PUL();
        pul2.parse(serializedPUL);
        assert.equal(pul1.serialize(), pul2.serialize(), 'pul1 and pul2 should be identicals');
        assert.equal(pul1.serialize(), serializedPUL, 'pul1 and serializedPUL should be identicals');
        assert.equal(pul2.serialize(), serializedPUL, 'pul2 and serializedPUL should be identicals');
    }
}).export(module);