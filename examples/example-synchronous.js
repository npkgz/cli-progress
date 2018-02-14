var _progress = require('./main');
var limit = 43;

// long running, recursive function (blocking operation)
// well it's no optimized and not for productive use but it's an easy way to implement a long-running & blocking operation without third-party modules
function fibonacci(n) {
    if (n < 2) {
        return 1;
    }else {
        return fibonacci(n - 2) + fibonacci(n - 1);
    }
}

// create new progress bar using default values
var bar = new _progress.Bar({
    format: 'Fibonacci Calculation Progress [{bar}] {percentage}% | ETA: {eta}s | Current: F({value})',
    hideCursor: true
});
bar.start(limit, 1);

var fibonacciNumbers = [];

// calculate the Nth fibonacci
// this loop is executed synchronous - no timer/interval callbacks will be executed
for (var i = 1; i <= limit; i++) {
    fibonacciNumbers.push(fibonacci(i));
    bar.update(i);
}

bar.stop();

// display the numbers:
console.log('\nFibonacci (1-', fibonacciNumbers.length,'): ', fibonacciNumbers.join(', '));
