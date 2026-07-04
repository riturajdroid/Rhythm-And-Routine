# Rhythm & Routine — Polyrhythm Practice Engine

> A multi-track step sequencer with independent time signatures, built entirely in vanilla JavaScript using the Web Audio API.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![Phase](https://img.shields.io/badge/phase-2%20of%204-blue)
![Stack](https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20Vanilla%20JS-green)

---

## What This Is

A browser-based rhythm tool where each track can run its own independent step count and time signature — all locked to a shared master clock. A 3-step track running alongside a 4-step track produces a genuine 3-against-4 polyrhythm without any manual timing math. The tool targets musicians, producers, and rhythm students who want to hear and feel complex polyrhythms interactively.

No frameworks. No build tools. No backend. Runs entirely in the browser.

---

## Live Demo

> 🔗 _Link will be added once deployed to GitHub Pages_

---

## Current State — Phase 2 (Audio Core)

### What works right now
- Header bar with tempo slider, swing slider, metronome toggle, master volume, save/load buttons
- Add Track button dynamically injects a new track row into the DOM
- Per-track step count (+ / −) updates tile grid via event delegation on the parent container
- Mute button toggles visual state per track
- Per-track volume slider rendered and styled
- Step tiles render correctly per track based on step count
- Tile click-to-toggle (active/inactive visual state)
- Solo button logic (interaction with mute state across tracks)
- Web Audio API integration (AudioContext, sound on click)
- Lookahead scheduler (sample-accurate timing loop)

### What is not built yet
- [ ] Track linking to metronome
- [ ] Visual playhead (requestAnimationFrame loop, decoupled from scheduler)
- [ ] Pattern save/load (localStorage serialization)
- [ ] Per-track voice/sample selection
- [ ] Swing offset applied to scheduler timing

---

## Roadmap

### Phase 1 — UI Shell ✅ _(done)_
HTML structure, CSS layout, dynamic track injection, slider wiring, event delegation for track controls.

### Phase 2 — Audio Core 🔲 _(current)_
`AudioContext` setup, single-track lookahead scheduler, BPM-accurate step firing, play/stop transport.

### Phase 3 — Polyrhythm Engine 🔲
Multi-track independent time signatures, per-track step duration math against shared master bar, visual playhead synced via `requestAnimationFrame`.

### Phase 4 — Polish & Portfolio Release 🔲
Swing timing offset, per-track sample upload (`decodeAudioData`), pattern save/load to localStorage, export as JSON, UI visual pass, README demo video, GitHub Pages deploy.

---

## Architecture Notes

> _This section will grow as the audio engine is built. Documenting the scheduler here is important — it's the part technical reviewers will ask about._

### Scheduler design (planned)
The sequencer will use the **lookahead scheduler pattern** rather than `setInterval` for sound triggering. This is the same approach used in professional DAWs and browser-based audio tools.

**Why not `setInterval`:** JavaScript timers fire late under load. A `setInterval(callback, 16)` that's supposed to fire every 16ms may fire at 30–50ms under tab pressure, causing audible timing drift in the rhythm.

**How the lookahead pattern works:**
- A `setInterval` runs frequently (every ~25ms) only to *check* what needs scheduling.
- Actual note trigger times are computed using `AudioContext.currentTime`, which is sample-accurate and unaffected by JS event loop congestion.
- Each note is scheduled into the future by a small lookahead window (~120ms), giving the audio engine time to guarantee accurate playback.
- Visual playhead updates are handled by a **separate** `requestAnimationFrame` loop that reads scheduler state — it does not drive the audio. This decoupling is the key architectural decision.

```
setInterval (25ms)           requestAnimationFrame
      |                               |
      ▼                               ▼
  scheduler()                  animatePlayheads()
  reads AudioContext.now()     reads _events[] queue
  schedules future notes       updates DOM step highlights
  pushes to _events[]
```

> _Full implementation notes will be added in Phase 2._

---

## Key JavaScript Concepts This Project Covers

| Concept | Where it appears |
|---|---|
| Event delegation | Single click listener on `mainBox` handles all track controls |
| DOM manipulation | Dynamic track/tile injection via `insertAdjacentHTML` |
| Web Audio API | `AudioContext`, `AudioBufferSourceNode`, `GainNode` (Phase 2) |
| Lookahead scheduling | `AudioContext.currentTime` math for sample-accurate timing (Phase 2) |
| `requestAnimationFrame` | Decoupled visual playhead loop (Phase 3) |
| State management | Single source of truth for tracks, patterns, playback state (Phase 2+) |
| `localStorage` | Pattern serialization and retrieval (Phase 4) |
| Closures | Per-track state encapsulation in scheduler callbacks (Phase 2) |

---

## File Structure

```
rhythm-and-routine/
├── index.html       # HTML shell — header, main track container
├── style.css        # All styles — layout, sliders, tiles, track controls
├── ui.js            # DOM interaction — track creation, event delegation
├── scheduler.js     # (Phase 2) Audio scheduling engine
├── audio.js         # (Phase 2) AudioContext setup, voice synthesis
├── AudioManagement.md #Notes for using Audio API    
└── README.md
```

---

## How to Run

No build step, no dependencies, no server required.

```bash
git clone https://github.com/riturajdroid/rhythm-and-routine.git
cd rhythm-and-routine
# open index.html in any modern browser
```

Or just double-click `index.html`.

---

## Why This Exists

Built as a focused vanilla JavaScript learning project — the goal was to go deep on a real problem (polyrhythm practice tools are surprisingly bad and mostly paywalled) using only the browser's native APIs. No React, no Tone.js, no shortcuts.

The scheduling architecture specifically is what makes this non-trivial and resume-worthy — it's the same pattern used in production audio software, and it requires understanding how the JavaScript event loop, the Web Audio clock, and `requestAnimationFrame` interact as three separate timing systems.

---

## Build Log

| Date | Phase | What was built |
|---|---|---|
| Day 1 | Phase 1 | Header bar, track injection, step +/−, mute toggle, event delegation, Tile click-to-toggle, solo logic |
| Day 2 | Phase 2 | AudioContext, single sound on click |
| Day 3 | Phase 2 | Lookahead scheduler, BPM math , play/stop |



---

## License

MIT — use it, fork it, learn from it.
