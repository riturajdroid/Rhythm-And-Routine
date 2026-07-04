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


## Lookahead Scheduler — how it works

### The core problem it solves
setInterval is not accurate enough to trigger sounds directly.
The JS event loop can delay a timer by 10-50ms under load.
That means your rhythm drags and stutters unpredictably.
The lookahead pattern solves this by separating scheduling from triggering.

### The key insight
setInterval is only used to CHECK what needs scheduling.
The actual sound trigger time is handed to AudioContext.currentTime math.
AudioContext.currentTime is sample-accurate — the browser's audio clock,
completely unaffected by JS event loop congestion.

### How the loop works
Every 25ms (interval), scheduler() runs.
It checks: is the next note's scheduled time within the next 0.1 seconds (lookAhead)?
If yes — schedule it via makeSound(nextNoteTime) and advance nextNoteTime forward.
If no — do nothing, exit, wait for next interval tick.

The while loop keeps scheduling until it runs out of notes inside the window.
So one scheduler() call might schedule 0 notes, 1 note, or several notes
depending on how many fall inside the lookahead window.

### The variables
- nextNoteTime: the AudioContext time when the NEXT note should fire
- lookAhead: how far ahead (in seconds) to schedule. 0.1 = 100ms window
- interval: how often (in ms) the scheduler checks. 25ms = 40 times per second
- ctx.currentTime: the audio clock right now, in seconds since AudioContext was created

### The math
barLength = (60 / bpm) * 4        // 4 beats in a 4/4 bar
stepDuration = barLength / steps   // each track divides the bar by its step count

at 120 BPM:
barLength = (60/120) * 4 = 2 seconds
4-step track: each step = 2/4 = 0.5 sec
3-step track: each step = 2/3 = 0.667 sec
— these two tracks together = 3 against 4 polyrhythm

### Why the while loop and not an if statement
An if statement only schedules one note per interval tick.
At fast tempos, step duration might be shorter than the interval (25ms).
The while loop keeps scheduling until all notes inside the window are covered,
so no notes get missed regardless of tempo.

### The two systems that must stay decoupled
Scheduler  — runs on setInterval, reads AudioContext.currentTime, schedules sounds
Playhead   — runs on requestAnimationFrame, reads scheduler event queue, updates DOM
These must never be mixed. Scheduler never touches DOM. Playhead never triggers sound.