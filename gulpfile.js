

var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache');
var minifycss = require('gulp-minify-css');
var less = require('gulp-less');
var browserSync = require('browser-sync');

var folderSecurity = "security/";
var folder911 = "911videos/";
var folderBase = "base/";
var styles911 = folder911 + "resources/css/";
var stylesSecurity = folderSecurity + "resources/css/";
var stylesBase = folderBase + "resources/css/";
var scripts911 = [folder911 + "*.js", folder911 + "resources/js/**/*.js"];
var scriptsSecurity = [folderSecurity + "*.js", stylesSecurity + "resources/js/**/*.js"];
var scriptsBase = [folderBase + "*.js", folderBase + "resources/js/**/*.js"];

var styles911dest = folder911 +  "resources/css/dist/";
var stylesSecuritydest = folderSecurity +  "resources/css/dist/";
var stylesBasedest = folderBase + "resources/css/dist/";
var scripts911dest = folder911 + "resources/prod/js/dist/";
var scriptsSecuritydest = folderSecurity + "resources/prod/js/dist/";
var scriptsBaesedest = folderBase + "resources/prod/js/dist/";


gulp.task('browser-sync', function() {
  browserSync({
    port: 3005,
    proxy: "http://localhost:3000",
    files: ["*"],
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('911Styles', function(){
  gulp.src([styles911 + '*.less'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(less())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest(styles911dest))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest(styles911dest))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('securityStyles', function(){
  gulp.src([stylesSecurity + '*.less'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(less())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest(stylesSecuritydest))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest(stylesSecuritydest))
    .pipe(browserSync.reload({stream:true}))
});


gulp.task('baseStyles', function(){
  gulp.src([ baseStyles + '*.less'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(less())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest(stylesBasedest))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest(stylesBasedest))
    .pipe(browserSync.reload({stream:true}))
});



gulp.task('911Scripts', function(){

    return gulp.src(scripts911)
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(scripts911dest))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(scripts911dest))
    .pipe(browserSync.reload({stream:true}))

})

gulp.task('securityScripts', function(){

    return gulp.src(scriptsSecurity)
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(scriptsSecuritydest))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(scriptsSecuritydest))
    .pipe(browserSync.reload({stream:true}))

})

gulp.task('baseScripts', function(){

     return gulp.src(scriptsBase)
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(scriptsBaesedest))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(scriptsBaesedest))
    .pipe(browserSync.reload({stream:true}))

})



gulp.task('default', ['browser-sync'], function(){

  //gulp.watch(folder911 + "**/*.js", ['911Scripts']);
  gulp.watch(folderBase + "**/*.js", ['baseScripts']);
  gulp.watch(styles911 + '*.less' , ['911Styles']);
  gulp.watch(stylesSecurity + '*.less' , ['securityStyles']);
  gulp.watch(stylesBase + '*.less' , ['baseStyles']);
  gulp.watch(["**/*.html", "**/*.js", "**/*.css", "**/*.less"], ['bs-reload']);

});
