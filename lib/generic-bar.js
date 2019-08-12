const _ETA = require('./eta');
const _stringWidth = require('string-width');
const _Terminal = require('./terminal');

// Progress-Bar constructor
module.exports = class GenericBar{

    constructor(options){

        // store options
        this.options = options;

        // store terminal instance
        this.terminal = (this.options.terminal) ? this.options.terminal : new _Terminal(this.options.stream);

        // the current bar value
        this.value = 0;

        // the end value of the bar
        this.total = 100;

        // last drawn string - only render on change!
        this.lastDrawnString = null;

        // start time (used for eta calculation)
        this.startTime = null;

        // last update time
        this.lastRedraw = Date.now();

        // default eta calulator (will be re-create on start)
        this.eta = new _ETA(this.options.etaBufferLength, 0, 0);

        // payload data
        this.payload = {};

        // progress bar active ?
        this.isActive = false;
    }

    // internal render function
    render(){
        // copy format string
        let s = this.options.format;

        // calculate the normalized current progress
        let progress = (this.value/this.total);

        // handle NaN Errors caused by total=0. Set to complete in this case 
        if (isNaN(progress)){
            progress = 1.0;
        }

        // limiter
        progress = Math.min(Math.max(progress, 0.0), 1.0);

        // generate bar string by stripping the pre-rendered strings
        let b = this.options.barCompleteString.substr(0, Math.round(progress*this.options.barsize)) +
                this.options.barIncompleteString.substr(0, Math.round((1.0-progress)*this.options.barsize));

        // limit the bar-size (can cause n+1 chars in some numerical situation)
        b = b.substr(0, this.options.barsize);

        // calculate progress in percent
        const percentage =  Math.round(progress*100) + '';

        // calculate elapsed time
        const elapsedTime = Math.round((Date.now() - this.startTime)/1000);
        const elapsedTimef = GenericBar.formatTime(elapsedTime, 1);

        // calculate eta
        const eta = this.eta.getTime();
        const etaf = GenericBar.formatTime(eta, 5);

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
        switch (this.options.align) {

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
        // force redraw in notty-mode!
        if (this.lastDrawnString != s || (this.options.noTTYOutput && !this.terminal.isTTY())){
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

        // initialize eta buffer
        this.eta = new _ETA(this.options.etaBufferLength, this.startTime, this.value);

        // set flag
        this.isActive = true;
    }

    // stop the bar
    stop(){
        // set flag
        this.isActive = false;
    }

    // update the bar value
    update(current, payload){
        // update value
        this.value = current;
        
        // add new value
        this.eta.push(Date.now(), current);

        // merge payload
        const payloadData = payload || {};
        for (const key in payloadData){
            this.payload[key] = payloadData[key];
        }

        // number of remaining elements required for calculation
        this.eta.calculate(this.total-this.value);
        
        // trigger synchronous update ?
        // check for throttel time 
        if (this.options.synchronousUpdate && (this.lastRedraw + this.options.throttleTime*2) < Date.now()){
            // force update
            this.render();
        }

        // limit reached ? autostop set ?
        if (this.value >= this.getTotal() && this.options.stopOnComplete) {
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
}
