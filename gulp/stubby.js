/**
 *  npm gulp-stubby-server
 */
var gulp = require('gulp');
var stubby = require('./index.stubby.js');

gulp.task('stubby', function(cb) {
    var options = {
        callback: function (server, options) {
          server.get(1, function (err, endpoint) {
            if (!err)
             console.log(endpoint);
          });
        },
        stubs: 8882,
        admin: 8889,
        files: [
            'src/fixtures/*.{json,yaml,yml,js}'
        ],
        location: 'uc431000vw7net'
    };
    return stubby(options, cb);
});