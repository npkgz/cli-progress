// sub-module access
module.exports = {
    Bar: require('./lib/Bar'),
    Presets: {
        legacy: require('./presets/legacy'),
        shades_classic: require('./presets/shades-classic'),
        shades_grey: require('./presets/shades-grey'),
        rect: require('./presets/rect')
    }
};