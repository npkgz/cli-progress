var _readline = require('readline');

// Progress-Bar constructor
function Bar(options){
    // options set ?
    options = options || {};

    // the update timer
    this.timer = null;

    // the current bar value
    this.value = 0;

    // the end value of the bar
    this.total = 100;

    // the max update rate in fps (redraw will only triggered on value change)
    this.throttleTime = (options.fps || 10)/1000;

    // the output stream to write on
    this.stream = options.stream || process.stderr;

    // clear on finish ?
    this.clearOnComplete = options.clearOnComplete || false;

    // last drawn string - only render on change!
    this.lastDrawnString = null;

    // size of the progressbar in chars
    this.barsize = options.barsize || 40;

    // hide the cursor ?
    this.hideCursor = options.hideCursor || false;

    // pre-render bar strings (performance)
    this.barCompleteString = (new Array(this.barsize + 1 ).join(options.barCompleteChar || '='));
    this.barIncompleteString = (new Array(this.barsize + 1 ).join(options.barIncompleteChar || '-'));

    // the bar format
    this.format = options.format || 'progess [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}';

    // start time (used for eta calculation)
    this.startTime = null;

    // last update time
    this.lastRedraw = Date.now();

    // eta buffer
    this.eta = {};
};

// internal render function
Bar.prototype.render = function(){
    this.stopTimer();

    // copy format string
    var s = this.format;

    // calculate the normalized current progress
    var progress = this.value/this.total;

    // limiter
    progress = Math.min(Math.max(progress, 0.0), 1.0);

    // generate bar string by stripping the pre-rendered strings
    var b = this.barCompleteString.substr(0, Math.round(progress*this.barsize)) +
            this.barIncompleteString.substr(0, Math.round((1.0-progress)*this.barsize));

    // limit the bar-size (can cause n+1 chars in some numerical situation)
    b = b.substr(0, this.barsize);

    // calculate progress in percent
    var percentage =  Math.round(progress*100) + '';

    // calculate elapsed time
    var elapsedTime = Math.round((Date.now() - this.startTime)/1000);

    // calculate eta
    var eta = this.eta.time;

    // assign placeholder tokens
    s = s.replace(/\{bar}/gi, b)
        .replace(/\{percentage}/gi, percentage)
        .replace(/\{total}/gi, this.total + '')
        .replace(/\{value}/gi, this.value + '')
        .replace(/\{eta}/gi, eta + '')
        .replace(/\{duration}/gi, elapsedTime + '');

    // string changed ? only trigger redraw on change!
    if (this.lastDrawnString != s){
        // set cursor to start of line
        _readline.cursorTo(this.stream, 0);

        // write output
        this.stream.write(s);

        // clear to the right from cursor
        _readline.clearLine(this.stream, 1);

        // store string
        this.lastDrawnString = s;

        // set last redraw time
        this.lastRedraw = Date.now();
    }

    // next update
    this.timer = setTimeout(this.render.bind(this), this.throttleTime*2);
};

// start the progress bar
Bar.prototype.start = function(total, startValue){
    // progress is only visible in TTY mode!
    if (!this.stream.isTTY){
        return;
    }

    // set initial values
    this.value = startValue || 0;
    this.total = total || 100;
    this.startTime = Date.now();
    this.lastDrawnString = '';

    // hide the cursor
    if (this.hideCursor) {
        this.stream.write('\033[?25l');
    }

    // timer already active ?
    this.stopTimer();

    // redraw on start!
    this.render();

    // initialize eta buffer
    this.eta = {
        lastValue: 0,
        lastTime: this.startTime,
        time: null
    };
};

// stop the bar
Bar.prototype.stop = function(){
    // timer inactive ?
    if (!this.timer) {
        return
    }

    // trigger final rendering
    this.render();
    this.stopTimer();

    // clear line on complete ?
    if (this.clearOnComplete && this.stream.isTTY){
        _readline.cursorTo(this.stream, 0);
        _readline.clearLine(this.stream, 0);
    }else{
        // new line on complete
        this.stream.write('\n');
    }

    // show the cursor
    if (this.hideCursor) {
        this.stream.write('\033[?25h');
    }
};

// update the bar value
Bar.prototype.update = function(current){
    // update value
    this.value = current;

    this.calculateETA(current);

    // throttle the update or force update ?
    if (this.lastRedraw + this.throttleTime < Date.now()){
        this.render();
    }
};

// get the total (limit) value
Bar.prototype.getTotal = function(){
    return this.total;
};

// internal - stop the current timer
Bar.prototype.stopTimer = function(){
    // stop the timer
    if (this.timer) {
        clearTimeout(this.timer);
    }
    this.timer = null;
};

// internal - eta calculation
Bar.prototype.calculateETA = function(current){
    // calc the difference
    var v_diff = current-this.eta.lastValue;
    var t_diff = (Date.now() - this.eta.lastTime);

    // get progress per ms
    var vt_rate = v_diff/t_diff;

    // remaining
    var remaining = this.total-current;

    // eq: vt_rate *x = total
    var eta = remaining/vt_rate/1000;

    // store the value
    this.eta = {
        lastValue: current,
        lastTime: Date.now(),
        time: Math.ceil(eta)
    };
};

module.exports = Bar;
