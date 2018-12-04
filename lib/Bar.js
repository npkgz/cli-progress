const _Terminal = require('./Terminal');
const _ETA = require('./ETA');
const _stringWidth = require('string-width');

// Progress-Bar constructor
module.exports = class Bar{

    constructor(opt, preset){

       // merge options - take precedence over preset
       const options = Object.assign({}, preset, opt);

        // utility to merge defaults
        function getOption(v, defaultValue){
            if (typeof v === 'undefined' || v === null){
                return defaultValue;
            }else{
                return v;
            }
        }

        // the update timer
        this.timer = null;

        // the current bar value
        this.value = 0;

        // the end value of the bar
        this.total = 100;

        // the max update rate in fps (redraw will only triggered on value change)
        this.throttleTime = 1000 / (options.fps || 10);

        // the output stream to write on
        this.stream = getOption(options.stream, process.stderr);

        // new terminal instance
        this.terminal = new _Terminal(this.stream);

        // clear on finish ?
        this.clearOnComplete = getOption(options.clearOnComplete, false);

        // stop on finish ?
        this.stopOnComplete = getOption(options.stopOnComplete, false);

        // last drawn string - only render on change!
        this.lastDrawnString = null;

        // size of the progressbar in chars
        this.barsize = options.barsize || 40;

        // position of the progress bar - 'left' (default), 'right' or 'center'
        this.align = getOption(options.align, 'left');

        // hide the cursor ?
        this.hideCursor = getOption(options.hideCursor, false);

        // disable linewrapping ?
        this.linewrap = getOption(options.linewrap, false);

        // pre-render bar strings (performance)
        this.barCompleteString = (new Array(this.barsize + 1 ).join(options.barCompleteChar || '='));
        this.barIncompleteString = (new Array(this.barsize + 1 ).join(options.barIncompleteChar || '-'));

        // the bar format
        this.format = options.format || 'progress [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}';

        // start time (used for eta calculation)
        this.startTime = null;

        // last update time
        this.lastRedraw = Date.now();

        // the number of results to average ETA over
        this.etaBufferLength = getOption(options.etaBuffer, 10);

        // default eta calulator (will be re-create on start)
        this.eta = new _ETA(this.etaBufferLength, 0, 0);

        // payload data
        this.payload = {};
    }

    // internal render function
    render(){
        this.stopTimer();

        // copy format string
        let s = this.format;

        // calculate the normalized current progress
        let progress = (this.value/this.total);

        // handle NaN Errors caused by total=0. Set to complete in this case 
        if (isNaN(progress)){
            progress = 1.0;
        }

        // limiter
        progress = Math.min(Math.max(progress, 0.0), 1.0);

        // generate bar string by stripping the pre-rendered strings
        let b = this.barCompleteString.substr(0, Math.round(progress*this.barsize)) +
                this.barIncompleteString.substr(0, Math.round((1.0-progress)*this.barsize));

        // limit the bar-size (can cause n+1 chars in some numerical situation)
        b = b.substr(0, this.barsize);

        // calculate progress in percent
        const percentage =  Math.round(progress*100) + '';

        // calculate elapsed time
        const elapsedTime = Math.round((Date.now() - this.startTime)/1000);
        const elapsedTimef = Bar.formatTime(elapsedTime, 1);

        // calculate eta
        const eta = this.eta.getTime();
        const etaf = Bar.formatTime(eta, 5);

        // assign placeholder tokens
        s = s.replace(/\{bar}/gi, b)
            .replace(/\{percentage}/gi, percentage)
            .replace(/\{total}/gi, this.total + '')
            .replace(/\{value}/gi, this.value + '')
            .replace(/\{eta}/gi, eta + '')
            .replace(/\{eta_formatted}/gi, etaf + '')
            .replace(/\{duration}/gi, elapsedTime + '')
            .replace(/\{duration_formatted}/gi, elapsedTimef + '');

        // assign payload placeholder tokens
        for (const key in this.payload) {
            const pattern = RegExp('{'+key+'}', 'gi');
            s = s.replace(pattern, this.payload[key]);
        }

        // calculate available whitespace (2 characters margin of error)
        const fullMargin = Math.max(0, this.terminal.getWidth() - _stringWidth(s) -2);
        const halfMargin = Math.floor(fullMargin / 2);

        // distribute available whitespace according to position
        switch (this.align) {

            // fill start-of-line with whitespaces
            case 'right':
                s = (fullMargin > 0) ? ' '.repeat(fullMargin) + s : s;
                break;

            // distribute whitespaces to left+right
            case 'center':
                s = (halfMargin > 0) ? ' '.repeat(halfMargin) + s : s;
                break;

            // default: left align, no additional whitespaces
            case 'left':
            default:
                break;
        }

        // string changed ? only trigger redraw on change!
        if (this.lastDrawnString != s){
            // set cursor to start of line
            this.terminal.cursorTo(0, null);

            // write output
            this.terminal.write(s);

            // clear to the right from cursor
            this.terminal.clearRight();
            
            // store string
            this.lastDrawnString = s;

            // set last redraw time
            this.lastRedraw = Date.now();
        }

        // next update
        this.timer = setTimeout(this.render.bind(this), this.throttleTime*2);
    }

    // format a number of seconds into hours and minutes as appropriate
    static formatTime(t, roundToMultipleOf){
        function round(input) {
            if (roundToMultipleOf) {
                return roundToMultipleOf * Math.round(input / roundToMultipleOf);
            } else {
                return input
            }
        }
        if (t > 3600) {
            return Math.floor(t / 3600) + 'h' + round((t % 3600) / 60) + 'm';
        } else if (t > 60) {
            return Math.floor(t / 60) + 'm' + round((t % 60)) + 's';
        } else if (t > 10) {
            return round(t) + 's';
        } else {
            return t + 's';
        }
    }

    // start the progress bar
    start(total, startValue, payload){
        // set initial values
        this.value = startValue || 0;
        this.total = (typeof total !== 'undefined' && total >= 0) ? total : 100;
        this.payload = payload || {};

        this.startTime = Date.now();
        this.lastDrawnString = '';

        // progress is only visible in TTY mode!
        if (!this.terminal.isTTY()){
            return;
        }

        // save current cursor settings
        this.terminal.cursorSave();

        // hide the cursor ?
        if (this.hideCursor === true){
            this.terminal.cursor(false);
        }

        // disable line wrpaping ?
        if (this.linewrap === false){
            this.terminal.lineWrapping(false);
        }

        // timer already active ?
        this.stopTimer();

        // initialize eta buffer
        this.eta = new _ETA(this.etaBufferLength, this.startTime, this.value);

        // redraw on start!
        this.render();
    }

    // stop the bar
    stop(){
        // timer inactive ?
        if (!this.timer) {
            return;
        }

        // trigger final rendering
        this.render();
        this.stopTimer();

        // cursor hidden ?
        if (this.hideCursor === true){
            this.terminal.cursor(true);
        }

        // re-enable line wrpaping ?
        if (this.linewrap === false){
            this.terminal.lineWrapping(true);
        }

        // restore cursor on complete (position + settings)
        this.terminal.cursorRestore();

        // clear line on complete ?
        if (this.clearOnComplete){
            this.terminal.cursorTo(0, null);
            this.terminal.clearLine();
        }else{
            // new line on complete
            this.terminal.write('\n');
        }
    }

    // update the bar value
    update(current, payload){
        // update value
        this.value = current;

        // timer inactive ?
        if (!this.timer) {
            return;
        }
        
        // add new value
        this.eta.push(Date.now(), current);

        // merge payload
        const payloadData = payload || {};
        for (const key in payloadData){
            this.payload[key] = payloadData[key];
        }

        // throttle the update or force update ?
        if (this.lastRedraw + this.throttleTime < Date.now()){
            // number of remaining elements required for calculation
            this.eta.calculate(this.total-this.value);
            this.render();
        }
        if (this.value >= this.getTotal() && this.stopOnComplete) {
            this.stop();
        }
    }

    // update the bar value
    increment(step, payload){
        step = step || 1;
        this.update(this.value + step, payload);
    }

    // get the total (limit) value
    getTotal(){
        return this.total;
    }

    // set the total (limit) value
    setTotal(total){
        if (typeof total !== 'undefined' && total >= 0){
            this.total = total;
        }
    }

    // internal - stop the current timer
    stopTimer(){
        // stop the timer
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = null;
    }
}
