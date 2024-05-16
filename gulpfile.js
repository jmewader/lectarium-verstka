const gulp = require("gulp");
const browsersync = require("browser-sync").create();
const pug = require("gulp-pug");
const dartSass = require("sass");
const gulpSass = require("gulp-sass");
const del = require("del");
const imagemin = require("imagemin");
const imageminJpegRecompress = require("imagemin-jpeg-recompress");
const imageminPng = require("imagemin-pngquant");
const imageminWebp = require("imagemin-webp");

const sass = gulpSass(dartSass);

const path = {
  html: {
    src: "src/*.html",
    dest: "dist/",
  },
  pug: {
    src: "src/pug/**/*.pug",
    dest: "dist/app/",
  },
  sass: {
    src: "src/sass/**/*.scss",
    dest: "dist/app/css/",
  },
  fonts: {
    src: "src/fonts/**/*.*",
    dest: "dist/app/fonts/",
  },
  img: {
    src: "src/img/**/*.*",
    dest: "dist/app/img",
  },
};

function cleanTask() {
  return del(["dist"]);
}

function htmlTask() {
  return gulp.src(path.html.src).pipe(pug()).pipe(gulp.dest(path.html.dest)).pipe(browsersync.stream());
}

function pugTask() {
  return gulp.src(path.pug.src).pipe(pug()).pipe(gulp.dest(path.pug.dest)).pipe(browsersync.stream());
}

function sassTask() {
  return gulp.src(path.sass.src).pipe(sass()).pipe(gulp.dest(path.sass.dest)).pipe(browsersync.stream());
}

function fontsTask() {
  return gulp.src(path.fonts.src, { encoding: false }).pipe(gulp.dest(path.fonts.dest)).pipe(browsersync.stream());
}

function imgTask() {
  return imagemin([path.img.src], {
    destination: path.img.dest,
    plugins: [
      imageminJpegRecompress({ quality: "high" }),
      imageminPng({ quality: [0.6, 0.8] }),
      // imageminWebp({ quality: 50 }), // конвертация в WebP
      imageminPng(),
    ],
  })
    .then((files) => {
      console.log("Images optimized:", files);
    })
    .catch((error) => {
      console.error("Image optimization error:", error);
    });
}

function watchTask() {
  return gulp.series(cleanTask, gulp.parallel(htmlTask, pugTask, sassTask, fontsTask, imgTask), function () {
    browsersync.init({
      server: {
        baseDir: "dist",
        directory: true,
        index: "index.html",
        notify: false,
      },
      files: ["dist/**/*"],
      reloadDebounce: 1000,
    });
    gulp.watch(path.pug.src, pugTask);
    gulp.watch(path.sass.src, sassTask);
    gulp.watch(path.img.src, imgTask);
  })();
}
const build = gulp.series(cleanTask, gulp.parallel(htmlTask, pugTask, sassTask, fontsTask, imgTask), watchTask);

exports.clean = cleanTask;
exports.html = htmlTask;
exports.pug = pugTask;
exports.sass = sassTask;
exports.fonts = fontsTask;
exports.img = imgTask;
exports.watch = watchTask;
exports.build = build;
exports.default = build;
