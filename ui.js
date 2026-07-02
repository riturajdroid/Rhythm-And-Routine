const tempo=document.querySelector("#tempo");
const tempotext=document.querySelector(".tempotext");
let tempoval=tempo.value;
console.log(tempoval)
tempotext.innerHTML=`Tempo:${tempoval}`;
tempo.oninput=function(){
    tempoval=tempo.value;
    tempotext.innerHTML=`Tempo:${tempoval}`;
}



const swing=document.querySelector("#swing");
const swingtext=document.querySelector(".swingtext");
let swingval=swing.value;
console.log(swingval)
swingtext.innerHTML=`swing:${swingval}`;
swing.oninput=function(){
    swingval=swing.value;
    swingtext.innerHTML=`swing:${swingval}`;
}


function setupPowerSwitch(callback) {
  const toggle = document.getElementById('power-switch');
  
  toggle.addEventListener('change', (e) => {
    const isOn = e.target.checked;
    callback(isOn); // Execute logic when switched
  });
}

const masterVolume=document.querySelector("#masterVolume");
const masterVolumeText=document.querySelector(".masterVolumeText");
let masterVolumeVal=masterVolume.value;
console.log(masterVolumeVal)
masterVolumeText.innerHTML=`Master Volume:${masterVolumeVal}`;
masterVolume.oninput=function(){
    masterVolumeVal=masterVolume.value;
    masterVolumeText.innerHTML=`Master Volume:${masterVolumeVal}`;
}