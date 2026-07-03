# Project Notes — Rhythm & Routine

Personal learning notes written while building this project.
Not polished documentation — raw understanding captured in the moment.

---
## Web Audio API

### Audio Context
its like the master volume , needed one per page , develops the overall environment that manages the audio hardware, sample rate , and master clock.

### Oscillator Node
oscillator is raw sound wave generator 
it has shapes like 'sine','square','sawtooth','triangle' and a pitch 'frequency.value'
incredibly cheap to compute."FIRE AND FORGET".
You do not create one master kick oscillator and keep changing its pitch for every note. You create a brand new one, play it, and throw it away for every single drum hit. The AudioContext automatically cleans them up from memory when they stop.

### .connect() method
it pulgs the oscillator to the audiocontext 
The .connect() method is how you route a synth channel to a mixer insert or the master output.


osc.connect(gainNode) is like routing an instrument into a mixer track where you have a fader or a volume envelope.

gainNode.connect(audioCtx.destination) routes that mixer track to the Master Output (your speakers).


### setValueAtTime(value, time)
This is your anchor. It tells the browser, "At exactly this time, set the parameter to this value instantly."

Without this, the browser doesn't know where to start the ramp from, and it will often default to the last known value, which might lead to weird jumps. You always want to set your "starting state" immediately before you start an automation.

### exponentialRampToValueAtTime(value, time)
This is your transition. It creates a smooth curve from point A to point B.

Why Exponential? Pitch and volume are perceived logarithmically by the human ear. If you used a linear ramp to change frequency (e.g., 1000Hz to 20Hz), the pitch would sound like it stays high for a long time and then crashes at the very end. An exponential ramp sounds natural—it feels like a physical drum membrane decaying.
### signal chain (Oscillator → GainNode → Destination)

## Web Audio API — what I learned

- One AudioContext per app. Create it lazy (only on first user gesture).
- Browsers suspend AudioContext by default. Always check .state and call .resume().
- Audio nodes must be explicitly connected: osc → gain → ctx.destination
- .start(time) and .stop(time) use AudioContext.currentTime, not wall clock time.
  This is what makes scheduling accurate.
- exponentialRampToValueAtTime cannot ramp to zero. Use 0.001 for gain, 40 for frequency floor.
- Frequency sweep for kick: 150hz → 40hz over ~100ms gives the "thud" shape.