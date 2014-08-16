var connect = require('gulp-connect')
var gulp = require('gulp')
var jshint = require('gulp-jshint')
var mocha = require('gulp-mocha')
var watch = require('gulp-watch')

var sources = ['index.html', 'bower_components/**/*', 'css/*.css', 'js/*.js']

gulp.task('jshint', function() {
  gulp
  .src('js/*.js')
  .pipe(jshint({
    options: {
      asi: true
    }
  }))
})


gulp.task('test', ['jshint'], function() {
  gulp.src("tests/*Spec.js")
  .pipe(mocha({
    reporter: 'tap',
    ui: 'bdd'
  }))
})

gulp.task('serve', ['test'], function() {
  return connect.server({
    root: ['./'],
    livereload: true
  })
})

gulp.task('reload', ['test'], function() {
  return gulp
         .src(sources)
         .pipe(connect.reload())
})

gulp.task('watch', function() {
  return gulp.watch(sources, ['reload'])
})

gulp.task('default', ['serve', 'watch'])