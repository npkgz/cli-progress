const _progress = require('../cli-progress');

const files = {
    'eta.js        ': 187,
    'generic-bar.js': 589,
    'multi-bar.js  ': 5342,
    'options.js    ': 42,
    'single-bar.js ': 2123,
    'terminal.js   ': 4123
};
const bars = [];

// create new container
const multibar = new _progress.MultiBar({
    format: ' {bar} | "{file}" | {value}/{total}',
    hideCursor: true,
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',

    // only the bars will be cleared, not the logged content
    clearOnComplete: true,
    stopOnComplete: true,

    // important! redraw everything to avoid "empty" completed bars
    forceRedraw: true
});

console.log("Downloading files..\n");

// add bars
for (const filename in files){
    const size = files[filename];

    bars.push(multibar.create(size, 0, {file: filename}));
}

const timer = setInterval(function(){

    // increment
    for (let i=0; i<bars.length;i++){
        const bar = bars[i];

        // download complete ?
        if (bar.value < bar.total){
            bar.increment();
        }
    }

    // progress bar running ?
    // check "isActive" property in case you've enabled "stopOnComplete" !
    if (multibar.isActive === false){
        clearInterval(timer);

        //multibar.stop();
        console.log('Download complete!')
    }
}, 3);

let numMessages = 0;

const loggingTimer = setInterval(function(){
    // don't forget to add a linebreak !!!
    multibar.log(`[${(new Date()).toString()}] I'm logging message #${numMessages++}\n`);
}, 1500);