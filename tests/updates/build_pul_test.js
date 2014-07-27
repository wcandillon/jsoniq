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
    }
}).export(module);