const config = require('./config');
const player = require('../modules/play');
const recorder = require('../modules/record');
const { get } = require('./appStateStore');
const entities = config.appStates;

const log = console.log;
const isActive = val => val === 'recording' || val === 'playing';
const audioProcessIsRunning = () =>
  isActive(get(entities.recorder)) || isActive(get(entities.player));

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
  const name = `./audio/created/${get(entities.currentConnection)}`;
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
  const currentConnection = get(entities.currentConnection);
  if (audioSource === audioSources.recorded) {
    file = `./audio/created/${currentConnection}`;
  } else {
    file = config.audioInFileNames[`${currentConnection}In`];
    file = `./audio/received/${file}`;
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
  } else if (!isActive(get(entities.player))) {
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
  } else if (!isActive(get(entities.recorder))) {
    player.startPlaying(playerOptions(audioSources.recorded))
        .catch(e => log(`player.startPlaying errored or stopped: ${e}`));
  }
};

module.exports.toggleStartStopPlaying = () => {
  if (audioProcessIsRunning()) {
    stopAudioProcesses();
  } else if (!isActive(get(entities.recorder))) {
    player.startPlaying(playerOptions(audioSources.received))
        .catch(e => log(`player.startPlaying errored or stopped: ${e}`));
  }
};
