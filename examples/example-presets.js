var _progress = require('./main');
var _colors = require('colors');

// helper function to display preset
function showPreset(name){
    console.log(_colors.magenta('Preset: ' + name));

    // create a new progress bar with preset
    var bar = new _progress.Bar({}, _progress.Presets[name] || _progress.Presets.legacy);
    bar.start(200, 0);

    // random value 1..200
    bar.update(Math.floor((Math.random() * 200) + 1));
    bar.stop();
    console.log('');
}

console.log('');
showPreset('legacy');
showPreset('shades_classic');
showPreset('shades_grey');
showPreset('rect');