const _assert = require('assert');
const ETA = require('../../lib/eta');

describe('eta', function() {
    const length = 3;
    const eta = new ETA(length, 0, 0);

    it('has an initial value is zero', () => {
        _assert.equal(eta.getTime(), 0);
    });

    it('calculates value after updates', () => {
        eta.update(1000, 1, 100);
        _assert.equal(eta.getTime(), 99);
    });

    it('loops after length updates', () => {
        eta.update(2000, 2, 100);
        eta.update(3000, 3, 100);
        _assert.equal(eta.getTime(), 97);
    });

    it('has same-value optimizations to prevent INF', () => {
        eta.update(0, 3, 100);
        eta.update(1000, 3, 100);
        eta.update(2000, 3, 100);
        eta.update(3000, 3, 100);
        _assert.equal(eta.getTime(), 97);
    });

    it('has same-time optimizations to prevent zero', () => {
        const eta = new ETA(length, 0, 0);
        eta.update(1000, 0, 100);
        eta.update(2000, 1, 100);
        eta.update(3000, 2, 100);
        eta.update(3000, 3, 100);
        eta.update(3000, 4, 100);
        _assert.equal(eta.getTime(), 48);
    });
});
