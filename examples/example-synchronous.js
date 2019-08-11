var _progress = require('../cli-progress');

// long running, recursive function (blocking operation)
// well it's no optimized and not for productive use but it's an easy way to implement a long-running & blocking operation without third-party modules
function fibonacci(n) {
    if (n < 2) {
        return 1;
    }else {
        return fibonacci(n - 2) + fibonacci(n - 1);
    }
}

function run(options, limit){
    // create new progress bar using default values
    var bar = new _progress.Bar(options);
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
    console.log('\nFibonacci (1-', fibonacciNumbers.length,'): ', fibonacciNumbers.join(', '), '\n');
}

console.log('\nCalculation without synchronous updates');
run({
    format: 'Fibonacci Calculation Progress [{bar}] {percentage}% | ETA: {eta}s | Current: F({value})',
    hideCursor: true,
    synchronousUpdate: false
}, 40);

console.log('\nCalculation WITH synchronous updates');
run({
    format: 'Fibonacci Calculation Progress [{bar}] {percentage}% | ETA: {eta}s | Current: F({value})',
    hideCursor: true,
    synchronousUpdate: true
}, 43);


