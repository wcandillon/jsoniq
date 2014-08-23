'use strict';

var through2 = require('through2');
var request = require('request');
var gutil = require('gulp-util');

module.exports = function(){
    return through2.obj(function(file, enc, cb) {
        //request = request.defaults({'proxy':'http://127.0.0.1:8888'});
        var tz = '-120';
        var command = '-tree -javascript -ll 1 -backtrack -a jsoniq';

        var r = request.post('http://www.bottlecaps.de/rex/', function(err, res, body) {
            file.contents = new Buffer(body);
            file.path = gutil.replaceExtension(file.path, '.js');
            cb(err, file);
        });

        var form = r.form();
        form.append('tz', tz);
        form.append('command', command);
        form.append('input', file.contents.toString('utf8'), { contentType: 'text/plain', filename: 'ES5Parser.ebnf' });
    });
};
