/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var del = require('del');

var srcfiles = [
    "./src/Dispatcher.js",
    "./src/SPS.js",
    "./src/helpers.js",
    "./src/label.js",
    "./src/node.js",
    "./src/edge.js",
    "./src/QbDescr.js",
    "./src/graph.js",
    "./src/chimera.js",
    "./src/pegasus.js",
    "./src/UI.js",
    "./src/SimGraphVisualizer.js",
    "./src/parserTXT.js",
    "./src/parserGEXF.js",
    "./src/FileIO.js",
    "./src/dlgCPL.js",
    "./src/dlgConsole.js",
    "./src/dlgModuleView.js",
    "./src/dlgCreateGraph.js",
    "./src/dlgEdgeProperties.js",
    "./src/dlgNodeProperties.js",
    "./src/dlgAlternateFileSave.js",
    "./src/dlgMissingNodes.js",
    "./src/dlgAbout.js",
    "./src/dlgLoaderSplash.js"
];

var dstdir = "./public_html/js/";
var dstfile = "sgv.js";

gulp.task('copyToElectron', function() {
    return gulp.src(dstdir+dstfile)
        .pipe(gulp.dest('../desktopSGV/views/home/js'));
});

gulp.task('minimize', function() {
    return gulp.src(dstdir+dstfile)
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(dstdir));
});

gulp.task('merge', function () {
    return gulp.src(srcfiles)
        .pipe(concat(dstfile))
        .pipe(gulp.dest(dstdir));
});

gulp.task('build', gulp.series('merge', 'minimize', 'copyToElectron'));

gulp.task('clean', function() {
    return del([dstdir+"*.*"]);
});

gulp.task('clean-build', gulp.series('clean', 'build'));
