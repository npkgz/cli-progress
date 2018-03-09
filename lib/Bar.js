var _readline = require('readline');

// Progress-Bar constructor
function Bar(opt, preset){
    // options set ?
    opt = opt || {};

    // preset set ?
    var options = preset || {};

    // merge options - take precedence over preset
    for (var attb in opt){
        options[attb] = opt[attb];
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
    this.stream = options.stream || process.stderr;

    // clear on finish ?
    this.clearOnComplete = options.clearOnComplete || false;

    // stop on finish ?
    this.stopOnComplete = options.stopOnComplete || false;

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
    this.format = options.format || 'progress [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}';

    // start time (used for eta calculation)
    this.startTime = null;

    // last update time
    this.lastRedraw = Date.now();

    // the number of results to average ETA over
    this.etaBuffer = options.etaBuffer || 10;

    // eta buffer with initial values
    this.eta = {};

    // payload data
    this.payload = {};
};

// internal render function
Bar.prototype.render = function(){
    this.stopTimer();

    // copy format string
    var s = this.format;

    // calculate the normalized current progress
    var progress = (this.value/this.total);

    // handle NaN Errors caused by total=0. Set to complete in this case 
    if (isNaN(progress)){
        progress = 1.0;
    }

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
    var elapsedTimef = this.formatTime(elapsedTime, 1);

    // calculate eta
    var eta = this.eta.time;
    var etaf = this.formatTime(eta, 5);

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
    for (var key in this.payload) {
        var pattern = RegExp('{'+key+'}', 'gi');
        s = s.replace(pattern, this.payload[key]);
    }

    // string changed ? only trigger redraw on change!
    if (this.lastDrawnString != s){
        // set cursor to start of line
        _readline.cursorTo(this.stream, 0, null);

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

// format a number of seconds into hours and minutes as appropriate
Bar.prototype.formatTime = function (t, roundToMultipleOf) {
    var round = function (input) {
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
Bar.prototype.start = function(total, startValue, payload){
    // set initial values
    this.value = startValue || 0;
    this.total = (typeof total !== 'undefined' && total >= 0) ? total : 100;
    this.payload = payload || {};

    this.startTime = Date.now();
    this.lastDrawnString = '';

    // progress is only visible in TTY mode!
    if (!this.stream.isTTY){
        return;
    }

    // hide the cursor
    if (this.hideCursor) {
        this.stream.write('\033[?25l');
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
};

// stop the bar
Bar.prototype.stop = function(){
    // timer inactive ?
    if (!this.timer) {
        return;
    }

    // trigger final rendering
    this.render();
    this.stopTimer();

    // clear line on complete ?
    if (this.clearOnComplete && this.stream.isTTY){
        _readline.cursorTo(this.stream, 0, null);
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
Bar.prototype.update = function(current, payload){
    // update value
    this.value = current;

    // timer inactive ?
    if (!this.timer) {
        return;
    }
    
    // add new values
    this.eta.valueBuffer.push(current);
    this.eta.timeBuffer.push(Date.now());

    var payloadData = payload || {};
    for (var key in payloadData){
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
};

// update the bar value
Bar.prototype.increment = function(step, payload){
    step = step || 1;
    this.update(this.value + step, payload);
};

// get the total (limit) value
Bar.prototype.getTotal = function(){
    return this.total;
};

// set the total (limit) value
Bar.prototype.setTotal = function(total){
    if (typeof total !== 'undefined' && total >= 0){
        this.total = total;
    }
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
Bar.prototype.calculateETA = function(){

    var l = this.eta.valueBuffer.length;
    var buffer = Math.min(this.etaBuffer, l);

    var v_diff = this.eta.valueBuffer[l - 1] - this.eta.valueBuffer[l - buffer];
    var t_diff = this.eta.timeBuffer[l - 1] - this.eta.timeBuffer[l - buffer];

    // get progress per ms
    var vt_rate = v_diff/t_diff;

    // remaining
    var remaining = this.total-this.value;

    // eq: vt_rate *x = total
    var eta = (remaining/vt_rate/1000);

    this.eta = {
        valueBuffer: this.eta.valueBuffer.slice(-this.etaBuffer),
        timeBuffer: this.eta.timeBuffer.slice(-this.etaBuffer),
        time: Math.ceil(eta)
    }
};

module.exports = Bar;
