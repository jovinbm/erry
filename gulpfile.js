const gulp  = require('gulp');
const babel = require('gulp-babel');

gulp.task('build', () => {
  
  const DEST = 'build';
  
  const paths = [
    'src/**/*.js'
  ];
  
  return gulp.src(paths)
    .pipe(babel())
    .pipe(gulp.dest(DEST));
  
});

gulp.task('default', ['build']);