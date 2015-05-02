'use strict';

var gulp = require('gulp');
//var $ = require('gulp-load-plugins')();

var fs = require('fs');
var request = require('request');
var path = require('path');
var Q = require('q');

request = request.defaults({'proxy':'http://127.0.0.1:8888'});

gulp.task('rex', function(){
    var promises = [];
    var grammars = [{
        source: 'grammars/XQueryParser.ebnf',
        destination: 'lib/compiler/parsers/XQueryParser.ts',
        command: '-ll 2 -backtrack -tree -typescript',
        tz: '-60'
    }, {
        source: 'grammars/JSONiqParser.ebnf',
        destination: 'lib/compiler/parsers/JSONiqParser.ts',
        command: '-ll 2 -backtrack -tree -typescript',
        tz: '-60'
    }];
    grammars.forEach(function(parser){
        var deferred = Q.defer();
        var grammar = fs.readFileSync(parser.source);
        request.post({ url: 'http://www.bottlecaps.de/rex/', formData: {
            tz: parser.tz,
            command: parser.command,
            input: {
                value: grammar,
                options: {
                    filename: path.basename(parser.source),
                    contentType: 'application/octet-stream'
                }
            }
        } }, function(err, res, body) {
            if(err) {
                deferred.reject(err);
            } else {
                fs.writeFileSync(parser.destination, body);
                deferred.resolve();
            }
        });
        promises.push(deferred.promise);
    });
    return Q.all(promises);
});

