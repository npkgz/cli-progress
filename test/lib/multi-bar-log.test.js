const _assert = require('assert');
const _progress = require('../../cli-progress');

describe('multi-bar log', function() {
    let multibar = null;
    let output = '';

    afterEach(() => {
        multibar.stop();
    });

    it('should re-enable line wrapping while writing buffered logs', () => {
        multibar = new _progress.MultiBar({
            stream: {
                isTTY: true,
                columns: 20,
                write: (s) => { output += s; }
            },
            format: '{value}/{total}',
            forceRedraw: true
        });
        multibar.create(100, 0);
        multibar.update();
        output = '';

        multibar.log('a log line longer than the terminal\n');
        multibar.update();

        const expected = '\x1B[1G\x1B[2K'
            + '\x1B[?7ha log line longer than the terminal\n\x1B[?7l'
            + '\x1B[1G0/100\x1B[0K';

        _assert.equal(output, expected);
    });
});
