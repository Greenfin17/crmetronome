
const getProgress = (sequence, elapsedTime) => {
    let totalTime = 0;
    let i;
    let beats = 0;
    for ( i = 0; i < sequence.length; i++) {
        beats = sequence[i].pattern.reduce((a,b) => a + b, 0);
        //console.warn(beats);
        //console.warn(sequence[i].tempo);
        totalTime += beats * (60/sequence[i].tempo / sequence[i].unit) * sequence[i].reps;
    }
    let progressPercentage = elapsedTime / totalTime * 100;
    return progressPercentage;
}

export default getProgress;
