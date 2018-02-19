'use strict';

const gulp          = require('gulp');

const less          = require('gulp-less');
const postcss       = require('gulp-postcss');
const mqpacker      = require('css-mqpacker');
const sourcemaps    = require('gulp-sourcemaps');

const browserSync   = require('browser-sync').create();

// Path
const path = {
    www: {
        style: 'www/style/',
        html : 'www/*.html'
    },
    src: {
        style: 'src/styles/*.less'
    },
    watch: {
        srcStyle   : 'src/styles/**/*.less',
        buildStyle : 'www/style/*.css',
        html       : 'www/*.html'
    }
}

// Compilation less
gulp.task('less', function () {
    return gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(postcss([
            mqpacker({
                sort: true
            })
        ]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.www.style));
});

// Static Server + watching less files
gulp.task('serve', ['less'], function() {

    browserSync.init({
        server: "./www"
    });

    gulp.watch(path.watch.srcStyle, ['less']);
    gulp.watch([path.watch.html, path.watch.buildStyle]).on('change', browserSync.reload);
});