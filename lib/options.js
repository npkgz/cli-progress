// utility to merge defaults
function mergeOption(v, defaultValue) {
    return typeof v === 'undefined' || v === null ? defaultValue : v;
}

// set global options
function parse(rawOptions, preset) {

    // options storage
    const options = {};

    // merge preset
    const opt = Object.assign({}, preset, rawOptions);

    // the maximum update rate in fps (redraw will only be triggered on value change)
    options.throttleTime = 1000 / (mergeOption(opt.fps, 10));

    // the output stream to write on
    options.stream = mergeOption(opt.stream, process.stderr);

    // external terminal provided ?
    options.terminal = mergeOption(opt.terminal, null);

    // clear on completion?
    options.clearOnComplete = mergeOption(opt.clearOnComplete, false);

    // stop on completion?
    options.stopOnComplete = mergeOption(opt.stopOnComplete, false);

    // size of the progressbar in chars
    options.barsize = mergeOption(opt.barsize, 40);

    // position of the progress bar - 'left' (default), 'right' or 'center'
    options.align = mergeOption(opt.align, 'left');

    // hide the cursor?
    options.hideCursor = mergeOption(opt.hideCursor, false);

    // disable line wrapping?
    options.linewrap = mergeOption(opt.linewrap, false);

    // glue sequence (control chars) between bar elements ?
    options.barGlue = mergeOption(opt.barGlue, '');

    // bar chars
    options.barCompleteChar = mergeOption(opt.barCompleteChar, '=');
    options.barIncompleteChar = mergeOption(opt.barIncompleteChar, '-');

    // the bar format
    options.format = mergeOption(opt.format, 'progress [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}');

    // external time-format provided?
    options.formatTime = mergeOption(opt.formatTime, null);

    // external value-format provided?
    options.formatValue = mergeOption(opt.formatValue, null);

    // external bar-format provided?
    options.formatBar = mergeOption(opt.formatBar, null);

    // the number of results to average ETA over
    options.etaBufferLength = mergeOption(opt.etaBuffer, 10);

    // automatic eta updates based on fps
    options.etaAsynchronousUpdate = mergeOption(opt.etaAsynchronousUpdate, false);

    // progress calculation relative to start value ? default start at 0
    options.progressCalculationRelative = mergeOption(opt.progressCalculationRelative, false);

    // allow synchronous updates ?
    options.synchronousUpdate = mergeOption(opt.synchronousUpdate, true);

    // notty mode
    options.noTTYOutput = mergeOption(opt.noTTYOutput, false);

    // schedule - 2s
    options.notTTYSchedule = mergeOption(opt.notTTYSchedule, 2000);

    // emptyOnZero - false
    options.emptyOnZero = mergeOption(opt.emptyOnZero, false);

    // force bar redraw even if progress did not change
    options.forceRedraw = mergeOption(opt.forceRedraw, false);

    // automated padding to fixed width ?
    options.autopadding = mergeOption(opt.autopadding, false);

    // stop bar on SIGINT/SIGTERM to restore cursor settings ?
    options.gracefulExit = mergeOption(opt.gracefulExit, false);

    // Computed property to pre-render bar strings for performance
    Object.defineProperty(options, "barCompleteString", {
        get () {
            return Array.isArray(this.barCompleteChar) ?
                this.barCompleteChar[this.barCompleteChar.length - 1].repeat(this.barsize + 1) :
                this.barCompleteChar.repeat(this.barsize + 1);
        },
    });

    // Computed property to pre-render bar strings for performance
    Object.defineProperty(options, "barIncompleteString", {
        get () {
            return this.barIncompleteChar.repeat(this.barsize + 1);
        },
    });

    // Computed property to set the auto-padding character - empty in case auto-padding is disabled
    Object.defineProperty(options, "autopaddingChar", {
        get () {
            return this.autopadding ? mergeOption(this.autopaddingChar, '   ') : '';
        },
    });

    return options;
}

module.exports = { parse, };
