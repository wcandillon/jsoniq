'use strict';

var Args = require('../args');

function Store(){

}

Store.prototype.get = function(){
    Args(arguments).check('String');
};

Store.prototype.put = function(){
    Args(arguments).check(Object);
};

exports.Store = Store;