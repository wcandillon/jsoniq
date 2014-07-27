'use strict';

var vows = require('vows');
var assert = require('assert');

var PUL = require('../../lib/update/pul');

vows.describe('Test Building PUL').addBatch({
    'simple PUL': function(){
        assert.doesNotThrow(function () {
            var pul = new PUL();
            pul
            .insertIntoObject({ a: 1 }, { b: 2 })
            .insertIntoArray([], 0, ['a'])
            .deleteFromObject({ a: 1 }, ['a', 'b'])
            .replaceInObject({ a: 1 }, 'a', 1);
        });
    },
    
    'Two or more ReplaceInObject primitives have the same target object and selector.': function(){
        //Objects have different identity
        assert.doesNotThrow(function () {
            var pul = new PUL();
            pul
            .replaceInObject({ a: 1 }, 'a', 1)
            .replaceInObject({ a: 1 }, 'a', 2);
        });
        
        //Objects have the same identity
        assert.throws(function () {
            var target = { a: 1 };
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
            .renameInObject({ a: 1 }, 'a', 'b')
            .renameInObject({ a: 1 }, 'a', 'b');
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
            .replaceInArray([1, 2], 1, 'b')
            .replaceInArray([1, 2], 1, 'a');
        });
        
        //Objects have the same identity
        assert.throws(function () {
            var target = [1, 2];
            var pul = new PUL();
            pul
            .replaceInArray(target, 1, 'b')
            .replaceInArray(target, 1, 'c');
        }, Error);
    }
}).export(module);