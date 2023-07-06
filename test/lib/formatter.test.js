const assert = require('node:assert');
const formatter = require('../../lib/formatter.js');

const defaultOptions = {
    throttleTime: 100,
    stream: null,
    terminal: null,
    clearOnComplete: false,
    stopOnComplete: false,
    barsize: 40,
    align: 'left',
    hideCursor: false,
    linewrap: false,
    barCompleteString: '████████████████████████████████████████',
    barIncompleteString: '░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░',
    format: ' {bar} {percentage}% | ETA: {eta}s | {value}/{total}',
    etaBufferLength: 10,
    synchronousUpdate: true,
    noTTYOutput: false,
    notTTYSchedule: 2000,
    emptyOnZero: false,
    forceRedraw: false,
    autopadding: false,
    autopaddingChar: '',
    formatBar: null,
    formatTime: null,
    formatValue: null,
    barGlue: ''
};
const defaultParams = {
    progress: 0.2,
    eta: '20',
    startTime: 1571383670022,
    total: 100,
    value: 20,
    maxWidth: 147
};
const defaultPayload = {};

describe('formatter', () => {
    it ('should properly render default values', () => {
        const result = formatter(defaultOptions, defaultParams, defaultPayload);
        const expected = ' ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 20% | ETA: 20s | 20/100';

        assert.equal(result, expected);
    });

    it('should leave placeholder for undefined values', () => {
        const options = Object.assign(
            {}, defaultOptions,
            { format: '{undefined_value} {bar} {percentage}%', }
        );
        const payload = Object.assign({}, defaultPayload);
        delete payload.undefined_value;

        const result = formatter(options, defaultParams, payload);
        const expected = '{undefined_value} ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 20%';

        assert.equal(result, expected);
    });

    describe('render falsy values', () => {
        it('should render zero value', () => {
            const options = Object.assign(
                {}, defaultOptions,
                { format: '{zero_value} {bar} {percentage}%', }
            );
            const payload = Object.assign({}, defaultPayload, { zero_value: 0 });

            const result = formatter(options, defaultParams, payload);
            const expected = '0 ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 20%';

            assert.equal(result, expected);
        });

        it('should render empty string value', () => {
            const options = Object.assign(
                {}, defaultOptions,
                { format: '{empty_string} {bar} {percentage}%', }
            );
            const payload = Object.assign({}, defaultPayload, { empty_string: '' });

            const result = formatter(options, defaultParams, payload);
            const expected = ' ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 20%';

            assert.equal(result, expected);
        });

        it('should render null value', () => {
            const options = Object.assign(
                {}, defaultOptions,
                { format: '{null_value} {bar} {percentage}%', }
            );
            const payload = Object.assign({}, defaultPayload, { null_value: null });

            const result = formatter(options, defaultParams, payload);
            const expected = 'null ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 20%';

            assert.equal(result, expected);
        });

        it('should render boolean false value', () => {
            const options = Object.assign(
                {}, defaultOptions,
                { format: '{false_value} {bar} {percentage}%', }
            );
            const payload = Object.assign({}, defaultPayload, { false_value: false });

            const result = formatter(options, defaultParams, payload);
            const expected = 'false ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 20%';

            assert.equal(result, expected);
        });
    });
});
