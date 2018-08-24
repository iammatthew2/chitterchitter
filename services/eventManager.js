const eventBus = require.main.require('./util/eventBus');
const recorder = require.main.require('./modules/record');
const player = require.main.require('./modules/play');
const config = require.main.require('./constants/config');
const throttle = require('throttleit');
const soundplayer = require('sound-player');
var path = require('path');

let currentlyRecording = false;
let currentlyPlaying = false;

function toggleStartStopRecording() {
  if (currentlyRecording) {
    recorder.stopRecording();
  } else if (!currentlyPlaying){
    recorder.startRecording();
  }
}

module.exports = function () {

  const options = {
    filename: path.join(__dirname) + '/dummy.wav',
    gain: 10,
    debug: true
  }

  player.play(options);
  eventBus.on('StartStopButtonPress', throttle(toggleStartStopRecording), config.defaultThrottleRate);
}