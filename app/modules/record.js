const mic = require('mic');
const fs = require('fs');
const eventBus = require('../util/eventBus');
const config = require('../util/config');
const player = require('../modules/play');

const log = console.log;

let micInstance;
let micInputStream;
let outputFileStream;
let timer;


/**
 * start listening
 * @param {Object} stream
 */
function attachListeners(stream) {
  stream.on('startComplete', () => {
    log('recording started');
    eventBus.emit(config.events.RECORDER_STARTED);
  });
  stream.on('stopComplete', () => {
    log('recording stopped');
    eventBus.emit(config.events.RECORDER_STOPPED);
  });
}

/**
 * get ready to record
 * @param {Object} options
 */
function setupRecordingInstance(options) {
  micInstance = mic(options);
  micInputStream = micInstance.getAudioStream();

  // TODO: rename file to fileName like in player.js
  outputFileStream = fs.WriteStream(options.file);

  micInputStream.pipe(outputFileStream);
  micInputStream.on('error', e => log(`MIC - error: ${e}`));
  attachListeners(micInputStream);
  if (options.isDebug) {
    log(`Recording to file: ${options.file}`);
    micInputStream.on('data', data => log(`MIC - input: ${data.length}`));
  }
}

/**
 * start recording
 * @param {*} options
 */
function _startRecording(options) {
  setupRecordingInstance(options);
  micInstance.start();
}

/**
 * Wrap setTimeout for testing
 * @param {*} cb
 */
function delayCall(cb) {
  timer = setTimeout(cb, 1820);
}

module.exports = {
  startRecording: function(options) {
    player.startPlaying(config.preRecordPlayerOptions);
    const fncArg = () => _startRecording(options);
    delayCall(fncArg);
  },

  stopRecording: function() {
    clearTimeout(timer);
    if (micInstance && micInstance.stop) {
      micInstance.stop();
      micInstance = null;
      micInputStream = null;
      outputFileStream = null;
    }
  },
};
