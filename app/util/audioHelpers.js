const config = require('./config');
const player = require('../modules/play');
const recorder = require('../modules/record');
const { appState } = require('./appStateStore');
const { deviceState } = require('./deviceStateStore');

const audioProcessIsRunning = () =>
  appState.recorder === 'recording' || appState.player === 'playing';

/**
 * Kill all audio processes so we do not play and record at the same time ever
 */
function stopAudioProcesses() {
  player.stopPlaying();
  recorder.stopRecording();
}

/**
 * Fetches the recorder options populated with the dynamic file name
 * @return {Object}
 */
function recorderOptions() {
  const name = deviceState.audioOutFileNames[`${appState.currentConnection}Send`];
  console.log('the currentFileName is: ', name);
  return Object.assign({ file: name }, config.recorderOptions);
}

const audioSources = {
  received: 'received',
  recorded: 'recorded',
};

/**
 *  * Fetches the recorder options populated with the dynamic file name
 * @param {String} audioSource
 * @return {Object}
 */
function playerOptions(audioSource) {
  let currentFileName;
  if (audioSource === audioSources.recorded) {
    currentFileName = deviceState.audioOutFileNames[`${appState.currentConnection}Send`];
  } else {
    console.log('this is not yet right. It is based off the recorded thing');
    currentFileName = deviceState.audioOutFileNames[`${appState.currentConnection}Send`];
  }
  return Object.assign({ filename: currentFileName }, config.playerOptions);
}

module.exports.toggleStartStopRecording = () => {
  if (audioProcessIsRunning()) {
    stopAudioProcesses();
  } else if (appState.player !== 'playing') {
    recorder.startRecording(recorderOptions());
  }
};

module.exports.toggleListenRecording = () => {
  console.log('lets listen to the current recording');
  if (audioProcessIsRunning()) {
    stopAudioProcesses();
  } else if (appState.recorder !== 'recording') {
    player.startPlaying(playerOptions(audioSources.recorded));
  }
};

module.exports.toggleStartStopPlaying = () => {
  if (audioProcessIsRunning()) {
    stopAudioProcesses();
  } else if (appState.recorder !== 'recording') {
    player.startPlaying(playerOptions(audioSources.received));
  }
};
