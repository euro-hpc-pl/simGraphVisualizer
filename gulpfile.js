/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const gulp = require('gulp');
const less = require('gulp-less');
const path = require('path');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const sass = require('gulp-sass')(require('sass'));
const del = require('del');

const srcfiles = [
    "./src/Cookies.js",
    "./src/Settings.js",
    "./src/helpers.js",
    "./src/SVG.js",
    "./src/Dispatcher.js",
    "./src/SPS.js",
    "./src/GraphDescr.js",
    "./src/TempGraphStructure.js",
    "./src/label.js",
    "./src/node.js",
    "./src/edge.js",
    "./src/QbDescr.js",
    "./src/graph.js",
    "./src/chimera.js",
    "./src/pegasus.js",
    "./src/UI.js",
    "./src/GenericWindow.js",
    "./src/SimGraphVisualizer.js",
    "./src/parserTXT.js",
    "./src/parserGEXF.js",
    "./src/FileIO.js",
    "./src/ScopePanel.js",
    "./src/SlidersPanel.js",
    "./src/dlgCPL.js",
    "./src/dlgConsole.js",
    "./src/dlgCellView.js",
    "./src/dlgCreateGraph.js",
    "./src/dlgEdgeProperties.js",
    "./src/dlgNodeProperties.js",
    "./src/dlgAlternateFileSave.js",
    "./src/dlgMissingNodes.js",
    "./src/dlgAbout.js",
    "./src/dlgLoaderSplash.js",
    "./src/dlgEditSettings.js",
    "./src/ElectronInterface.js"
];

const dstdir = "./public_html/js/";
const dstfile = "sgv.js";

//gulp.task('copyToElectron', function() {
//    return gulp.src('./public_html/**/*.{html,js,map,css,jpg,gif,ico,gif,png}')
//        .pipe(gulp.dest('./electronApp/views/home/'));
//});

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

//gulp.task('recompile-CSS', () => {
//    return gulp.src('./public_html/scss/**/*.scss')
//        .pipe(sass().on('error', sass.logError))
//        .pipe(gulp.dest('./public_html/css/'));
//});

//gulp.task('build', gulp.series('merge', 'minimize', 'copyToElectron'));
gulp.task('build', gulp.series('merge', 'minimize'));

gulp.task('clean', function() {
    return del([dstdir+"*.*"]);
});

gulp.task('clean-build', gulp.series('clean', 'build'));
