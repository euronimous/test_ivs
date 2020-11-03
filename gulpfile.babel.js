/**
 * Created by jair on 08/10/16.
 */

'use strict';
import gulp from 'gulp';
import babel from 'gulp-babel';
import path from 'path';
import clean from 'gulp-clean';
import webpackstream from 'webpack-stream';
import webpackconfig from './webpack.config.js';

const paths = {
  PUBLIC: ['src/public/**/*'],
  SERVER_SRC: 'src/server/**/*.js',
  CLIENT_SRC: ['src/client/**/*.js', 'src/client/**/*.jsx'],
  DIST: 'dist'
};

gulp.task('clean', () => {
  gulp.src(paths.DIST)
    .pipe(clean());
});

gulp.task('public', () => {
  gulp.src(paths.PUBLIC)
    .pipe(gulp.dest(path.join(paths.DIST, 'public')));
});

gulp.task('pack-server', () => {
  gulp.src(paths.SERVER_SRC)
    .pipe(babel())
    .pipe(gulp.dest(paths.DIST));

});

gulp.task('pack-client', () => {
  gulp.src(paths.CLIENT_SRC)
    .pipe(webpackstream(webpackconfig))
    .pipe(gulp.dest(paths.DIST));
});

gulp.task('pack', ['pack-server', 'pack-client', 'public']);

gulp.task('watch', () => {
  gulp.watch(paths.PUBLIC, ['public']);
  gulp.watch(paths.SERVER_SRC, ['pack-server']);
  gulp.watch(paths.CLIENT_SRC, ['pack-client']);
});

gulp.task("default", ['pack']);
