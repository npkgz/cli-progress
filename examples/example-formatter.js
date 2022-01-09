const _progress = require('../cli-progress');
const _colors = require('ansi-colors');

function myFormatter(options, params, payload){

    // bar grows dynamically by current progrss - no whitespaces are added
    const bar = options.barCompleteString.substr(0, Math.round(params.progress*options.barsize));

    // end value reached ?
    // change color to green when finished
    if (params.value >= params.total){
        return '# ' + _colors.grey(payload.task) + '   ' + _colors.green(params.value + '/' + params.total) + ' --[' + bar + ']-- ';
    }else{
        return '# ' + payload.task + '   ' + _colors.yellow(params.value + '/' + params.total) + ' --[' + bar + ']-- ';
    }    
}

function Example5(){
    console.log('');
    // create new progress bar
    const b1 = new _progress.Bar({
        format: myFormatter,
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true,
        stopOnComplete: true
    });

    // initialize the bar -  defining payload token "speed" with the default value "N/A"
    b1.start(200, 0, {
        task: 'Task 1'
    });

    // 20ms update rate
    const timer = setInterval(function(){
        // increment value
        b1.increment();

        // finished ?
        if (b1.isActive === false){
            clearInterval(timer);
        }
    }, 20);
}

Example5();