'use strict';

const gulp = require('gulp');
const less = require('gulp-less');
const postcss = require('gulp-postcss');
const mqpacker = require('css-mqpacker');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const cssnano = require('gulp-cssnano');
const responsive = require('gulp-responsive');
const browserSync = require('browser-sync').create();

// Path
const path = {
    www: {
        style: 'www/style/',
        html : 'www/*.html',
        images: 'www/images/'
    },
    src: {
        style: 'src/styles/*.less',
        images: 'src/images/**/*.{jpg,png,jpeg,webp}'
    },
    watch: {
        srcStyle   : 'src/styles/**/*.less',
        buildStyle : 'www/style/*.css',
        html       : 'www/*.html'
    }
}

// Compilation less
function styles() {
    return gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(less()
            .on('error', notify.onError({
                message: '<%= error.fileName %>' +
                '\nLine <%= error.lineNumber %>:' +
                '\n<%= error.message %>',
                title  : '<%= error.plugin %>'
            }))
        )
        .pipe(postcss([
            mqpacker({
                sort: true
            })
        ]))
        .pipe(cssnano())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.www.style));
}
exports.styles = styles;

function images() {
    return gulp.src(path.src.images)
        .pipe(responsive({
            '**/*': {
                width: '100%'
            }
        }, {
            quality: 80,
            progressive: true,
            withMetadata: false,
        }))
        .pipe(gulp.dest(path.www.images))
}
exports.images = images;

function serve() {
    browserSync.init({
        server: "./www"
    });

    gulp.watch([
        path.watch.srcStyle
    ], styles);

    gulp.watch([
        path.watch.html,
        path.watch.buildStyle
    ]).on('change', browserSync.reload);
}

exports.default = gulp.series(
  gulp.parallel(styles, images),
  serve
);