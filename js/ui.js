

const tempo = document.querySelector("#tempo");
const tempotext = document.querySelector(".tempotext");
let tempoval = tempo.value;
setBPM(tempoval)
console.log(tempoval)
tempotext.innerHTML = `Tempo:${tempoval}`;
tempo.oninput = function () {
  tempoval = tempo.value;
  tempotext.innerHTML = `Tempo:${tempoval}`;
  setBPM(tempoval);
}



const swing = document.querySelector("#swing");
const swingtext = document.querySelector(".swingtext");
let swingval = swing.value;
console.log(swingval)
swingtext.innerHTML = `swing:${swingval}`;
swing.oninput = function () {
  swingval = swing.value;
  swingtext.innerHTML = `swing:${swingval}`;
}


const masterVolume = document.querySelector("#masterVolume");
const masterVolumeText = document.querySelector(".masterVolumeText");
let masterVolumeVal = masterVolume.value;
console.log(masterVolumeVal)
masterVolumeText.innerHTML = `Master Volume:${masterVolumeVal}`;
masterVolume.oninput = function () {
  masterVolumeVal = masterVolume.value;
  masterVolumeText.innerHTML = `Master Volume:${masterVolumeVal}`;
}


let numberOfTracks = 0;
const defaultSteps = 4;

const newTrack = document.querySelector(".addTrackButton");
const mainbody = document.querySelector(".mainBox");

let tracks = [];

newTrack.addEventListener('click', () => {
  
  numberOfTracks++;

  const newTrackObj = { 
    id: `track-${numberOfTracks}`, 
    steps: 4,
    pattern: [0, 0, 0, 0],
    volume: 0.6,
    mute: false,
    solo: false,
    currentStep: 0,
    nextNoteTime: 0,
  }
  tracks.push(newTrackObj)
  

  const track = `
    <div class="track" id="track-${numberOfTracks}"> <div class="trackDetails">
                <div class="trackName">Track ${numberOfTracks}</div>
                <div class="stepText">${tracks[numberOfTracks - 1].steps} steps</div> <div class="trackControls">
                    <div class="muteButton" id="mute-track-${numberOfTracks}">M</div>
                    <div class="soloButton" id="solo-track-${numberOfTracks}">S</div>
                    <div class="stepSetter">
                        <div class="minus" id="step-minus-track-${numberOfTracks}">-</div>
                        <div class="stepcount">${tracks[numberOfTracks - 1].steps}</div> <div class="plus" id="step-plus-track-${numberOfTracks}">+</div>
                    </div>
                </div>
                <input type="range" class="trackVolumeSlider" min="0" max="100" value="60" id="track-${numberOfTracks}-volume">
            </div>
            <div class="stepDesign" id="step-design-track-${numberOfTracks}">
            </div>
        </div>
  `;
  mainbody.insertAdjacentHTML('beforeend', track);
  const stepDesign = document.getElementById(`step-design-track-${numberOfTracks}`);
  let tilesHTML = '';
  for (let index = 0; index < 4; index++) {
    tilesHTML += `<div class="tile" id="track-${numberOfTracks}-tile-${index}"></div>`;
  }

  stepDesign.insertAdjacentHTML('beforeend', tilesHTML);
})

mainbody.addEventListener('click', (e) => {
  if (e.target.classList.contains('trackVolumeSlider')) {
    const trackID = e.target.id.split('-')[1];
    const trackIndex = trackID - 1;
    tracks[trackIndex].volume = e.target.value / 100;
  }
  if (e.target.classList.contains('plus')) {
    const trackID = e.target.id.split('-').pop();
    const trackIndex = trackID - 1; 

    if (tracks[trackIndex].steps > 9) return; 
    tracks[trackIndex].steps++; 
    tracks[trackIndex].pattern.push(0); 
    

    const stepDesign = document.getElementById(`step-design-track-${trackID}`);
    let tilesHTML = '';
    for (let index = 0; index < tracks[trackIndex].steps; index++) {
      
      tilesHTML += `<div class="tile" id="track-${trackID}-tile-${index}"></div>`;
    }
    stepDesign.innerHTML = tilesHTML;
    const trackElement = document.getElementById(`track-${trackID}`);

    
    const stepCount = trackElement.querySelector(".stepcount");
    stepCount.textContent = tracks[trackIndex].steps;

    
    const stepText = trackElement.querySelector(".stepText");
    stepText.textContent = `${tracks[trackIndex].steps} steps`;
  }

  if (e.target.classList.contains('minus')) {
    const trackID = e.target.id.split('-').pop();
    const trackIndex = trackID - 1; 

    if (tracks[trackIndex].steps < 2) return; 
    tracks[trackIndex].steps--; 
    tracks[trackIndex].pattern.pop(); 
    

    const stepDesign = document.getElementById(`step-design-track-${trackID}`);
    let tilesHTML = '';
    for (let index = 0; index < tracks[trackIndex].steps; index++) {
      
      tilesHTML += `<div class="tile" id="track-${trackID}-tile-${index}"></div>`;
    }
    stepDesign.innerHTML = tilesHTML;
    const trackElement = document.getElementById(`track-${trackID}`);

    
    const stepCount = trackElement.querySelector(".stepcount");
    stepCount.textContent = tracks[trackIndex].steps;

    
    const stepText = trackElement.querySelector(".stepText");
    stepText.textContent = `${tracks[trackIndex].steps} steps`;
  }

  if (e.target.classList.contains('muteButton')) {
    const trackControls = e.target.closest('.trackControls');
    const soloBtn = trackControls.querySelector('.soloButton');

    const trackID = e.target.id.split('-').pop();
    const trackIndex = trackID - 1; 

    if (e.target.style.backgroundColor === "") {
      e.target.style.backgroundColor = "red";
      e.target.style.scale = 1.3;
      tracks[trackIndex].mute = true; 
      soloBtn.style.backgroundColor = "";
      soloBtn.style.scale = 1;
      tracks[trackIndex].solo = false; 
    } else {
      e.target.style.backgroundColor = "";
      e.target.style.scale = 1;
      tracks[trackIndex].mute = false; 
    }
  }

  if (e.target.classList.contains('soloButton')) {
    const trackControls = e.target.closest('.trackControls');
    const muteBtn = trackControls.querySelector('.muteButton');

    const trackID = e.target.id.split('-').pop(); 
    const trackIndex = trackID - 1; 

    if (e.target.style.backgroundColor === "") {
      e.target.style.backgroundColor = "red";
      e.target.style.scale = 1.3;
      tracks[trackIndex].solo = true; 
      muteBtn.style.backgroundColor = "";
      muteBtn.style.scale = 1;
      tracks[trackIndex].mute = false; 
    } else {
      e.target.style.backgroundColor = "";
      e.target.style.scale = 1;
      tracks[trackIndex].solo = false; 
    }
  }

  if (e.target.classList.contains('tile')) {
    e.target.classList.toggle('active');
    const fullId = e.target.id;
    const numbers = fullId.match(/\d+/g);
    if (numbers && numbers.length >= 2) {
      const trackNumber = parseInt(numbers[0], 10);
      const trackIndex = trackNumber - 1; 
      const stepIndex = parseInt(numbers[1], 10);
      const isActive = e.target.classList.contains('active');
      tracks[trackIndex].pattern[stepIndex] = isActive ? 1 : 0; 
      console.log(tracks[trackIndex].pattern);
    }
  }
})


mainbody.addEventListener('input', (e) => {
  if (e.target.classList.contains('trackVolumeSlider')) {
    const trackID = e.target.id.split('-')[1];
    const trackIndex = trackID - 1;
    tracks[trackIndex].volume = e.target.value/100;
  }
});



const headerArea = document.querySelector(".header");
headerArea.addEventListener('click', (e) => {
  if (e.target.classList.contains('save')) {
    save();
  }
  if (e.target.classList.contains('load')) {
    load();
  }
})


function save() {
  const items = {
    bpm: tempoval,
    swing: swingval,
    tracks: tracks.map(t => ({
      id: t.id,
      steps: t.steps,
      pattern: t.pattern,
      volume: t.volume,
      mute: t.mute,
      solo: t.solo
    }))
  };
  const jsonString = JSON.stringify(items, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = "my_beat.json";
  link.click();
  URL.revokeObjectURL(url);
}



function load() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.click();

  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = (event) => {
      const data = JSON.parse(event.target.result);

      
      tempoval = data.bpm;
      setBPM(tempoval);
      document.querySelector('#tempo').value = tempoval;
      document.querySelector('.tempotext').innerHTML = `Tempo:${tempoval}`;

      
      swingval = data.swing;
      document.querySelector('#swing').value = swingval;
      document.querySelector('.swingtext').innerHTML = `swing:${swingval}`;

      
      tracks = [];
      numberOfTracks = 0;
      const existingTracks = mainbody.querySelectorAll('.track');
      existingTracks.forEach(t => t.remove());

      
      data.tracks.forEach(savedTrack => {
        numberOfTracks++;

        const trackObj = {
          id: `track-${numberOfTracks}`,
          steps: savedTrack.steps,
          pattern: savedTrack.pattern,
          volume: savedTrack.volume,
          mute: savedTrack.mute,
          solo: savedTrack.solo,
          currentStep: 0,
          nextNoteTime: 0
        };
        tracks.push(trackObj);

        
        const trackHTML = `
                    <div class="track" id="track-${numberOfTracks}">
                        <div class="trackDetails">
                            <div class="trackName">Track ${numberOfTracks}</div>
                            <div class="stepText">${savedTrack.steps} steps</div>
                            <div class="trackControls">
                                <div class="muteButton" id="mute-track-${numberOfTracks}" 
                                    style="background-color:${savedTrack.mute ? 'red' : ''}">M</div>
                                <div class="soloButton" id="solo-track-${numberOfTracks}"
                                    style="background-color:${savedTrack.solo ? 'red' : ''}">S</div>
                                <div class="stepSetter">
                                    <div class="minus" id="step-minus-track-${numberOfTracks}">-</div>
                                    <div class="stepcount">${savedTrack.steps}</div>
                                    <div class="plus" id="step-plus-track-${numberOfTracks}">+</div>
                                </div>
                            </div>
                            <input type="range" class="trackVolumeSlider" min="0" max="100" 
                                value="${savedTrack.volume * 100}" id="track-${numberOfTracks}-volume">
                        </div>
                        <div class="stepDesign" id="step-design-track-${numberOfTracks}"></div>
                    </div>
                `;
        mainbody.insertAdjacentHTML('beforeend', trackHTML);

        
        const stepDesign = document.getElementById(`step-design-track-${numberOfTracks}`);
        let tilesHTML = '';
        for (let i = 0; i < savedTrack.steps; i++) {
          const isActive = savedTrack.pattern[i] === 1;
          tilesHTML += `<div class="tile ${isActive ? 'active' : ''}" 
                        id="track-${numberOfTracks}-tile-${i}"></div>`;
        }
        stepDesign.innerHTML = tilesHTML;
      });
    };
  });
}



const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');


document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault(); 
    playPauseBtn.click();
  }
});

playPauseBtn.addEventListener('click', () => {
  if (isPlaying) {
    stopScheduler();
    document.querySelectorAll('.tile').forEach(t => t.classList.remove('playing'));
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    playPauseBtn.style.backgroundColor = 'rgb(255, 6, 6)';
  } else {
    startScheduler();
    animatePlayhead();
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
    playPauseBtn.style.backgroundColor = 'darkred';
  }
});

function animatePlayhead() {
  if (!isPlaying) return;

  const now = audioCtx.currentTime;

  eventQueue.forEach(event => {
    if (event.time <= now) {
      
      const allTiles = document.querySelectorAll(
        `#step-design-track-${event.trackIndex + 1} .tile`
      );

      allTiles.forEach(t => t.classList.remove('playing'));

      
      const tile = document.getElementById(
        `track-${event.trackIndex + 1}-tile-${event.stepIndex}`
      );
      if (tile) tile.classList.add('playing');
    }
  });

  
  const now2 = audioCtx.currentTime;
  while (eventQueue.length && eventQueue[0].time <= now2) {
    eventQueue.shift();
  }

  requestAnimationFrame(animatePlayhead);
}