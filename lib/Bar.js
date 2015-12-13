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
    this.fps = options.fps || 10;

    // the output stream to write on
    this.stream = options.stream || process.stderr;

    // clear on finish ?
    this.clearOnComplete = options.clearOnComplete || false;

    // redraw flag
    this.redraw = false;

    // last drawn string - only render on change!
    this.lastDrawnString = null;

    // size of the progressbar in chars
    this.barsize = options.barsize || 40;

    // pre-render bar strings (performance)
    this.barCompleteString = (new Array(this.barsize + 1 ).join(options.barCompleteChar || '='));
    this.barIncompleteString = (new Array(this.barsize + 1 ).join(options.barIncompleteChar || '-'));

    // the bar format
    this.format = options.format || 'progess [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}';

    // start time (used for eta calculation)
    this.startTime = null;
};

// internal render function
Bar.prototype.render = function(){
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
    var elapsedTime = Math.round((new Date() - this.startTime)/1000);

    // calculate eta
    var eta = Math.round(elapsedTime * (this.total / this.value - 1));

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
        this.stream.cursorTo(0);

        // write output
        this.stream.write(s);

        // clear to the right from cursor
        this.stream.clearLine(1);

        // store string
        this.lastDrawnString = s;
    }

    // reset redraw flag
    this.redraw = false;
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
    this.startTime = new Date();

    // redraw on start!
    this.redraw = true;

    // timer already active ?
    if (!this.timer){
        // updater
        this.timer = setInterval(function(){
            // value changed ?
            if (!this.redraw){
                return;
            }
            this.render();

        }.bind(this), (1000/this.fps));
    }
};

// stop the bar
Bar.prototype.stop = function(){
    // timer inactive ?
    if (!this.timer) {
        return
    }

    // stop the timer
    clearInterval(this.timer);
    this.timer = null;

    // trigger final rendering
    this.render();

    // clear line on complete ?
    if (this.clearOnComplete && this.stream.isTTY){
        this.stream.cursorTo(0);
        this.stream.clearLine(0);
    }else{
        // new line on complete
        this.stream.write('\n');
    }
};

// update the bar value
Bar.prototype.update = function(current){
    // update value
    this.value = current;

    // set redraw flag
    this.redraw = true;
};

// get the total (limit) value
Bar.prototype.getTotal = function(){
    return this.total;
};


module.exports = Bar;