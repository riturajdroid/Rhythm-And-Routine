let audioCtx;

function getAudioContext(){
    if(!audioCtx){
        audioCtx=new AudioContext();
    }
    if(audioCtx.state==='suspended'){
        audioCtx.resume();
    }
    return audioCtx;
}

function makeSound(time){
    if(time===undefined){
        console.log("No time given");
        return;
    }

    const ctx=getAudioContext();
    const osc=ctx.createOscillator();
    const gain=ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(150,time);
    osc.frequency.exponentialRampToValueAtTime(0.01,time+0.1);
    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

    osc.start(time);
    osc.stop(time+0.1);
}

/*
Those two lines are your Volume Envelope. In audio terminology, gain is just the technical word for volume.

If the first two lines control the pitch of the drum (the "thump"), these two lines control the fade out (the "tail" or "decay").

Here is the breakdown of exactly what is happening:

gain.gain explained
When you created the gain node (const gain = audioCtx.createGain();), you created a virtual volume fader. To actually move that fader up and down, you have to access its .gain property. That is why it looks a little repetitive: gain.gain.

Line by Line
gain.gain.setValueAtTime(1, time);
This tells the volume fader to snap to 1 (which means 100% volume) at the exact millisecond the drum hit starts.

gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
This tells the volume fader to smoothly slide down from 100% to 0.01 (1% volume) over the course of 0.1 seconds.

Why do we need this?
If you delete those two lines, the volume stays at a constant 100% for the entire 0.1 seconds. Then, when osc.stop(time + 0.1) fires, the sound is abruptly chopped off while it is still blaring at maximum volume.

In the physical world, sound never stops instantly like that. If a speaker is pushed all the way out and the power is instantly cut, the speaker cone snaps back to zero violently. That violent snap creates a harsh, digital "click" or "pop" artifact at the end of the sound. (It's also exactly what triggered your headphone's safety shutoff earlier when combined with that sub-sonic frequency!).

By exponentially fading the volume down to near-zero before you stop the oscillator, you mimic how a real drum naturally rings out and fades into silence.
*/