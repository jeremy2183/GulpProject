var gulp = require('gulp');
var $ = require('gulp-load-plugins')();  //可省略require('gulp-xxx')
// var jade = require('gulp-jade');
// var sass = require('gulp-sass');
// var plumber = require('gulp-plumber');  //監控時，程式出錯不會停止的繼續往下run
// var postcss = require('gulp-postcss');  //強大的css後處理器
var autoprefixer = require('autoprefixer'); //為css補上前綴詞

gulp.task('copyHTML', function(){
    return gulp.src('./source/**/*.html')
      .pipe(gulp.dest('./public/'))   //輸出到該位置
})

gulp.task('jade', function () {
  // var YOUR_LOCALS = {};
  gulp.src('./source/**/*.jade')
    .pipe($.plumber())  //出錯繼續做下去
    .pipe($.jade({
      pretty: true  //是否美化排版、不壓縮(true)
    }))
    .pipe(gulp.dest('./public/'))
});

gulp.task('sass', function () {
  var plugins = [
    autoprefixer({
      browsers: ['last 2 version', '> 5%', 'ie 8']
    })
  ];

  return gulp.src('./source/scss/**/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass().on('error', $.sass.logError))
    //編譯完成 CSS
    .pipe($.postcss(plugins))
     .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('babel', () => {
  return gulp.src('./source/js/**/*.js')
  .pipe($.sourcemaps.init())
  .pipe($.babel({
    // presets: ['@babel/env']
    presets: ['es2015']
  }))
  .pipe($.concat('all.js'))
  .pipe($.sourcemaps.write('.'))
  .pipe(gulp.dest('./public/js'));
});

gulp.task('watch', function(){
  gulp.watch('./source/scss/**/*.scss', ['sass']); //['sass']:有任何變動將執行sass指令
  gulp.watch('./source/**/*.jade', ['jade']);
  gulp.watch('./source/js/**/*.js', ['babel']);
});

gulp.task('default',['jade','sass','babel','watch']); //將所以任務移到default，並依序執行