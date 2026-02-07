// ETA calculation
class ETA{

    // For performance this class uses arrays of numbers instead of
    // objects, does not allocate memory, and does not use modulo.
    constructor(length, initTime, initValue){
        // size of eta buffer
        this.etaBufferLength = length || 100;

        // constant sized progress value buffer
        this.valueBuffer = new Array(this.etaBufferLength);
        this.valueBuffer[0] = initValue;

        // constant sized time buffer
        this.timeBuffer = new Array(this.etaBufferLength);
        this.timeBuffer[0] = initTime;

        // count and length of buffers
        this.count = 1;
        this.index = 0;

        // eta time value
        this.eta = '0';
    }

    // add new values to calculation buffer
    update(time, value, total){
        // don't increment index if same value to prevent INF
        if (value === this.valueBuffer[this.index]) {
            this.timeBuffer[this.index] = time;
            this.calculate(total - value);
            return;
        }

        // don't increment index if same time to prevent NaN
        if (time === this.timeBuffer[this.index]) {
            this.valueBuffer[this.index] = value;
            this.calculate(total - value);
            return;
        }

        // increment count until buffer is filled
        if (this.count < this.etaBufferLength) {
            this.count++;
        }

        // increment index, looping around to zero
        if (++this.index === this.etaBufferLength) {
            this.index = 0;
        }

        // insert values
        this.valueBuffer[this.index] = value;
        this.timeBuffer[this.index] = time;

        // trigger recalculation
        this.calculate(total - value);
    }

    // fetch estimated time
    getTime(){
        return this.eta;
    }

    // eta calculation - request number of remaining events
    calculate(remaining){
        // startIndex is zero until buffers are filled, then the
        // oldest values are at the next index
        let startIndex = this.count < this.etaBufferLength ? 0 : this.index + 1;
        if (startIndex === this.etaBufferLength) {
            startIndex = 0;
        }

        const v_diff = this.valueBuffer[this.index] - this.valueBuffer[startIndex];
        const t_diff = this.timeBuffer[this.index] - this.timeBuffer[startIndex];

        // get progress per ms
        const vt_rate = v_diff/t_diff;

        // eq: vt_rate *x = total
        const eta = Math.ceil(remaining/vt_rate/1000);

        // check values
        if (isNaN(eta)){
            this.eta = 'NaN';

        // +/- Infinity --- NaN already handled
        } else if (!isFinite(eta)) {
            this.eta = 'INF';

        // > 10M s ? - set upper display limit ~115days (1e7/60/60/24)
        } else if (eta > 1e7) {
            this.eta = 'INF';

        // negative ?
        } else if (eta < 0) {
            this.eta = 0;

        } else {
            // assign
            this.eta = eta;
        }
    }
}

module.exports = ETA;
