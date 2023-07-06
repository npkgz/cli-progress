const assert = require('node:assert');
const formatter = require('../../lib/formatter.js');
const { parse } = require('../../lib/options.js');
const braille_patterns_preset = require("../../presets/braille-patterns.js");

const defaultOptions = parse({}, braille_patterns_preset);
const defaultParams = {
    progress: 0.32,
    eta: '20',
    startTime: 1571383670022,
    total: 100,
    value: 20,
    maxWidth: 147
};
const defaultPayload = {};

describe('braille pattern preset', () => {
    it ('should properly render default values', () => {
        const result = formatter(defaultOptions, defaultParams, defaultPayload);
        const expected = ' ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀ 32% | ETA: 20s | 20/100';
        assert.equal(result, expected);
    });

    it ('should properly render custom `barCompleteChar` configuration with default values', () => {
        const options = parse(
            Object.assign(
                {},
                defaultOptions,
                {
                    //  ⡀⣀⣄⣤⣦⣶⣷⣿
                    barCompleteChar: ['\u2840', '\u28C0', '\u28C4', '\u28E4', '\u28E6', '\u28F6', '\u28F7', '\u28FF'],
                    barIncompleteChar: ' ',
                }
            )
        );
        const result = formatter(options, defaultParams, defaultPayload);
        const expected = ' ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶                            32% | ETA: 20s | 20/100';
        assert.equal(result, expected);
    });

    it ('should render one dot at 1/240', () => {
        const params = Object.assign({}, defaultParams, { progress: 1 / 240 });
        const result = formatter(defaultOptions, params, defaultPayload);
        const expected = ' ⣄⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀ 0% | ETA: 20s | 20/100';
        assert.equal(result, expected);
    });

    it ('should render two dots at 2/240', () => {
        const params = Object.assign({}, defaultParams, { progress: 2 / 240 });
        const result = formatter(defaultOptions, params, defaultPayload);
        const expected = ' ⣤⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀ 0% | ETA: 20s | 20/100';
        assert.equal(result, expected);
    });

    it ('should render three dots at 3/240', () => {
        const params = Object.assign({}, defaultParams, { progress: 3 / 240 });
        const result = formatter(defaultOptions, params, defaultPayload);
        const expected = ' ⣦⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀ 1% | ETA: 20s | 20/100';
        assert.equal(result, expected);
    });

    it ('should render four dots at 4/240', () => {
        const params = Object.assign({}, defaultParams, { progress: 4 / 240 });
        const result = formatter(defaultOptions, params, defaultPayload);
        const expected = ' ⣶⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀ 1% | ETA: 20s | 20/100';
        assert.equal(result, expected);
    });

    it ('should render five dots at 5/240', () => {
        const params = Object.assign({}, defaultParams, { progress: 5 / 240 });
        const result = formatter(defaultOptions, params, defaultPayload);
        const expected = ' ⣷⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀ 2% | ETA: 20s | 20/100';
        assert.equal(result, expected);
    });

    it ('should render six dots at 6/240', () => {
        const params = Object.assign({}, defaultParams, { progress: 6 / 240 });
        const result = formatter(defaultOptions, params, defaultPayload);
        const expected = ' ⣿⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀ 2% | ETA: 20s | 20/100';
        assert.equal(result, expected);
    });
});
