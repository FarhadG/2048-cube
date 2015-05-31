/**
 * Dependencies
 */
var gulp = require('gulp');
var log = require('gulp-util').log;
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var data = require('gulp-data');
var webserver = require('gulp-webserver');
var opn = require('opn');

/**
 * Configurations
 */
var config = {
    watch: './src/**/**',
    server: {
        host: 'localhost',
        port: '2048',
        path: '/dist'
    },
    html: {
        src: './src/index.html',
        destination: 'dist/'
    },
    css: {
        src: './src/styles/main.scss',
        destination: 'dist/css'
    },
    js: {
        src: './src/js/**/**',
        destination: 'dist/js'
    }
};

/**
 * Webserver up and running
 */
gulp.task('webserver', function() {
    gulp.src('.')
        .pipe(webserver({
            host: config.server.host,
            port: config.server.port,
            livereload: true,
            directoryListing: false
        }));
});

/**
 * Open the browser
 */
gulp.task('openbrowser', function() {
    opn('http://'+ config.server.host +':'+ config.server.port + config.server.path);
});

/**
 * Template task (optional to change the name of the file)
 */
gulp.task('templates', function() {
    gulp.src(config.html.src)
        .pipe(plumber())
        .pipe(rename('index.html'))
        .pipe(gulp.dest(config.html.destination));
});

/**
 * Stylus task (optional to change the name of the file)
 */
gulp.task('styles', function() {
   gulp.src(config.css.src)
       .pipe(plumber())
       .pipe(sass().on('error', sass.logError))
       .pipe(rename('style.css'))
       .pipe(gulp.dest(config.css.destination));
});

/**
 * Javascript task
 */
gulp.task('scripts', function() {
    gulp.src(config.js.src)
        .pipe(plumber())
        .pipe(gulp.dest(config.js.destination));
});

/**
 * Watch task
 */
gulp.task('watch', function() {
    log('Watching files');
    gulp.watch(config.watch, ['build']);
});

/**
 * Command line task commands
 */
gulp.task('build', ['templates', 'styles', 'scripts']);
gulp.task('default', ['build', 'webserver', 'watch', 'openbrowser']);
