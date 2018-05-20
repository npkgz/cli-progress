const _Terminal = require('./Terminal');

// Progress-Bar constructor
module.exports = class Bar{

    constructor(opt, preset){
        // options set ?
        opt = opt || {};

        // preset set ?
        const options = preset || {};

        // merge options - take precedence over preset
        for (const attb in opt){
            options[attb] = opt[attb];
        }

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
        this.etaBuffer = getOption(options.etaBuffer, 10);

        // eta buffer with initial values
        this.eta = {};

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
        const eta = this.eta.time;
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
        this.eta = {
            valueBuffer: [this.value],
            timeBuffer: [this.startTime],
            time: 0
        };

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
        
        // add new values
        this.eta.valueBuffer.push(current);
        this.eta.timeBuffer.push(Date.now());

        // merge payload
        const payloadData = payload || {};
        for (const key in payloadData){
            this.payload[key] = payloadData[key];
        }

        // throttle the update or force update ?
        if (this.lastRedraw + this.throttleTime < Date.now()){
            this.calculateETA();
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

    // internal - eta calculation
    calculateETA(){

        const l = this.eta.valueBuffer.length;
        const buffer = Math.min(this.etaBuffer, l);

        const v_diff = this.eta.valueBuffer[l - 1] - this.eta.valueBuffer[l - buffer];
        const t_diff = this.eta.timeBuffer[l - 1] - this.eta.timeBuffer[l - buffer];

        // get progress per ms
        const vt_rate = v_diff/t_diff;

        // remaining
        const remaining = this.total-this.value;

        // eq: vt_rate *x = total
        const eta = (remaining/vt_rate/1000);

        this.eta = {
            valueBuffer: this.eta.valueBuffer.slice(-this.etaBuffer),
            timeBuffer: this.eta.timeBuffer.slice(-this.etaBuffer),
            time: Math.ceil(eta)
        }
    }
}