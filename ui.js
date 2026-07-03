const tempo = document.querySelector("#tempo");
const tempotext = document.querySelector(".tempotext");
let tempoval = tempo.value;
console.log(tempoval)
tempotext.innerHTML = `Tempo:${tempoval}`;
tempo.oninput = function () {
  tempoval = tempo.value;
  tempotext.innerHTML = `Tempo:${tempoval}`;
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


function setupPowerSwitch(callback) {
  const toggle = document.getElementById('power-switch');

  toggle.addEventListener('change', (e) => {
    const isOn = e.target.checked;
    callback(isOn); // Execute logic when switched
  });
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




//main
let numberOfTracks = 0;
const defaultSteps = 4;
let stepcount = [-1];
const newTrack = document.querySelector(".addTrackButton");
const mainbody = document.querySelector(".mainBox");
newTrack.addEventListener('click', () => {
  stepcount.push(4);
  const track = `
    <div class="track" id="track-${++numberOfTracks}">
            <div class="trackDetails">
                <div class="trackName">Track ${numberOfTracks}</div>
                <div class="stepText">${stepcount[numberOfTracks]} steps</div>
                <div class="trackControls">
                    <div class="muteButton" id="mute-track-${numberOfTracks}">M</div>
                    <div class="soloButton" id="solo-track-${numberOfTracks}">S</div>
                    <div class="stepSetter">
                        <div class="minus" id="step-minus-track-${numberOfTracks}">-</div>
                        <div class="stepcount">${stepcount[numberOfTracks]}</div>
                        <div class="plus" id="step-plus-track-${numberOfTracks}">+</div>
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
  for (let index = 0; index < stepcount[numberOfTracks]; index++) {
    tilesHTML += `<div class="tile"></div>`;
  }

  stepDesign.insertAdjacentHTML('beforeend', tilesHTML);
})



mainbody.addEventListener('click', (e) => {
  if (e.target.classList.contains('plus')) {
    const trackID = e.target.id.split('-').pop();
    if(stepcount[trackID]>9) return;
    stepcount[trackID]++;
    const stepDesign = document.getElementById(`step-design-track-${trackID}`);
    let tilesHTML = '';
    for (let index = 0; index < stepcount[trackID]; index++) {
      tilesHTML += `<div class="tile"></div>`;
    }
    stepDesign.innerHTML = tilesHTML;
    const stepCountText = e.target.previousElementSibling;
    if(stepCountText) {
       stepCountText.textContent = stepcount[trackID];
    }
  }
  
  if (e.target.classList.contains('minus')) {
    const trackID = e.target.id.split('-').pop();
    if(stepcount[trackID]<2) return;
    stepcount[trackID]--;
    const stepDesign = document.getElementById(`step-design-track-${trackID}`);
    let tilesHTML = '';
    for (let index = 0; index < stepcount[trackID]; index++) {
      tilesHTML += `<div class="tile"></div>`;
    }
    stepDesign.innerHTML = tilesHTML;
    const stepCountText = e.target.nextElementSibling;
    if(stepCountText) {
       stepCountText.textContent = stepcount[trackID];
    }
  }
  if (e.target.classList.contains('muteButton')) {
    const trackControls = e.target.closest('.trackControls');
    const soloBtn = trackControls.querySelector('.soloButton');
    if(e.target.style.backgroundColor === "") {
      e.target.style.backgroundColor = "red";
      e.target.style.scale = 1.3;
      soloBtn.style.backgroundColor = "";
      soloBtn.style.scale = 1;
    } else {
      e.target.style.backgroundColor = "";
      e.target.style.scale = 1;
    }
  }
  if (e.target.classList.contains('soloButton')) {
    const trackControls = e.target.closest('.trackControls');
    const muteBtn = trackControls.querySelector('.muteButton');
    if(e.target.style.backgroundColor === "") {
      e.target.style.backgroundColor = "red";
      e.target.style.scale = 1.3;
      muteBtn.style.backgroundColor = "";
      muteBtn.style.scale = 1;
    } else {
      e.target.style.backgroundColor = "";
      e.target.style.scale = 1;
    }
  }
  if (e.target.classList.contains('tile')) {
  e.target.classList.toggle('active');
  }
})





//audio playback
const header = document.querySelector(".header");

header.addEventListener('click', (e) => {
    if (e.target.classList.contains('play')) {
        // 1. Get or create the context
        const ctx = getAudioContext();
        
        // 2. Grab the exact time right now
        const now = ctx.currentTime;
        
        // 3. Pass it to the function
        makeSound(now);
    }
});


