/**
 *  Environment variables #346
 */
var gulp = require('gulp');
var fs = require('fs');
var argv = require('yargs').argv;
var ngConstant = require('gulp-ng-constant');

var environment = argv.env || 'dev';
var ENV = JSON.parse(fs.readFileSync('./src/config/' + environment + '.json', 'utf8')).ENV;

gulp.task('config', function () {
  gulp.src('src/config/' + environment + '.json')
    .pipe(ngConstant({
      name: 'config',
      dest: 'config.js'
    }))
    .pipe(gulp.dest('src/app'));
});