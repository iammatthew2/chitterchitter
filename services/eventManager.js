const eventBus = require.main.require('./util/eventBus');
const recorder = require.main.require('./modules/record');
const player = require.main.require('./modules/play');
const config = require.main.require('./constants/config');
const throttle = require('throttleit');
const path = require('path');

let currentlyRecording = false;
let currentlyPlaying = false;

function toggleStartStopRecording() {
  if (currentlyRecording) {
    recorder.stopRecording();
    currentlyRecording = !currentlyRecording;
  } else if (!currentlyPlaying){
    recorder.startRecording();
    currentlyRecording = !currentlyRecording;
  }
}

const options = {
  filename: path.join(__dirname) + '/dummy.wav',
  gain: 10,
  debug: true
}

function toggleStartStopPlaying() {
  if (currentlyPlaying) {
    player.stopPlaying();
    currentlyPlaying = !currentlyPlaying;
  } else if (!currentlyRecording){
    player.startPlaying(options);
    currentlyPlaying = !currentlyPlaying;
  }
}

module.exports = function () {
  eventBus.on('StartStopRecordButtonPress', throttle(toggleStartStopRecording), config.defaultThrottleRate);
  eventBus.on('StartStopPlayButtonPress', throttle(toggleStartStopPlaying), config.defaultThrottleRate);
}