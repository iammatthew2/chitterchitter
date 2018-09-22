const config = require('./config');
const player = require('../modules/play');
const recorder = require('../modules/record');
const { appState } = require('./appStateStore');
const { deviceState } = require('./deviceStateStore');

const log = console.log;

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
  log('the currentFileName is: ', name);
  return Object.assign({ file: name }, config.recorderOptions);
}

const audioSources = {
  received: 'received',
  recorded: 'recorded',
};

const effectNames = {
  startRecording: './soundEffects/startRecording.wav',
  tick: './soundEffects/tick.wav',
};

/**
 * Get the filename to be played
 * @param {String} audioSource
 * @return {String}
 */
function playerOptionGetFileName(audioSource) {
  let file;
  if (audioSource === audioSources.recorded) {
    file = deviceState.audioOutFileNames[`${appState.currentConnection}Send`];
  } else {
    file = config.audioInFileNames.audioOutFileNames[`${appState.currentConnection}In`];
  }
  return file;
}

/**
 * Fetches the recorder options populated with the dynamic file name
 * @param {String} audioSource
 * @param {String} effect
 * @return {Object}
 */
function playerOptions(audioSource, effect) {
  const currentFileName = effect ? effect : playerOptionGetFileName(audioSource);
  return Object.assign({ filename: currentFileName }, config.playerOptions);
}

module.exports.toggleStartStopRecording = () => {
  if (audioProcessIsRunning()) {
    stopAudioProcesses();
  } else if (appState.player !== 'playing') {
    const recordOptions = recorderOptions();
    player.startPlaying(playerOptions(null, effectNames.tick))
        .then(() => recorder.startRecording(recordOptions))
        .catch(e => log(`player.startPlaying errored or stopped: ${e}`));
  }
};

module.exports.toggleListenRecording = () => {
  log('lets listen to the current recording');
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
