const mic = require('mic');
const fs = require('fs');
const eventBus = require('../util/eventBus');
const config = require('../util/config');

const log = console.info;

let micInstance;
let micInputStream;
let outputFileStream;

/**
 * start listening
 * @param {Object} stream
 * @param {Object} options
 */
function attachListeners(stream, options) {
  stream.on('startComplete', () => {
    log('recording started');
    eventBus.emit(config.events.RECORDER_STARTED);
  });
  stream.on('stopComplete', () => {
    log('recording stopped');
    eventBus.emit(config.events.RECORDER_STOPPED);
  });

  stream.on('error', e => log(`MIC - error: ${e}`));

  if (options.isDebug) {
    log(`Recording to file: ${options.file}`);
    micInputStream.on('data', data => log(`MIC - input: ${data.length}`));
  }
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
  attachListeners(micInputStream, options);
  micInstance.start();
}

module.exports = {
  startRecording: options => setupRecordingInstance(options),

  stopRecording: function() {
    if (micInstance && micInstance.stop) {
      micInstance.stop();
      micInstance = null;
      micInputStream = null;
      outputFileStream = null;
    }
  },
};
