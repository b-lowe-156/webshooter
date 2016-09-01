var gulp = require('gulp');
var clean = require('gulp-clean');
var ts = require('gulp-typescript');
var server = require('gulp-develop-server');
var browserSync = require('browser-sync').create();

var serverTS = ["**/*.ts", "!node_modules/**", '!bin/**'];

gulp.task('ts', function() {
    return gulp
        .src(serverTS, {base: './'})
        .pipe(ts({ module: 'commonjs', noImplicitAny: true }))
        .pipe(gulp.dest('./'));
});

gulp.task('clean', function () {
    return gulp
        .src([
            'app.js',
            '**/*.js',
            '**/*.js.map',
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
		proxy: "http://localhost:5000",
        files: ["www/**/*.*"],
        browser: "google chrome",
        port: 8080,
	});
});