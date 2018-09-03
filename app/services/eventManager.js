const throttle = require('throttleit');
const eventBus = require.main.require('./app/util/eventBus');
const recorder = require.main.require('./app/modules/record');
const iotHubInterface = require.main.require('./app/services/iotHubInterface');

const player = require.main.require('./app/modules/play');
const config = require.main.require('./app/util/config');
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

function init() {
  eventBus.on('StartStopRecordButtonPress', throttle(toggleStartStopRecording), config.defaultThrottleRate);
  eventBus.on('StartStopPlayButtonPress', throttle(toggleStartStopPlaying), config.defaultThrottleRate);
  eventBus.on(config.events.SEND_AUDIO_FILE_BUTTON_PRESS, throttle(() => iotHubInterface.iotHubActions.update({narf: 'this is new'}), config.defaultThrottleRate));
}

module.exports = { init };