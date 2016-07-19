### 1.2.0 ###
* Added: `increment()` method to increase the current progress relatively - thanks to [lennym on GitHub](https://github.com/lennym) #6
* Added: ETA time formatting options (mm:ss, hh:mm, ss) - thanks to [lennym on GitHub](https://github.com/lennym) #5
* Improvement: More accurate ETA calculation using linear estimation of last N values - thanks to [lennym on GitHub](https://github.com/lennym) #4
* Bugfix: FPS calculation error which caused performance issues - thanks to [lennym on GitHub](https://github.com/lennym) #7

### 1.1.2 ###
* Bugfix: stdout.cursorTo/stdout.clearLine is not a function; replaced by `readline` - thanks to [remcoder on GitHub](https://github.com/AndiDittrich/Node.CLI-Progress/pull/2)

### 1.1.1 ###
* Bugfix: Hide cursor options was enabled by default

### 1.1.0 ###
* Added: Support for synchronous operations (interval has been replaced by timeout and throttle time) - feature requested [GitHub](https://github.com/AndiDittrich/Node.CLI-Progress/issues/1)
* Added: Synchronous Operation Example `example-synchronous.js`
* Added: Option to hide the cursor `options.hideCursor` - default set to false
* Changed: Improved ETA calculation

### 1.0.1 ###
* Bugfix: the bar-size is limited to `options.barsize` - in some (numerical) situations it can be too long (n+1)

### 1.0.0 ###
* Initial public release