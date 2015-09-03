var gulp       = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var ts         = require('gulp-typescript');
var babel      = require('gulp-babel');
var del        = require('del');

var tsProject = ts.createProject('./tsconfig.json');

gulp.task('default', function() {
  return gulp.src(['src/**/*.ts', 'src/index.ts'])
                           .pipe(sourcemaps.init())
                           .pipe(ts(tsProject))
                           .pipe(babel())
                           .pipe(sourcemaps.write())
                           .pipe(gulp.dest('release'));
                           });

gulp.task('clean', function(){
  return del([
    'release/**/*',
    'release/*',
  ]);
});
