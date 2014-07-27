'use strict';

var vows = require('vows');
var assert = require('assert');

var PUL = require('../../lib/update/pul');

vows.describe('Test Building PUL').addBatch({
    'simple PUL': function(){
        var pul = new PUL();
    }
}).export(module);