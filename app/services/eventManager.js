const eventBus = require.main.require('./app/util/eventBus');
const recorder = require.main.require('./app/modules/record');
const player = require.main.require('./app/modules/play');
const config = require.main.require('./app/util/config');
const throttle = require('throttleit');
const { change, states, stateStatusStore } = require.main.require('./app/util/stateStore');

function toggleStartStopRecording() {
  if (stateStatusStore.currentlyRecording) {
    recorder.stopRecording();
    change(states.currentlyRecording);
  } else if (!stateStatusStore.currentlyPlaying){
    recorder.startRecording(config.recorderOptions);
    change(states.currentlyRecording);
  }
}

function toggleStartStopPlaying() {
  if (stateStatusStore.currentlyPlaying) {
    player.stopPlaying();
    change(states.currentlyPlaying);
  } else if (!stateStatusStore.currentlyRecording){
    player.startPlaying(config.playerOptions);
    change(states.currentlyPlaying);
  }
}

module.exports = function () {
  eventBus.on('StartStopRecordButtonPress', throttle(toggleStartStopRecording), config.defaultThrottleRate);
  eventBus.on('StartStopPlayButtonPress', throttle(toggleStartStopPlaying), config.defaultThrottleRate);
}