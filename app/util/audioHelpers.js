const config = require('./config');
const player = require('../modules/play');
const recorder = require('../modules/record');
const { stateStore } = require('../util/stateStore');

const audioProcessIsRunning = () => stateStore.recorder === 'recording' || stateStore.player === 'playing';

function stopAudioProcesses() {
  player.stopPlaying();
  recorder.stopRecording();
}

module.exports.toggleStartStopRecording = () => {
  if (audioProcessIsRunning()) {
    stopAudioProcesses();
  } else if (stateStore.player !== 'playing'){
    recorder.startRecording(config.recorderOptions);
  }
};

module.exports.toggleStartStopPlaying = () => {
  if (audioProcessIsRunning()) {
    stopAudioProcesses();
  } else if (stateStore.recorder !== 'recording'){
    player.startPlaying(config.playerOptions);
  }
};
