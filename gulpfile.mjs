import gulp from 'gulp';
const { src, dest, watch, series } = gulp;

// Dependencias de CSS - SASS.
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
const sass = gulpSass(dartSass);
import sourcemaps from 'gulp-sourcemaps';
import cssnano from 'cssnano';

// Dependencias de imágenes.
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import avif from 'gulp-avif';

export const css = (done) => {
    // Compilar SASS.
    // Pasos: 1.- Identificar archivo. 2.- Compilarlo. 3.- Guardarlo.
    src('src/scss/app.scss') // 1.
        .pipe( sourcemaps.init() )
        .pipe( sass( {outputStyle: 'expanded'} ) ) // 2.
        .pipe( postcss( [ autoprefixer(), cssnano ] ) )
        .pipe( sourcemaps.write('.') )
        .pipe( dest('build/css') ) // 3.

    done();
};

export const imagenes = () => {
    return  ( 
        src('src/img/**/*')
            .pipe( imagemin({ optimizationLevel: 3 }) )
            .pipe( dest('build/img') )
    );
};

export const convertirWebp = () => {
    const opciones = {
        quality: 50
    };
    return  ( 
        src('src/img/**/*.{png,jpg}')
            .pipe( webp( opciones ) )
            .pipe( dest('build/img') )
    );
};

export const convertirAvif = () => {
    const opciones = {
        quality: 50
    };
    return  ( 
        src('src/img/**/*.{png,jpg}')
            .pipe( avif( opciones ) )
            .pipe( dest('build/img') )
    );
};

export const dev = () => {
    // Utilizamos un watch para estar atentos a los cambios que
    // se produzcan en el archivo .sass para compilarlos 
    // y reflejarlos y en pantalla.
    watch('src/scss/**/*.scss', css);
    watch('src/img/**/*', imagenes);
};

export default series( imagenes, convertirWebp, css, dev );