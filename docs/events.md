Events
======================================

The classes extends [EventEmitter](https://nodejs.org/api/events.html) which allows you to hook into different events.

Please take a look into the source code to get a closer look on the call order.

**NOTE** - in case you need additional events, don't hesitate to request them via an issue or pull request!

single-bar and multi-bar elements
--------------------------------------

### evt::start ###

Triggered after `start()` is called

```js
const cliProgress = require('cli-progress');

const bar1 = new cliProgress.SingleBar();

bar1.on('start', () => {
    console.log('bar started');
});
```

### evt::stop ###

Triggered after `stop()` is called

### evt::redraw-pre ###

Triggered before the current line is updated

### evt::redraw-post ###

Triggered after the current line is updated

multi-bar
--------------------------------------

### evt::start ###

Triggered after a bar element is created and `start()` is called

```js
const cliProgress = require('cli-progress');

const bar1 = new cliProgress.MultiBar();

bar1.on('start', () => {
    console.log('sub-bar element started');
});
```

### evt::stop ###

Triggered after `stop()` is called

### evt::stop-pre-clear ###

Triggered when `stop()` is called and the cursor is restored/reset to top position but **before** the final rendering/clearing is triggered.

### evt::update-pre ###

Triggered when `update()` is called.
Before any output is written to the terminal.

### evt::redraw-pre ###

Triggered when `update()` is called.
After cursor is resettet to initial position. Before the bar elements are rendered.

### evt::redraw-post ###

Triggered when `update()` is called.
After cursor is resettet to initial position. After the bar elements are rendered.

### evt::update-post ###

Triggered when `update()` is called.
After cursor is resettet to initial position. After the bar elements are rendered. After newline spacing is added in no-tty mode.