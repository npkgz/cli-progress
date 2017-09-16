### 1.6.0 ###
* Added: Additional payload data which can be used as **custom-tokens** within the bar - thanks to [tobiasps on GitHub](https://github.com/AndiDittrich/Node.CLI-Progress/pull/15) #15

### 1.5.1 ###
* Bugifx: Progressbar cannot be initialized to 0% - thanks to [erikkallen on GitHub](https://github.com/AndiDittrich/Node.CLI-Progress/pull/14) #13
* Bugfix: ETA was **NULL** in case the progress bar is initialized with (0/0)

### 1.5.0 ###
* Added: **0** values for total/progress initialization are allowed - feature requested by [jfmmm on GitHub](https://github.com/AndiDittrich/Node.CLI-Progress/issues/11) #11

### 1.4.0 ###
* Added: **Preset/Theme support**. Different bar-styles can be loaded from internal library (in addition to full customization)
* Added: Dependency **colors** for colorized progress bars 
* Added: Preset `legacy`
* Added: Preset `shades-classic`
* Added: Preset `shades-grey`
* Added: Preset `rect`

### 1.3.1 ###
* Added: `example-notty` to test the behaviour of progress bar in non-interactive environments (input streams closed)
* Bugfix: `update()` throws an error in **non-tty** environments - reported by [Ognian on GitHub](https://github.com/AndiDittrich/Node.CLI-Progress/issues/9) #9

### 1.3.0 ###
* Added: `stopOnComplete` option to automatically call `stop()` when the value reaches the total - thanks to [lennym on GitHub](https://github.com/lennym) #7

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