const {src, dest, watch, parallel, series} = require('gulp'),
      // autoprefixer = require('gulp-autoprefixer'),
      connect =   require('gulp-connect'),
      sass =      require('gulp-sass'),
      rename =    require('gulp-rename'),
      sourceMaps = require('gulp-sourcemaps'),
      stripComments = require('gulp-strip-comments');
      // concatCss = require('gulp-concat-css');

function connectTask(done) {
    connect.server({
        root: 'build',
        port: 8092,
        livereload: true
    }, function () {
        this.server.on('close', done);
    });
}

function reloadTask(done) {
    src('views/index.html')
        .pipe(stripComments())
        .pipe(dest('build'))
        .pipe(connect.reload());
    done();
}

/*function jsTask(done) {
    src('scripts-source/scripts.js')
        .pipe(dest('build/scripts'))
        .pipe(connect.reload());
    done();
}*/

function cssTask() {
    return src('style-source/main.scss')
        .pipe(sourceMaps.init())
        .pipe(sass().on('error', sass.logError))
        /*.pipe(autoprefixer({
           browsers: ['last 15 versions'],
           cascade: false
        }))*/
        .pipe(sourceMaps.write())
        .pipe(rename('main.css'))
        .pipe(dest('build'))
        // .pipe(dest('style-source/css'));
        .pipe(connect.reload());
}

/*function concatCssTask() {
    return src(['style-source/css/orig.css', 'style-source/css/main.css'])
        .pipe(concatCss("style.css"))
        .pipe(dest('build'))
        .pipe(connect.reload());
}*/

function watchTask() {
    watch(['style-source/main.scss'], cssTask);
    // gulp.watch('scripts-source/!*.js', ['js']);
    // gulp.watch('build/img/!*.*', ['reload']);
    // gulp.watch('build/fonts/!*.*', ['reload']);
    watch('views/index.html', reloadTask);
    // watch('scripts-source/scripts.js', jsTask);
}

exports.style = cssTask;
exports.default = parallel(connectTask, reloadTask, cssTask, watchTask);
