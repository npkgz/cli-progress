const SingleBar = require('./lib/single-bar.js');
const MultiBar = require('./lib/multi-bar.js');
const Presets = require('./presets/index.js');
const Formatter = require('./lib/formatter.js');
const ValueFormat = require('./lib/format-value.js');
const BarFormat = require('./lib/format-bar.js');
const TimeFormat = require('./lib/format-time.js');

// sub-module access
module.exports = {
    Bar: SingleBar,
    SingleBar,
    MultiBar,
    Presets,
    Format: {
        Formatter,
        BarFormat, ValueFormat, TimeFormat,
    }
};
