let bpm;
let isPlaying=false;
let nextNoteTime=0;

function setBPM(tempo){
    bpm=tempo;
}

function getBarLength(){
    return ((60/bpm)*4);
}

function getStepDuration(steps){
    return getBarLength()/steps;
}

const lookAhead=0.1;
const interval=25;

let schedulerTimer=null;

function scheduler(){
    const ctx=getAudioContext();
    while(nextNoteTime<ctx.currentTime+lookAhead){
        makeSound(nextNoteTime);
        nextNoteTime+=getStepDuration(4);
    }
}

function startScheduler() {
    nextNoteTime = getAudioContext().currentTime;
    schedulerTimer = setInterval(scheduler, interval);
    isPlaying = true;
}

function stopScheduler() {
    clearInterval(schedulerTimer);
    isPlaying = false;
}