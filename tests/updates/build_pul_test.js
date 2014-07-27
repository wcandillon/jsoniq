'use strict';

var vows = require('vows');
var assert = require('assert');
var uuid = require('node-uuid');

var PUL = require('../../lib/update/pul');

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
    }
}).export(module);