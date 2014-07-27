'use strict';

var _ = require('lodash');

var requiredError = _.template('Argument number <%= index %> is required.');
var typeError = _.template('Argument <%= index %> of type <%= actualType %> doesn\'t match type <%= expectedType %>.');

function Args(args, optional){
    this.args = args;
    this.optional = optional;
}

Args.prototype.defaults = function(){
    if(this.optional === undefined) {
        throw new Error('No optional parameters have been specified.');
    }
    var that = this;
    _.forEach(arguments, function(value, index){
        var argIdx = that.optional + index - 1;
        var arg = that.args[argIdx];
        if(arg === undefined) {
            that.args[argIdx] = value;
        }
    });
    return this;
};

Args.prototype.check = function(){
    var that = this;
    _.forEach(arguments, function(type, index){
        var arg = that.args[index];
        var optional = that.optional && index > that.optional;
        if(arg === undefined && !optional) {
            throw new TypeError(requiredError({ index: index + 1 }));
        } else if(arg !== undefined && _.isString(type) && !_['is' + type](arg)) {
            throw new TypeError(typeError({ index: index + 1, actualType: typeof(arg), expectedType: type }));
        } else if(arg !== undefined && !_.isString(type) && !(arg instanceof type)) {
            throw new TypeError(typeError({ index: index + 1, actualType: typeof(arg), expectedType: type.name }));
        }
    });
    return this;
};

module.exports = function(args, optional){
    return new Args(args, optional);
};