// format bar
module.exports = function formatBar(progress, options){
    if (Array.isArray(options.barCompleteChar) && options.barCompleteChar.length > 1) {
        const completeSize = Math.floor(progress * options.barsize);
        const incompleteSize = Math.floor(options.barsize * (1 - progress));
        const remainder = progress * options.barsize - completeSize;
        const remainderChar = remainder > 0 ?
            options.barCompleteChar[Math.round(remainder * options.barCompleteChar.length) - 1] :
            "";
        return options.barCompleteString.slice(0, completeSize) +
            remainderChar +
            options.barGlue +
            options.barIncompleteString.slice(0, incompleteSize);
    }

    // calculate barsize
    const completeSize = Math.round(progress * options.barsize);
    const incompleteSize = options.barsize - completeSize;
    // generate bar string by stripping the pre-rendered strings
    return options.barCompleteString.slice(0, completeSize) +
        options.barGlue +
        options.barIncompleteString.slice(0, incompleteSize);
}
