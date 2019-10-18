const _stringWidth = require('string-width');

// format a number of seconds into hours and minutes as appropriate
function formatTime(t, roundToMultipleOf){
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

// generic formatter
module.exports = function defaultFormatter(options, params, payload){

    // copy format string
    let s = options.format;

    // generate bar string by stripping the pre-rendered strings
    let b = options.barCompleteString.substr(0, Math.round(params.progress*options.barsize)) +
            options.barIncompleteString.substr(0, Math.round((1.0-params.progress)*options.barsize));

    // limit the bar-size (can cause n+1 chars in some numerical situation)
    b = b.substr(0, options.barsize);

    // calculate progress in percent
    const percentage =  Math.round(params.progress*100) + '';

    // calculate elapsed time
    const elapsedTime = Math.round((Date.now() - params.startTime)/1000);
    const elapsedTimef = formatTime(elapsedTime, 1);

    // calculate eta
    const etaf = formatTime(params.eta, 5);

    // merges data from payload and calcuated
    const context = Object.assign({}, payload, {
        bar: b,
        percentage: percentage,
        total: params.total,
        value: params.value,
        eta: params.eta,
        eta_formatted: etaf,
        duration: elapsedTime,
        duration_formatted: elapsedTimef
    });

    // assign placeholder tokens
    s = s.replace(/\{(\w+)\}/g, function(match, key){
        // key exists within payload/context
        if (typeof context[key] !== 'undefined') {
            return context[key];
        }

        // no changes to unknown values
        return match;
    });

    // calculate available whitespace (2 characters margin of error)
    const fullMargin = Math.max(0, params.maxWidth - _stringWidth(s) -2);
    const halfMargin = Math.floor(fullMargin / 2);

    // distribute available whitespace according to position
    switch (options.align) {

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

    return s;
}