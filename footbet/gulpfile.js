const gulp = require('gulp');
const concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssMin = require('gulp-css');

const paths = {
    nodeModules: './node_modules/',
    scriptsDest: './Scripts/',
    contentDest: './Content/'
};


gulp.task('copy:vendor:js', () => {
    const javascriptToCopy = [
        `${paths.nodeModules}toastr/build/toastr.min.js`,
        `${paths.nodeModules}jquery/dist/jquery.min.js`,
        `${paths.nodeModules}angular/angular.min.js`,
        `${paths.nodeModules}angularjs-toaster/toaster.min.js`,
        `${paths.nodeModules}angular-animate/angular-animate.min.js`,
        `${paths.nodeModules}bootstrap/dist/js/bootstrap.min.js`,
        `${paths.nodeModules}angular-resource/angular-resource.min.js`,
        `${paths.nodeModules}angular-i18n/angular-locale_no-no.js`
    ];

    return gulp.src(javascriptToCopy)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(`${paths.contentDest}`));
});

gulp.task('copy:bundle:js', () => {
    const javascriptToCopy = [
        `${paths.scriptsDest}built/services/BetBaseController.js`,
        `${paths.scriptsDest}built/services/LeaderBoardService.js`,
        `${paths.scriptsDest}built/services/LeagueService.js`,
        `${paths.scriptsDest}built/services/ResultPageService.js`,
        `${paths.scriptsDest}built/services/BetService.js`,
        `${paths.scriptsDest}built/services/UserBetService.js`,
        `${paths.scriptsDest}built/services/TodaysGamesService.js`,
        `${paths.scriptsDest}built/app.js`,
        `${paths.scriptsDest}built/controllers/BetController.js`,
        `${paths.scriptsDest}built/controllers/LeaderBoardController.js`,
        `${paths.scriptsDest}built/controllers/LeagueController.js`,
        `${paths.scriptsDest}built/controllers/ResultController.js`,
        `${paths.scriptsDest}built/controllers/TodaysGamesController.js`,
        `${paths.scriptsDest}built/controllers/UserBetController.js`,
        `${paths.scriptsDest}built/controllers/ResultPageController.js`,
        `${paths.scriptsDest}built/viewModels/ViewModels.js`
    ];

    return gulp.src(javascriptToCopy)
        .pipe(uglify())
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest(`${paths.contentDest}`));
});

gulp.task('css:minify', function(){
    const cssToCopy = [
        `${paths.contentDest}bootstrap-responsive.css`,
        `${paths.contentDest}bootstrap.css`,
        `${paths.contentDest}flags.css`,
        `${paths.contentDest}navbars.css`,
        `${paths.contentDest}Site.css`,
        `${paths.contentDest}soccertable.css`,
        `${paths.contentDest}toaster.css`,
        `${paths.nodeModules}font-awesome/css/font-awesome.css`
    ];
    return gulp.src(cssToCopy)
        .pipe(cssMin())
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(`${paths.contentDest}/css`));
});


gulp.task('default', ['copy:bundle:js', 'copy:vendor:js', 'css:minify']);
