'use strict';

var _ = require('lodash');

var requiredError = _.template('Argument number <%= index %> is required.');
var typeError = _.template('Argument <%= index %> of type <%= actualType %> doesn\'t match type <%= expectedType %>.');
var typeCheckerError = _.template('No type checker found for <%= methodName %>. Available type checkers: <%= typeCheckers %>.');

var typeCheckers = _.functions(_).filter(function(method){ return method.substring(0, 'is'.length) === 'is'; });

function checkArgument(arg, optional, type, index, expectedType){
    if(arg === undefined && !optional) {
        throw new TypeError(requiredError({ index: index + 1 }));
    } else if(arg !== undefined && _.isArray(type)) {
            var clazz = type[0];
            var subtype = type[1];
            checkArgument(arg, optional, clazz, index, expectedType);
            _.forEach(arg, function(child){
                checkArgument(child, optional, subtype, index, expectedType);
            });
    } else if(arg !== undefined && _.isString(type)) {
        var methodName = 'is' + type;
            if(typeCheckers.indexOf(methodName) === -1) {
                throw new Error(typeCheckerError({ methodName: methodName, typeCheckers: typeCheckers.join(', ') }));
            } else if(!_['is' + type](arg)) {
                throw new TypeError(typeError({ index: index + 1, actualType: typeof(arg), expectedType: expectedType }));
            }
        } else if(arg !== undefined && !_.isString(type) && !(arg instanceof type)) {
            throw new TypeError(typeError({ index: index + 1, actualType: typeof(arg), expectedType: expectedType }));
        }
}

function serializeType(type) {
    var typeStr;
    if(_.isArray(type)) {
        typeStr = serializeType(type[0]) + (type.length > 1 ? '<' + serializeType(type.slice(1)) + '>' : '');
    } else if(_.isString(type)) {
        typeStr = type;
    } else {
        typeStr = type.name;
    }
    return typeStr;
}

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
        checkArgument(arg, optional, type, index, serializeType(type));
    });
    return this;
};

module.exports = function(args, optional){
    return new Args(args, optional);
};