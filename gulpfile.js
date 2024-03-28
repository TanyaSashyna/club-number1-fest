// @todo Add styles uglify

const
  argv = require('yargs').argv,
  autoprefixer = require('gulp-autoprefixer'),
  browserSync = require('browser-sync').create(),
  concat = require('gulp-concat'),
  critical = require('critical').stream,
  del = require('del'),
  filter = require('gulp-filter'),
  gulp = require('gulp'),
  gulpif = require('gulp-if'),
  imagemin = require('gulp-imagemin'),
  inject = require('gulp-inject'),
  plumber = require('gulp-plumber'),
  rename = require('gulp-rename'),
  rtlcss = require('gulp-rtlcss'),
  runSequence = require('run-sequence'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  wait = require('gulp-wait')
  uglify = require('gulp-uglify');

const path = {
  devStyles: 'dev/styles',
  distStyles: 'dist/css',
  devScripts: 'dev/scripts',
  distScripts: 'dist/js',
  devImages: 'dev/img',
  distImages: 'dist/img'
};

const imgExp = '/**/*.+(png|jpg|jpeg|gif|svg)';

const rtl = argv.rtl;

function errorHandler(err) {
  console.log(err);
  this.emit('end');
}

/* ========================================================================= */

////////////
// STYLES //
////////////
gulp.task('styles:inject', () => {
  let
    target = gulp.src(`${path.devStyles}/main.scss`),
    sources = gulp.src([
      `${path.devStyles}/vendors/index.scss`,
      `${path.devStyles}/vendors/*.scss`,

      `${path.devStyles}/fonts/index.scss`,

      `${path.devStyles}/common/index.scss`,

      `${path.devStyles}/components/index.scss`,
      `${path.devStyles}/components/*.scss`,

      `${path.devStyles}/blocks/index.scss`,
      `${path.devStyles}/blocks/*.scss`,

      `${path.devStyles}/layout/index.scss`,
      `${path.devStyles}/layout/*.scss`,

      `${path.devStyles}/themes/index.scss`,
      `${path.devStyles}/themes/*.scss`,

      `${path.devStyles}/helpers.scss`,

      `!${path.devStyles}/*/_*.scss`,
    ], {
      read: false
    });

  return target
    .pipe(inject(sources, {
      relative: true
    }))
    .pipe(gulp.dest(path.devStyles));
});

gulp.task('styles:compile', () => {
  return gulp
    .src(`${path.devStyles}/main.scss`)
    .pipe(wait(500))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed' // expanded, compressed
    }).on('error', sass.logError))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest(path.distStyles))

    // rtl styles
    .pipe(gulpif(rtl, filter(['**/*.css'])))
    .pipe(gulpif(rtl, rtlcss()))
    .pipe(gulpif(rtl, rename({suffix: '-rtl'})))
    .pipe(gulpif(rtl, gulp.dest(path.distStyles)));
});

gulp.task('styles:prefix', () => {
  return gulp
    .src(`${path.distStyles}/*.css`)
    .pipe(autoprefixer({
      browsers: ['last 3 versions', 'ie >= 9', 'iOS >= 6', 'Android >= 4']
    }))
    .pipe(gulp.dest(path.distStyles));
});

gulp.task('styles', (done) => {
  runSequence('styles:inject', 'styles:compile', 'styles:prefix', done);
});

gulp.task('critical', () => {
  return gulp
    .src('dist/*.html')
    .pipe(critical({base: 'dist/', inline: true, css: ['dist/css/main.css']}))
    .on('error', (err) => { console.log(err.message); })
    .pipe(gulp.dest('dist'));
});

////////////
// SERVER //
////////////
gulp.task('bs:init', () => {
  browserSync.init({
    server: 'dist',
    ghostMode: false
  });
});

gulp.task('bs:init-ghost', () => {
  browserSync.init({
    server: 'dist'
  });
});

gulp.task('bs:reload', () => {
  browserSync.reload();
});

gulp.task('bs:reload-css', () => {
  browserSync.reload(`${path.distStyles}/main.css`);
});

/////////////
// SCRIPTS //
/////////////
gulp.task('scripts:concat', () => {
  return gulp
    .src([
      `${path.devScripts}/_first.js`,
      `${path.devScripts}/libs/*.js`,
      `${path.devScripts}/vendors/*.js`,
      `${path.devScripts}/_last.js`
    ])
    .pipe(plumber({
      errorHandler: errorHandler
    }))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(path.distScripts));
});

gulp.task('scripts:uglify', () => {
  return gulp
    .src(`${path.distScripts}/main.js`)
    .pipe(plumber({
      errorHandler: errorHandler
    }))
    .pipe(uglify())
    .pipe(gulp.dest(path.distScripts));
});

gulp.task('scripts', (done) => {
  runSequence('scripts:concat', 'scripts:uglify', done);
});

////////////
// IMAGES //
////////////
gulp.task('images:del', () => {
  return del.sync([`${path.distImages}/**`, `!${path.distImages}`]);
});

gulp.task('images:copy', ['images:del'], () => {
  return gulp
    .src(path.devImages + imgExp)
    .pipe(gulp.dest(path.distImages));
});

gulp.task('images:min', () => {
  return gulp
    .src(path.distImages + imgExp)
    .pipe(imagemin()) 
    .pipe(gulp.dest(path.distImages));
});

gulp.task('images', (done) => {
  runSequence('images:copy', 'images:min', done);
});

///////////
// WATCH //
///////////
gulp.task('watch', () => {
  gulp.watch([
    `${path.devStyles}/**/*.scss`,
    `!${path.devStyles}/main.scss`
  ], (e) => {
    let tasks = ['styles:compile', 'bs:reload-css'];

    if(e.type === 'added' || e.type === 'deleted') {
      tasks.unshift('styles:inject');
    }

    runSequence.apply(null, tasks);
  });
  gulp.watch(`${path.devScripts}/**/*.js`, ['scripts:concat']);
  gulp.watch(path.devImages + imgExp, ['images:copy']);
  // gulp.watch(path.devScripts + '/**/*.js', ['scripts:concat', 'bs:reload']);
  // gulp.watch('dist/*.html', ['bs:reload']);
});

/* ========================================================================= */

gulp.task('default', (done) => {
  runSequence(
    'styles:inject',
    ['scripts:concat', 'styles:compile', 'bs:init', 'watch'],
    done
  );
});

gulp.task('dist', ['styles', 'scripts:uglify', 'images:min', 'critical']);
