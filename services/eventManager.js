const throttle = require('throttleit');
const path = require('path');
const eventBus = require.main.require('./util/eventBus');
const config = require.main.require('./util/config');
const recorder = require.main.require('./modules/record');
const player = require.main.require('./modules/play');
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
    player.stop();
    change(states.currentlyPlaying);
  } else if (!stateStatusStore.currentlyRecording) {
    player.play(playerOptions);
    change(states.currentlyPlaying);
  }
}

module.exports = function () {
  eventBus.on('StartStopRecordButtonPress', throttle(toggleStartStopRecording), config.defaultThrottleRate);
  eventBus.on('StartStopPlayButtonPress', throttle(toggleStartStopPlaying), config.defaultThrottleRate);
  //recorder.micInputStream.on('error', error => console.log(`MIC - Error in Input Stream: ${error}`));
  //recorder.micInputStream.on('data', data => console.log(`MIC - Received Input Stream: ${data.length}`))
  //recorder.micInputStream.on('startComplete', () => console.log('MIC - Got SIGNAL startComplete'));
  //recorder.micInputStream.on('stopComplete', () => console.log('MIC - Got SIGNAL stopComplete'));
  //recorder.micInputStream.on('pauseComplete', () => console.log('MIC - Got SIGNAL pauseComplete'));
  //recorder.micInputStream.on('resumeComplete', () => console.log('MIC - Got SIGNAL resumeComplete'));
  //recorder.micInputStream.on('silence', () => console.log('MIC - Got SIGNAL silence'));
  //recorder.micInputStream.on('processExitComplete', () => console.log('MIC - Got SIGNAL processExitComplete'));
}