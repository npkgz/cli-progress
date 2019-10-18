module.exports = {
    options: {
        throttleTime: 100,
        stream: null,
        terminal: null,
        clearOnComplete: false,
        stopOnComplete: false,
        barsize: 40,
        align: 'left',
        hideCursor: false,
        linewrap: false,
        barCompleteString: '████████████████████████████████████████',
        barIncompleteString: '░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░',
        format: ' {bar} {percentage}% | ETA: {eta}s | {value}/{total}',
        etaBufferLength: 10,
        synchronousUpdate: true,
        noTTYOutput: false,
        notTTYSchedule: 2000,
        emptyOnZero: false,
        forceRedraw: false
    },
    params: {
        progress: 0.2,
        eta: '20',
        startTime: 1571383670022,
        total: 100,
        value: 20,
        maxWidth: 147
    },
    payload: {

    }
};