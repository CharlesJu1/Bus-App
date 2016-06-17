var gulp = require('gulp'),
    gulpWatch = require('gulp-watch'),
    del = require('del'),
    runSequence = require('run-sequence'),
    argv = process.argv;


/**
 * Ionic hooks
 * Add ':before' or ':after' to any Ionic project command name to run the specified
 * tasks before or after the command.
 */
gulp.task('serve:before', ['watch']);
gulp.task('emulate:before', ['build']);
gulp.task('deploy:before', ['build']);
gulp.task('build:before', ['build']);

// ionic run will call the gulp task hook run:before
// we want to 'watch' when livereloading
var shouldWatch = argv.indexOf('-l') > -1 || argv.indexOf('--livereload') > -1;
gulp.task('run:before', [shouldWatch ? 'watch' : 'build']);

/**
 * Ionic Gulp tasks, for more information on each see
 * https://github.com/driftyco/ionic-gulp-tasks
 *
 * Using these will allow you to stay up to date if the default Ionic 2 build
 * changes, but you are of course welcome (and encouraged) to customize your
 * build however you see fit.
 */
var buildBrowserify = require('ionic-gulp-browserify-typescript');
var buildSass = require('ionic-gulp-sass-build');
var copyHTML = require('ionic-gulp-html-copy');
var copyFonts = require('ionic-gulp-fonts-copy');
var copyScripts = require('ionic-gulp-scripts-copy');

var isRelease = argv.indexOf('--release') > -1;

gulp.task('watch', ['clean'], function(done){
  runSequence(
    ['sass', 'html', 'fonts', 'scripts', 'json'],
    function(){
      gulpWatch('app/**/*.scss', function(){ gulp.start('sass'); });
      gulpWatch('app/**/*.html', function(){ gulp.start('html'); });
      gulpWatch('app/**/*.json', function(){ gulp.start('json'); });
      buildBrowserify({ watch: true}).on('end', done);
    }
  );
});

// By default, buildBrowserify use typescript.js to compile .ts files.
// This gives an error when adding a method to Number in mathUtil.ts
// Instead, use tsc.js to compile .ts files.
// Both typescript.js and tsc.js are in typescript module in tsify module 
// in ionic-gulp-browserify-typescript module
//       tsifyOptions: { typescript: "tsc"} 
gulp.task('build', ['clean'], function(done){
  runSequence(
    ['sass', 'html', 'fonts', 'scripts'],
    function(){
      buildBrowserify({
        browserifyOptions: {
          debug: !isRelease
        }
      }).on('end', done);
    }
  );
});

gulp.task('sass', buildSass);
gulp.task('html', copyHTML);
gulp.task('fonts', copyFonts);
gulp.task('scripts', ['map'], copyScripts);
gulp.task('clean', function(){
  return del('www/build');
});

// cju added json task to copy json files
gulp.task('json', function() {
  gulp.src('app/**/*.json')
    .pipe(gulp.dest('www/build'));
})

// cju added task to copy map files
gulp.task('map', function() {
  gulp.src('node_modules/es6-shim/es6-shim.map')
    .pipe(gulp.dest('www/build/js'));
})

// cju added preprocess tasks
// run 'gulp dev' before 'ionic run' to set the dev environment
var preprocess = require('gulp-preprocess');
gulp.task('dev', function() {
  gulp.src('app/templates/app-setting.ts')
    .pipe(preprocess({context: { APP_ENV: 'DEVELOPMENT', DEBUG: true}}))
    .pipe(gulp.dest('app/'));
});

gulp.task('test_iis', function() {
  gulp.src('app/templates/app-setting.ts')
    .pipe(preprocess({context: { APP_ENV: 'TEST_IIS', DEBUG: true}}))
    .pipe(gulp.dest('app/'));
})

gulp.task('test_env', function() {
  gulp.src('app/templates/app-setting.ts')
    .pipe(preprocess({context: { APP_ENV: 'TEST', DEBUG: true}}))
    .pipe(gulp.dest('app/'));
});

gulp.task('prod', function() {
  gulp.src('app/templates/app-setting.ts')
    .pipe(preprocess({context: { APP_ENV: 'PRODUCTION'}}))
    .pipe(gulp.dest('app/'));
});
