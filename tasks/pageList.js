// =========================================================
// Gulp Task: pageList
// =========================================================

let projectName = 'Лектариум';

let path = {build: {html: 'dist/app/pages/'}},
    glob = require('glob'),
    fs = require('fs');

module.exports = (gulp, plugins) => {
    let files = glob.sync(path.build.html + '**/*.html'), ol = "<ol>";

    return gulp.src(path.build.html + 'index.html')
        .pipe(plugins.replace(/<div id="update-this"><\/div>/g, match => {

            files.map(file => {

                var fileHref = file.replace('dist', '')

                var content = fs.readFileSync(file, 'utf8');

                var fileName = content.match(/<title>(.*?)<\/title>/g).toString().replace(/<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?>/g, '');


                if (fileHref.indexOf('index.html') === -1)
                    ol += `<li><a href="${fileHref}" target="_blank">${fileName}</a></li>`

            })

            ol += "</ol>";

            return ol;
        }))
        .pipe(plugins.replace(/#project/g, match => {
            return projectName;
        }))
        .pipe(gulp.dest(path.build.html))
};
