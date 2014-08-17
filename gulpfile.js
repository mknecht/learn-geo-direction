var connect = require('gulp-connect')
var grep = require('gulp-grep-stream')
var gulp = require('gulp')
var gutil = require('gulp-util')
var jshint = require('gulp-jshint')
var mocha = require('gulp-mocha')
var plumber = require('gulp-plumber')
var sass = require('gulp-sass')
var watch = require('gulp-watch')

var sources = ['index.html', 'bower_components/**/*', 'scss/*.scss', 'css/*.css', 'js/*.js']
var testsources = ['js/*.js', 'tests/*.js']



function createMocha() {
  return mocha({
    reporter: 'tap',
    ui: 'bdd'
  })
}


gulp.task('jshint', function() {
  gulp
  .src('js/*.js')
  .pipe(jshint({
    options: {
      asi: true
    }
  }))
})

gulp.task('test', ['build', 'jshint'], function() {
  gulp.src("tests/*Spec.js")
  .pipe(createMocha())
})

gulp.task('serve', ['build', 'test'], function() {
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

gulp.task('sass', function() {
  gulp.src("./scss/*.scss")
  .pipe(sass())
  .pipe(gulp.dest("./css/"))
})

gulp.task('build', ['sass'])

gulp.task('watch', function() {
  return gulp.watch(sources, ['build', 'reload'])
})

gulp.task('watchtest', function() {
  return gulp.src(testsources, {read:false})
         .pipe(watch({emit:'all'}, function(files) {
                 files
                 .pipe(grep('tests/*'))
                 .pipe(mocha(createMocha()))
                 // .on('error', function() {
                 //   if (!/tests? failed/.test(err.stack)) {
                 //     console.log(err.stack);
                 //   }
                 // })
               }))
  })

gulp.task('default', ['serve', 'watch']).on('error', gutil.log)