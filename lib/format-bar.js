let platformSpace = 0;
if (process.platform === 'win32'){
  // win10 cmd line need a space at the end
  platformSpace = 1;
}
// format bar
module.exports = function formatBar(progress, options){
    // calculate barsize
    let columns = options.barsize;
    if (options.autoExpand) {
      columns = (options.stream && options.stream.columns) ? options.stream.columns : columns;
      columns = columns - options.restWidth - platformSpace;

      // dynamic width handling, on window resize and change of other context parameters
      options.barCompleteString = (new Array(columns + 1 ).join(options.barCompleteChar));
      options.barIncompleteString = (new Array(columns + 1 ).join(options.barIncompleteChar));
    }

    const completeSize = Math.round(progress*columns);
    const incompleteSize = columns-completeSize;

    // generate bar string by stripping the pre-rendered strings
    return options.barCompleteString.substr(0, completeSize) +
           options.barGlue +
           options.barIncompleteString.substr(0, incompleteSize);
}
