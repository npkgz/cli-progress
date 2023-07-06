// Unicode Braille Pattern Dot style
// as used in Docker CLI
// ⣀⣄⣤⣦⣶⣷⣿

module.exports = {
    format: ' {bar} {percentage}% | ETA: {eta}s | {value}/{total}',
    barCompleteChar: ['\u28C4', '\u28E4', '\u28E6', '\u28F6', '\u28F7', '\u28FF'],
    barIncompleteChar: '\u28C0',
};
