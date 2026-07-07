let bpm;
let isPlaying = false;
let nextNoteTime = 0;

function setBPM(tempo) {
    bpm = tempo;
}

function getBarLength() {
    return ((60 / bpm) * 4);
}

function getStepDuration(steps) {
    return getBarLength() / steps;
}

const lookAhead = 0.1;
const interval = 25;
let schedulerTimer = null;

function scheduler() {
    const ctx = getAudioContext();
    const anySoloed = tracks.some(t => t.solo);

    tracks.forEach(track => {
        while (track.nextNoteTime < ctx.currentTime + lookAhead) {
            const swingOffset = (track.currentStep % 2 !== 0) ? (swingval / 100) * (getStepDuration(track.steps) / 2) : 0;
            const shouldPlay = anySoloed ? track.solo : !track.mute;
            if (shouldPlay && track.pattern[track.currentStep] === 1) {
                makeSound(track.nextNoteTime, track.voice, track.volume);
            }
            eventQueue.push({
                time: track.nextNoteTime,
                trackIndex: tracks.indexOf(track),
                stepIndex: track.currentStep
            });
            track.currentStep = (track.currentStep + 1) % track.steps;
            track.nextNoteTime += getStepDuration(track.steps); // uses its own step count
        }
    });
}

function startScheduler() {
    const startTime = getAudioContext().currentTime;
    tracks.forEach(track => {
        track.nextNoteTime = startTime;
        track.currentStep = 0;
    });
    schedulerTimer = setInterval(scheduler, interval);
    isPlaying = true;
}

function stopScheduler() {
    clearInterval(schedulerTimer);
    isPlaying = false;
    tracks.forEach(track => track.currentStep = 0);
}



//visual layer

const eventQueue = [];
