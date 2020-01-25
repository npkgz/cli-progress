const _progress = require('../cli-progress');

// create a new progress bar with preset
const bar = new _progress.Bar({
    // green bar, reset styles after bar element
    format: ' >> [\u001b[32m{bar}\u001b[0m] {percentage}% | ETA: {eta}s | {value}/{total}',

    // same chars for bar elements, just separated by colors
    barCompleteChar: '#',
    barIncompleteChar: '#',

    // change color to yellow between bar complete/incomplete -> incomplete becomes yellow
    barGlue: '\u001b[33m'
});
bar.start(200, 0);

// random value 1..200
bar.update(Math.floor((Math.random() * 200) + 1));
bar.stop();
