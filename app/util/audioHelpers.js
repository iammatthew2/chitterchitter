const config = require('./config');
const player = require('../modules/play');
const recorder = require('../modules/record');
const { appState } = require('./appStateStore');
const { deviceState } = require('./deviceStateStore');

const audioProcessIsRunning = () => appState.recorder === 'recording' || appState.player === 'playing';

function stopAudioProcesses() {
  player.stopPlaying();
  recorder.stopRecording();
}

function recorderOptions(){
  const currentFileName = deviceState.audioOutFileNames[`${appState.currentConnection}Send`];
  console.log('the currentFileName is: ', currentFileName)
  return Object.assign({file: currentFileName}, config.recorderOptions);
}

const audioSources = {
  received: 'received',
  recorded: 'recorded'
}

function playerOptions(audioSource){
  let currentFileName;
  if (audioSource === audioSources.recorded) {
    currentFileName = condeviceStatefig.audioOutFileNames[`${appState.currentConnection}Send`];
  } else {
    console.log('this is not yet right. It is based off the recorded thing');
    currentFileName = deviceState.audioOutFileNames[`${appState.currentConnection}Send`];
  }
  return Object.assign({filename: currentFileName}, config.playerOptions);
}

module.exports.toggleStartStopRecording = () => {
  if (audioProcessIsRunning()) {
    stopAudioProcesses();
  } else if (appState.player !== 'playing'){
    recorder.startRecording(recorderOptions());
  }
};

module.exports.toggleListenRecording = () => {
  console.log('lets listen to the current recording');
  if (audioProcessIsRunning()) {
    stopAudioProcesses();
  } else if (appState.recorder !== 'recording'){
    player.startPlaying(playerOptions(audioSources.recorded));
  }
}

module.exports.toggleStartStopPlaying = () => {
  if (audioProcessIsRunning()) {
    stopAudioProcesses();
  } else if (appState.recorder !== 'recording'){
    player.startPlaying(playerOptions(audioSources.received));
  }
};
