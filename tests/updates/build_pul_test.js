'use strict';

var vows = require('vows');
//var assert = require('assert');

var PUL = require('../../lib/update/pul');

vows.describe('Test Building PUL').addBatch({
    'simple PUL': function(){
        var pul = new PUL();
        pul
        .insertIntoObject({ a: 1 }, { b: 2 })
        .insertIntoArray([], 0, ['a']);
    }
}).export(module);