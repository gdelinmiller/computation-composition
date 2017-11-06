
var socket = io.connect();
socket.on('connect', function(data){
  console.log(socket);
  console.log("we connected to the server as"+socket.id)
})

var options = {
    "oscillator" : {
    "type" : "sine",
        // "type" : "pwm",
        "modulationFrequency" : 5
    },
  "envelope" : {
                "attack" : 2.3,
                "decay" : 0.1,
                "sustain" : 0.5,
                "release" : 0.1,
            }
}

var synth = new Tone.Synth(options).toMaster();

var optionsTwo = {
    "oscillator" : {
    "type" : "sine",
        // "type" : "pwm",
        "modulationFrequency" : 0.2
    },
  "envelope" : {
                "attack" : 0.2,
                "decay" : 0.2,
                "sustain" : 0.2,
                "release" : 0.2,
            }
}

var synthTwo = new Tone.Synth(optionsTwo).toMaster();

function color(){
  var value = [255, 0]
  var r = value[Math.floor(Math.random()*value.length)]
  var g = value[Math.floor(Math.random()*value.length)]
  var b = value[Math.floor(Math.random()*value.length)]
  var rgb = 'rgb('+r+','+g+','+b+')'
  return rgb;
}

socket.on('sendOutNotes',function(chord){

  var note = chord[Math.floor(Math.random()*chord.length)]
  console.log(note)

  synth.triggerAttackRelease(note, 3)
  document.body.style.backgroundColor = color();

})


// *** PLAY SECOND SET OF NOTES ***

// socket.on('sendOutShortNotes',function(noteShort){
//   synthTwo.triggerAttackRelease(noteShort,1)
//   document.body.style.backgroundColor = color();
// })

// *** END PLAY SECOND SET OF NOTES ***
