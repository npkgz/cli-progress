
module.exports = class ShutdownListener {
  constructor(signals, cleanupFunction, processOverride) {
    this._signals = signals;
    this._isSignalReceived = false;
    this._isAttached = false;
    this._process = processOverride ? processOverride : process;
    this._handler = (signal) => {
      if (this._isSignalReceived) {
        return;
      }
      try {
        this._isSignalReceived = true;
        cleanupFunction();
      } catch (e) {
        console.log(e);
      } finally {
        this._signals.forEach(sig => this._process.removeListener(sig, this._handler));
        this._process.kill(this._process.pid, signal);
      }
    }
  }
  attach() {
    if (this._isAttached) {
      return;
    }
    console.log('attach');
    this._signals.forEach(sig => {
      this._process.on(sig, this._handler)
    });
    this._isAttached = true;
  }
  detach() {
    if (this._isSignalReceived) {
      return;
    }
    this._signals.forEach(sig => this._process.removeListener(sig, this._handler));
    this._isAttached = false;
    console.log('detach');
  }
}
