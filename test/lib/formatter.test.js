const _assert = require('assert');
const _formatter = require('../../lib/formatter');
const _defaults = {
    options: {
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
    },
    params: {
        progress: 0.2,
        eta: '20',
        startTime: 1571383670022,
        total: 100,
        value: 20,
        maxWidth: 147
    },
    payload: {

    }
};

describe('formatter', function() {
    let defaults = null;

    beforeEach('set defaults', () => {
        defaults = _defaults;
    });

    it ('should proper render default values', () => {
        const {options, params, payload} = defaults;

        const result = _formatter(options, params, payload);
        const expected = ' ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 20% | ETA: 20s | 20/100';

        _assert.equal(result, expected);
    });

    it('should leave placeholder for undefined values', () => {
        const {options, params, payload} = defaults;

        options.format = '{undefined_value} {bar} {percentage}%';
        delete payload.undefined_value;

        const result = _formatter(options, params, payload);
        const expected = '{undefined_value} ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 20%';

        _assert.equal(result, expected);
    });

    describe('render falsy values', () => {
        it('should render zero value', () => {
            const {options, params, payload} = defaults;

            options.format = '{zero_value} {bar} {percentage}%';
            payload.zero_value = 0;

            const result = _formatter(options, params, payload);
            const expected = '0 ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 20%';

            _assert.equal(result, expected);
        });

        it('should render empty string value', () => {
            const {options, params, payload} = defaults;

            options.format = '{empty_string} {bar} {percentage}%';
            payload.empty_string = '';

            const result = _formatter(options, params, payload);
            const expected = ' ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 20%';

            _assert.equal(result, expected);
        });

        it('should render null value', () => {
            const {options, params, payload} = defaults;

            options.format = '{null_value} {bar} {percentage}%';
            payload.null_value = null;

            const result = _formatter(options, params, payload);
            const expected = 'null ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 20%';

            _assert.equal(result, expected);
        });

        it('should render boolean false value', () => {
            const {options, params, payload} = defaults;

            options.format = '{false_value} {bar} {percentage}%';
            payload.false_value = false;

            const result = _formatter(options, params, payload);
            const expected = 'false ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 20%';

            _assert.equal(result, expected);
        });
    });
});