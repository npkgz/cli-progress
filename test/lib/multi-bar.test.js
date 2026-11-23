const _assert = require('assert');
const _progress = require('../../cli-progress');

describe('multi-bar', function() {
    let multibar = null;
    let output = '';

    afterEach(() => {
        multibar.stop();
    });

    it('should clear all old bar rows before writing buffered logs', () => {
        multibar = new _progress.MultiBar({
            stream: {
                isTTY: true,
                columns: 80,
                write: (s) => { output += s; }
            },
            format: '{name} {value}/{total}',
            forceRedraw: true
        });
        multibar.create(100, 0, {name: 'First long bar'});
        multibar.create(100, 0, {name: 'Second long bar'});
        multibar.update();
        output = '';

        multibar.log('a\n');
        multibar.log('b\n');
        multibar.update();

        const expected = '\x1B[1A\x1B[1G\x1B[0Ja\nb\n'
            + '\x1B[1GFirst long bar 0/100\x1B[0K\n'
            + '\x1B[1GSecond long bar 0/100\x1B[0K';

        _assert.equal(output, expected);
    });
});
