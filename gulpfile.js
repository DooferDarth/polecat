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

var sass = require('gulp-sass');
var concat = require('gulp-concat');
var merge = require('merge-stream');
var cleanCSS = require('gulp-clean-css');
var path = require('path');

// Configuration for Gulp
var config = {
    js: {
        src: './public/js/main.jsx',
        watch: ['./public/js/**/*.jsx', './public/js/**/*.js'],
        outputDir: './dist',
        outputFile: 'bundle.js'
    },
    css: {
        src: [ './public/**/*.scss', './public/**/*.css' ],
        watch: [ './public/scss/**/*.scss', './public/css/**/*.css' ],
        outputDir: './dist',
        outputFile: 'bundle.css',
        outputMinFile: 'bundle.min.css'
    }
};

// Error reporting function
function mapError(err) {
    if (err.fileName) {
        // Regular error
        gutil.log(chalk.red(err.name)
            + ': ' + chalk.yellow(err.fileName.replace(__dirname + '/src/js/', ''))
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

// Completes the final file outputs
function bundle(bundler) {
    var bundleTimer = duration('Javascript bundle time');

    bundler
        .bundle()
        .on('error', mapError) // Map error reporting
        .pipe(source('main.jsx')) // Set source name
        .pipe(buffer()) // Convert to gulp pipeline
        .pipe(rename(config.js.outputFile)) // Rename the output file
        .pipe(sourcemaps.init({ loadMaps: true })) // Extract the inline sourcemaps
        .pipe(sourcemaps.write('map')) // Set folder for sourcemaps to output to
        .pipe(gulp.dest(config.js.outputDir)) // Set the output folder
        .pipe(notify({
            message: 'Generated file: <%= file.relative %>',
        })) // Output the file being created
        .pipe(bundleTimer) // Output time timing of the file creation
        .pipe(livereload()); // Reload the view in the browser
}

function buildSass() {
    var sassTimer = duration('Sass compile, bundle, and minify');

    return gulp.src(config.css.src, { base: 'public' })
        // .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(concat(config.css.outputFile))
        .pipe(gulp.dest(config.css.outputDir))
        .pipe(notify({
            message: 'Generated file: <%= file.relative %>'
        }))
        .pipe(cleanCSS({ debug: true }, (details) => {
            gutil.log(chalk.yellow(`${config.css.outputDir}/${path.basename(details.name)}': ${details.stats.originalSize}`));
            gutil.log(chalk.green(`${config.css.outputDir}/${path.basename(details.name, '.css')}.min${path.extname(details.name)}: ${details.stats.minifiedSize}`));
        }))
        // .pipe(sourcemaps.write('map'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(config.css.outputDir))
        .pipe(notify({
            message: 'Generated file: <%= file.relative %>'
        }))
        .pipe(sassTimer)// Output time timing of the file creation
        .pipe(livereload()); // Reload the view in the browser
}

gulp.task('sass', buildSass);


gulp.task('js', () => {
    var bundler = browserify(config.js.src, { debug: true }) // Browserify
        .transform(babelify, {presets: ['es2015', 'react']}); // Babel tranforms

    bundle(bundler);
});

// Gulp task for watching file changes
gulp.task('watch', () => {
    livereload.listen(); // Start livereload server

    var args = objMerge(watchify.args, { debug: true }); // Merge in default watchify args with browserify arguments

    var bundler = browserify(config.js.src, args) // Browserify
        .plugin(watchify, {ignoreWatch: ['**/node_modules/**', '**/bower_components/**']}) // Watchify to watch source file changes
        .transform(babelify, {presets: ['es2015', 'react']}); // Babel tranforms

    bundle(bundler); // Run the bundle the first time (required for Watchify to kick in)

    bundler.on('update', function() {
        bundle(bundler); // Re-run bundle on source updates
    });


    gulp.watch(config.css.watch, ['sass'])
});
