
const getProgress = (sequence, iterator, progressTotal) => {
    let totalTime = 0;
    let i;
    let beats = 0;
    for ( i = 0; i < sequence.length; i++) {
        beats = sequence[i].pattern.reduce((a,b) => a + b, 0);
        //console.warn(beats);
        //console.warn(sequence[i].tempo);
        totalTime += beats * (60/sequence[i].tempo) * sequence[i].reps;
    }
    let progressPercentage = progressTotal / totalTime * 100;
    /*
    console.warn('total time is ' + totalTime);
    for ( i = 0; i < iterator.current.i; i++) {
        beats = sequence[i].pattern.reduce((a,b) => a + b, 0);
        currentTime += beats * (60/sequence[i].tempo) * sequence[i].reps;
    }
    beats = 0;
    for ( i = 0; i < iterator.current.l; i++) {
        beats++;
    }
        currentTime += beats * (60/sequence[iterator.current.i].tempo);

    let progressPercentage = currentTime / totalTime * 100;
    console.warn(progressPercentage);
    console.warn(iterator.current.i);
    */
    return progressPercentage;
}

export default getProgress;
