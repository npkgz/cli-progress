const _readline = require('readline');

// low-level terminal interactions
class Terminal{

    constructor(outputStream){
        this.stream = outputStream;

        // default: line wrapping enabled
        this.linewrap = true;
    }

    // save cursor position + settings
    cursorSave(){
        this.stream.write('\x1B7');
    }

    // restore last cursor position + settings
    cursorRestore(){
        this.stream.write('\x1B8');
    }

    // show/hide cursor
    cursor(enabled){
        if (enabled){
            this.stream.write('\x1B[?25h');
        }else{
            this.stream.write('\x1B[?25l');
        }
    }

    // change cursor positionn
    cursorTo(x=null, y=null){
        _readline.cursorTo(this.stream, x, y);
    }

    // clear to the right from cursor
    clearRight(){
        _readline.clearLine(this.stream, 1);
    }

    // clear the full line
    clearLine(){
        _readline.clearLine(this.stream, 0);
    }

    // write content to output stream
    // @TODO use string-width to strip length
    write(s){
        // line wrapping enabled ? trim output
        if (this.linewrap === true){
            this.stream.write(s.substr(0, this.getWidth()));
        }else{
            this.stream.write(s);
        }
    }

    // control line wrapping
    lineWrapping(enabled){
        // store state
        this.linewrap = enabled;
        if (enabled){
            this.stream.write('\x1B[?7h');
        }else{
            this.stream.write('\x1B[?7l');
        }
    }

    // tty environment ?
    isTTY(){
        return (this.stream.isTTY === true);
    }

    // get terminal width
    getWidth(){
        return this.stream.columns || 80;
    }
}

module.exports = Terminal;
