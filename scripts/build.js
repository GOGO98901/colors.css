/*
* Copyright (c) 2016-2017 Rory Claasen
* The MIT License (MIT)
*/

const program = require('commander');
const util = require('util');
const pkg = require('../package.json');
const endOfLine = require('os').EOL;
const fs = require('fs');

var color = require('../index');

var newWriteStream = function(file, options) {
    if (options === undefined) options = { flags: 'a' };
    if (fs.existsSync(file)) fs.unlinkSync(file);
    return fs.createWriteStream(file, options);
}

color.processColors(function(err, colors) {
    if (err) throw err;
    if (colors != undefined) {
        var less = newWriteStream('dist/colors.less');
        var scss =  newWriteStream('dist/colors.scss');
        var css = newWriteStream('dist/colors.min.css');

        var template = fs.readFileSync('scripts/template.md', 'utf8');
        var readme = newWriteStream('readme.md', { flags: 'w' });

        less.write(color.copyright);
        scss.write(color.copyright);
        css.write(color.copyright);
        readme.write(template);

        for (var key in colors) {
            var data = colors[key];
            less.write(util.format('@%s:%s;%s', data.class, data.color, endOfLine));
            scss.write(util.format('$%s:%s;%s', data.class, data.color, endOfLine));
            css.write(util.format('.gh-%s{color:%s;}', data.class, data.color));
            css.write(util.format('.gh-bg-%s{background-color:%s;}', data.class, data.color));
            readme.write(util.format('![%s](http://www.placehold.it/150/%s/ffffff?text=%s)%s', key, data.color.replace('#', ''), key.split(' ').join('%20'), endOfLine));
        }

        less.end();
        scss.end();
        css.end();
        readme.end();
    }
});