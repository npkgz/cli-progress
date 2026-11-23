const _assert = require('assert');
const _progress = require('../../cli-progress');

describe('multi-bar stop', function() {
    let multibar = null;
    let output = '';

    afterEach(() => {
        multibar.stop();
    });

    [false, true].forEach((clearOnComplete) => {
        [false, true].forEach((rendered) => {
            it(`should flush pending logs with clearOnComplete=${clearOnComplete}, rendered=${rendered}`, () => {
                multibar = new _progress.MultiBar({
                    stream: {
                        isTTY: true,
                        columns: 80,
                        write: (s) => { output += s; }
                    },
                    format: '{name} {value}/{total}',
                    clearOnComplete: clearOnComplete
                });
                multibar.create(100, 0, {name: 'First long bar'});
                multibar.create(100, 0, {name: 'Second long bar'});
                if (rendered){
                    multibar.update();
                }
                output = '';

                multibar.log('a\n');
                multibar.log('b\n');
                multibar.stop();

                const expected = '\x1B[?7h' + (rendered ? '\x1B[1A' : '')
                    + '\x1B[1G\x1B[0Ja\nb\n'
                    + (clearOnComplete ? '\x1B[0J' : '\x1B[1GFirst long bar 0/100\x1B[0K\n'
                        + '\x1B[1GSecond long bar 0/100\x1B[0K\n');

                _assert.equal(output, expected);
                _assert.deepStrictEqual(multibar.loggingBuffer, []);
                _assert.strictEqual(multibar.timer, null);

                multibar.stop();
                _assert.equal(output.split('a\n').length - 1, 1);
                _assert.equal(output.split('b\n').length - 1, 1);
                _assert.strictEqual(multibar.timer, null);
            });
        });
    });
});
