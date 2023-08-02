const cli_progress = require('../cli-progress');

// Generate random file names using random hexadecimal names
const random_file_names = Array(10).fill(0).map(() => 
    Math.floor(Math.random() * Math.pow(16, 6)).toString(16) + '.txt'
);

const bar = new cli_progress.Bar({
    format: 'Files [{bar}] | {percentage}% | {value}/{total}',
    hideCursor: true,
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    stopOnComplete: true,

    // If clear on complete then both bar and info are cleared
    // clearOnComplete: true,

    // forceRedraw: true
});

console.log('Downloading files..');
bar.start(200, 0);

const timer = setInterval(() => {
    if (bar.value < bar.total) {
        bar.increment();

        const current_file = random_file_names[Math.floor(bar.value / 20)];
        bar.setConcurrentInfo(`  --> Downloading ${current_file}...`);
    }
    
    if (!bar.isActive) {
        clearInterval(timer);
        console.log('Download complete!\n');
    }
}, 15);
