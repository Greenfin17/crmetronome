
const getProgress = (sequence, iterator, startTime, currentTime) => {
    let totalTime = 0;
    let i;
    for ( i = 0; i < sequence.length; i++) {
          const beats = sequence[i].pattern.reduce((a,b) => a + b, 0);
          //console.warn(beats);
          //console.warn(sequence[i].tempo);
          totalTime += beats * (60/sequence[i].tempo) * sequence[i].reps;
    }
    console.warn(totalTime);
    let progressPercentage = (currentTime - startTime) / totalTime * 100;
    console.warn(progressPercentage);
    console.warn(iterator.current.i);
    return progressPercentage;
}

export default getProgress;