'use strict';
// Taken from: http://mikevalstar.com/post/fast-gulp-browserify-babelify-watchify-react-build/

var gulp = require('gulp');  // Base gulp package
var babelify = require('babelify'); // Used to convert ES6 & JSX to ES5
var browserify = require('browserify'); // Providers "require" support, CommonJS
var notify = require('gulp-notify'); // Provides notification to both the console and Growel
var rename = require('gulp-rename'); // Rename sources
var sourcemaps = require('gulp-sourcemaps'); // Provide external sourcemap files
var livereload = require('gulp-livereload'); // Livereload support for the browser
var chalk = require('chalk'); // Allows for coloring for logging
var gutil = require('gulp-util'); // Provides gulp utilities, including logging and beep
var source = require('vinyl-source-stream'); // Vinyl stream support
var buffer = require('vinyl-buffer'); // Vinyl stream support
var watchify = require('watchify'); // Watchify for source changes
var objMerge = require('utils-merge'); // Object merge tool
var duration = require('gulp-duration'); // Time aspects of your gulp process

var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var merge = require('merge-stream');
var cleanCSS = require('gulp-clean-css');

var path = require('path');

// Configuration for Gulp
var config = require('./public.config.json');

// Error reporting function for browserify
function mapError(err) {
    if (err.fileName) {
        // Regular error
        gutil.log(chalk.red(err.name)
            + ': ' + chalk.yellow(err.fileName.replace(__dirname + '/public/js/', ''))
            + ': ' + 'Line ' + chalk.magenta(err.lineNumber)
            + ' & ' + 'Column ' + chalk.magenta(err.columnNumber || err.column)
            + ': ' + chalk.blue(err.description));
    } else {
        // Browserify error..
        gutil.log(chalk.red(err.name)
            + ': '
            + chalk.yellow(err.message));
    }
}

gulp.task('compile:sass', () => {
    var sassTimer = duration('Sass compile');

    return gulp.src(config.css.src)
        .pipe(sourcemaps.init())
            .pipe(sass().on('error', sass.logError))
            .pipe(concat(config.css.bundle))
        .pipe(sourcemaps.write('map'))
        .pipe(gulp.dest('./dist/'))
        .pipe(notify({
            message: 'Generated file: <%= file.relative %>'
        }))
        .pipe(sassTimer) // Output time timing of the file creation

});

gulp.task('js', () => {
    var bundleTimer = duration('Browserify + babel bundle');

    return browserify(config.js.src, { debug: true }) // Browserify
        .transform(babelify) // Babel tranforms
        .bundle()
        .on('error', mapError) // Map error reporting
        .pipe(source('main.jsx')) // Set source name
        .pipe(buffer()) // Convert to gulp pipeline
        .pipe(rename(config.js.bundle)) // Rename the output file
        .pipe(sourcemaps.init({ loadMaps: true })) // Extract the inline sourcemaps
        .pipe(sourcemaps.write(config.map)) // Set folder for sourcemaps to output to
        .pipe(gulp.dest(config.dest)) // Set the output folder
        .pipe(notify({
            message: 'Generated file: <%= file.relative %>',
        })) // Output the file being created
        .pipe(bundleTimer) // Output time timing of the file creation
        .pipe(livereload()); // Reload the view in the browser
});

gulp.task('html', () => {
    var htmlTimer = duration('HTML copy');

    return gulp.src(config.html.src)
        .pipe(gulp.dest(config.dest))
        .pipe(notify({
            message: 'Generated file: <%= file.relative %>'
        }))
        .pipe(htmlTimer)
        .pipe(livereload()); // Reload the view in the browser
});

gulp.task('clean:css', ['compile:sass'], () => {
    var cleanTimer = duration('CSS minify');
    var src = path.join(config.dest, config.css.bundle);

    return gulp.src(src)
        .pipe(cleanCSS({ debug: true }, (details) => {
            gutil.log(chalk.yellow(`${src}: ${details.stats.originalSize}`));
            gutil.log(chalk.green(`${src.basename}.min${src.extname}: ${details.stats.minifiedSize}`));
        }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(config.dest))
        .pipe(notify({
            message: 'Generated file: <%= file.relative %>'
        }))
        .pipe(cleanTimer)
        .pipe(livereload()); // Reload the view in the browser
});

gulp.task('clean:js', ['js'], () => {
    var cleanTimer = duration('JS minify');

    return gulp.src(path.join(config.dest, config.js.bundle))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./dist/'))
        .pipe(notify({
            message: 'Generated file: <%= file.relative %>'
        }))
        .pipe(cleanTimer)
        .pipe(livereload()); // Reload the view in the browser
});

gulp.task('clean', [ 'clean:js', 'clean:css']);

gulp.task('lib:css', () => {
    var libTimer = duration('Lib CSS copy');

    return gulp.src(config.css.lib)
        .pipe(gulp.dest(path.join(config.dest, config.lib, 'css')))
        .pipe(notify({
            message: 'Copied file: <%= file.relative %>'
        })) // Output the file being created
        .pipe(libTimer)
        .pipe(livereload()); // Reload the view in the browser
});

gulp.task('lib:js', () => {
    var libTimer = duration('Lib JS copy');

    return gulp.src(config.js.lib)
        .pipe(gulp.dest(path.join(config.dest, config.lib, 'js')))
        .pipe(notify({
            message: 'Copied file: <%= file.relative %>'
        })) // Output the file being created
        .pipe(libTimer)
        .pipe(livereload()); // Reload the view in the browser
});

gulp.task('lib:fonts', () => {
    var libTimer = duration('Lib fonts copy');

    return gulp.src(config.fonts.lib)
        .pipe(gulp.dest(path.join(config.dest, config.lib, 'fonts')))
        .pipe(notify({
            message: 'Copied file: <%= file.relative %>'
        })) // Output the file being created
        .pipe(libTimer)
        .pipe(livereload()); // Reload the view in the browser
});

gulp.task('lib', [ 'lib:js', 'lib:css', 'lib:fonts' ]);

gulp.task('assets', () => {
    var assetsTimer = duration('Assets copy');

    return gulp.src(config.assets.src)
        .pipe(gulp.dest(path.join(config.dest, 'assets')))
        .pipe(notify({
            message: 'Copied file: <%= file.relative %>'
        })) // Output the file being created
        .pipe(assetsTimer)
        .pipe(livereload()); // Reload the view in the browser
});

gulp.task('jshint:src', () => {
    return gulp.src('./src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('jshint:public', () => {
    return gulp.src(config.js.src)
        .pipe(jshint({ linter: require('jshint-jsx').JSXHINT }))
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('jshint:test', () => {
    return gulp.src('./test/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('jshint', [ 'jshint:src', 'jshint:public', 'jshint:test' ]);

gulp.task('test', () => {
    return gulp.src('./test/**/*.test.js')
        .pipe(mocha())
        .pipe(notify({
            message: 'Generated file: <%= file.relative %>'
        })); // Output the file being created
});

// Gulp task for watching file changes
gulp.task('watch', () => {
    livereload.listen(); // Start livereload server

    gulp.watch('./src/**/*.js', [ 'jshint:src', 'test' ]);
    gulp.watch(config.js.watch, [ 'jshint:public', 'clean:js' ]);
    gulp.watch('./test/**/*.js', [ 'jshint:test', 'test' ]);

    gulp.watch(config.js.lib, [ 'lib:js' ]);
    gulp.watch(config.css.lib, [ 'lib:css' ]);
    gulp.watch(config.fonts.lib, [ 'lib:fonts' ]);
    gulp.watch(config.html.watch, [ 'html' ]);
    gulp.watch(config.assets.watch, [ 'assets' ]);

    gulp.watch(config.css.watch, [ 'clean:css' ])
});

gulp.task('default', [ 'jshint', 'clean', 'lib', 'html', 'assets', 'watch' ]);
