var gulp = require('gulp');
var clean = require('gulp-clean');
var ts = require('gulp-typescript');
var server = require('gulp-develop-server');
var browserSync = require('browser-sync').create();

var serverTS = ["src/*.ts", "!node_modules/**", '!bin/**'];

gulp.task('ts', ['clean'], function() {
    return gulp
        .src(serverTS, {base: './'})
        .pipe(ts({ module: 'commonjs', noImplicitAny: true }))
        .pipe(gulp.dest('./'));
});

gulp.task('clean', function () {
    return gulp
        .src([
            'www/build/',
            '!node_modules/**',
            '!gulpfile.js',
            '!bin/**'
        ], {read: false})
        .pipe(clean())
});

gulp.task('server:start', ['ts'], function() {
    server.listen({path: './app.js'}, function(error) {
        console.log(error);
    });
});

gulp.task('server:restart', ['ts'], function() {
    server.restart();
});

gulp.task('serve', ['server:start'], function() {
    gulp.watch(serverTS, ['server:restart']);
});

gulp.task('browser-sync', ['serve'], function() {
	browserSync.init(null, {
        files: ["www/**/*.*"],
        browser: "google chrome",
        port: 7000,
	});
});