const eventBus = require.main.require('./util/eventBus');
const recorder = require.main.require('./modules/record');
const player = require.main.require('./modules/play');
const config = require.main.require('./util/config');
const throttle = require('throttleit');
const path = require('path');
const { change, states, stateStatusStore } = require.main.require('./util/stateStore');

function toggleStartStopRecording() {
  if (stateStatusStore.currentlyRecording) {
    recorder.stopRecording();
    change(states.currentlyRecording);
  } else if (!stateStatusStore.currentlyPlaying){
    recorder.startRecording();
    change(states.currentlyRecording);
  }
}


const playerOptions = {
  filename: config.audioFiles.audioInA,
  gain: 10,
  debug: true
}

function toggleStartStopPlaying() {
  if (stateStatusStore.currentlyPlaying) {
    player.stopPlaying();
    change(states.currentlyPlaying);
  } else if (!stateStatusStore.currentlyRecording){
    player.startPlaying(player.startPlaying(playerOptions));
    change(states.currentlyPlaying);
  }
}

/**
 connectionsKnobTurn(){
   updateState  <-- you are now connected with #3;
   updateLights <--- turn of all connection lights, turn on #3
 }
 */

module.exports = function () {
  eventBus.on('StartStopRecordButtonPress', throttle(toggleStartStopRecording), config.defaultThrottleRate);
  eventBus.on('StartStopPlayButtonPress', throttle(toggleStartStopPlaying), config.defaultThrottleRate);
  //player.on('play', light the play light);
  //player.on('stop', light the stop light);
  //eventBus.on('turn the familiyConections knob', run the connectionsKnobTurn fn)
}