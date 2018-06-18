const _cliProgress = require('../cli-progress');
const _util = require('util');
const sleep = _util.promisify(setTimeout);

const bar1 = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic);

async function updateBar() {
    bar1.update(1);
    await sleep(3600);
}

bar1.start(99999999999999999999999999999999999999999999999999999999, 0);

// update the current value in your application..
Promise.resolve().then(function resolver() {
    return updateBar()
        .then(resolver);
});