import * as cliProgress from '../cli-progress.js';
import timers from 'node:timers';

const total = 20_000_000;
const incrementsPerYield = 1_000;
const etaBuffer = 100;

const progress = new cliProgress.SingleBar({etaBuffer});
progress.start(total, 0);

console.time("duration: ");
for (let i = 0; i < total; i += incrementsPerYield) {
    for (let j = 0; j < incrementsPerYield; j++) progress.increment();
    await timers.promises.scheduler.yield()
}
progress.stop();
console.timeEnd("duration: ");
