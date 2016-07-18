CLI-Progress
============
Easy to use Progress-Bar for Command-Line/Terminal Applications

```bash
$ npm install cli-progress
```

![Demo](https://github.com/AndiDittrich/Node.CLI-Progress/raw/master/video.gif)

Features
--------

* **Simple**, **Robust** and **Easy** to use
* Full customizable output format (various placeholders are available)
* Custom Bar Characters
* FPS limiter
* ETA calculation based on elapsed time
* Only visible in TTY environments
* No callbacks required - designed as pure, external controlled UI widget
* Works in Asynchronous and Synchronous tasks

*Successful tested on Windows10, Debian 8.2 and Ubuntu 14 LTS*

Installation
------------

You can install cli-progress with [NPM](http://www.npmjs.com/package/cli-progress)

```bash
$ npm install cli-progress
```

Or manually from the [GitHub Repository](https://github.com/AndiDittrich/Node.CLI-Progress/releases/latest)

```bash
$ wget https://github.com/AndiDittrich/Node.CLI-Progress/archive/v1.1.0.tar.gz
```

Progress-Bar
------------

### Getting Started ###

You can find some basic examples in [example.js](https://github.com/AndiDittrich/Node.CLI-Progress/blob/master/example.js) - just run the file with `$ node example.js` 

### Usage ###

```js
var _progress = require('cli-progress');

// create a new progress bar instance
var bar1 = new _progress.Bar();

// start the progress bar with a total value of 200 and start value of 0
bar1.start(200, 0);

// update the current value in your application..
bar1.update(100);

// stop the progress bar
bar1.stop();
```

### Methods/Syntax ###

#### Constructor ####

Initialize a new Progress bar. An instance can be used **multiple** times! it's not required to re-create it!

```js
var <instance> = new namespace.Bar(options:object);
```

#### start() ####

Starts the progress bar and set the total and initial value

```js
<instance>.start(totalValue:int, startValue:int);
```

#### update() ####

Sets the current progress value

```js
<instance>.update(currentValue:int);
```

#### increment() ####

Increases the current progress value by a specified amount (default +1)

```js
<instance>.increment(delta:int);
```

#### stop() ####

Stops the progress bar and go to next line

```js
<instance>.stop();
```


### Bar Formatting ###

The progressbar can be customized by using the following build-in placeholders. They can be combined in any order.

- `{bar}` - the progress bar, customizable by the options **barsize**, **barCompleteString** and **barIncompleteString**
- `{percentage}` - the current progress in percent (0-100)
- `{total}` - the end value
- `{value}` - the current value set by last `update()` call
- `{eta}` - expected time of accomplishment in seconds
- `{duration}` - elapsed time in seconds
- `{eta_formatted}` - expected time of accomplishment formatted into appropriate units
- `{duration_formatted}` - elapsed time formatted into appropriate units

#### Example ####

```
progress [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}
```

is rendered as

```
progress [========================================] 100% | ETA: 0s | 200/200
```

### Options ###

- `format` (type:string) - progress bar output format @see format section
- `fps` (type:float) - the maximum update rate (default: 10)
- `stream` (type:stream) - output stream to use (default: `process.stderr`)
- `clearOnComplete` (type:boolean) - clear the progress bar on complete / `stop()` call (default: false)
- `barsize` (type:int) - the length of the progress bar in chars (default: 40)
- `barCompleteString` (type:char) - character to use as "complete" indicator in the bar (default: "=")
- `barIncompleteString` (type:char) - character to use as "incomplete" indicator in the bar (default: "-")
- `hideCursor` (type:boolean) - hide the cursor during progress operation; restored on complete (default: false)
- `etaBuffer` (type:int) - number of updates with which to calculate the eta; higher numbers give a more stable eta (default: 10)

#### Example ####

```js
// change the progress characters
// set fps limit to 5
// change the output stream and barsize
var b2 = new _progress.Bar({
    barCompleteChar: '#',
    barIncompleteChar: '.',
    fps: 5,
    stream: process.stdout,
    barsize: 65
});
```

Any Questions ? Report a Bug ? Enhancements ?
---------------------------------------------
Please open a new issue on [GitHub](https://github.com/AndiDittrich/Node.CLI-Progress/issues)

License
-------
CLI-Progress is OpenSource and licensed under the Terms of [The MIT License (X11)](http://opensource.org/licenses/MIT). You're welcome to [contribute](https://github.com/AndiDittrich/Node.CLI-Progress/blob/master/CONTRIBUTE.md)!